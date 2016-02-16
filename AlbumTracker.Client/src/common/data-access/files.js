(function () {
    'use strict';
    var FILE_UPLOAD_SERVICE_PATH = 'file';

    //#region "XHR HACK"
    // TAKEN FROM angular-file-upload directive
    // https://github.com/danialfarid/angular-file-upload/blob/master/dist/angular-file-upload.js
    function patchXHR(fnName, newFn) {
        window.XMLHttpRequest.prototype[fnName] = newFn(window.XMLHttpRequest.prototype[fnName]);
    }

    if (window.XMLHttpRequest && !window.XMLHttpRequest.__isFileAPIShim) {
        patchXHR('setRequestHeader', function (orig) {
            return function (header, value) {
                if (header === '__setXHR_') {
                    var val = value(this);
                    // fix for angular < 1.2.0
                    if (val instanceof Function) {
                        val(this);
                    }
                } else {
                    orig.apply(this, arguments);
                }
            };
        });
    }

    //#endregion

    angular.module('psteam.common.data-access.files', ['file-upload-interceptor'])
        .service('FilesDataAccessService', function ($q, $http, logger) {
            logger.trace('FilesDataAccessService');
            var that = this;
            this.createUploadSession = function (file) {
                logger.trace('FilesDataAccessService.createUploadSession', file);
                var deferred = $q.defer();
                $http.post('api/' + FILE_UPLOAD_SERVICE_PATH + '/upload', {
                    fileName: file.name,
                    fileSize: file.size
                }).success(function (data, status, headers, config) {
                    logger.trace("FilesDataAccessService.createUploadSession:$http.post('api/file/upload').success", data);
                    deferred.resolve(data.uploadId);
                })
                    .error(function (data, status, headers, config) {
                        logger.error("FilesDataAccessService.createUploadSession:$http.post('api/file/upload').error", data);
                        deferred.reject(data);
                    });
                return deferred.promise;
            };

            this.cancelUploadSession = function (session) {
                logger.trace('FilesDataAccessService.cancelUploadSession', session);
                if (!session.cancelled) {
                    session.cancel();
                }

                var deferred = $q.defer();
                $http.delete('api/' + FILE_UPLOAD_SERVICE_PATH + '/upload/' + session.sessionIdObject)
                    .success(function (data, status, headers, config) {
                        logger.trace("FilesDataAccessService.cancelUploadSession:$http.post('api/file/upload').success", data);
                        deferred.resolve(data.uploadId);
                    })
                    .error(function (data, status, headers, config) {
                        logger.error("FilesDataAccessService.cancelUploadSession:$http.post('api/file/upload').error", data);
                        deferred.reject(data);
                    });
                return deferred.promise;
            };

            this.cancelUploadSessions = function (sessions) {
                logger.trace('FilesDataAccessService.cancelUploadSessions', sessions);
                var promises = [];
                angular.forEach(sessions, function (session) {
                    promises.push(that.cancelUploadSession(session));
                });

                return $q.all(promises);
            };

            var sendChunk = function (uploadSessionId,
                                      data,
                                      first,
                                      last,
                                      size,
                                      progressCallback,
                                      canceller) {
                logger.trace('FilesDataAccessService.sendChunk', {
                    'uploadSessionId': uploadSessionId,
                    'data': data,
                    'first': first,
                    'last': last,
                    'size': size,
                    'progressCallback': progressCallback,
                    'canceller': canceller
                });
                var contentRange = 'bytes ' + first + '-' + last + '/' + size;
                var deferred = $q.defer();
                $http.patch('api/' + FILE_UPLOAD_SERVICE_PATH + '/upload/' + uploadSessionId,
                    data,
                    {
                        progressCallback: progressCallback,
                        timeout: canceller,
                        headers: {'Content-Range': contentRange}
                    }).success(function (data, status, headers, config) {
                        logger.trace("FilesDataAccessService.sendChunk:$http.patch('api/file/upload/" + uploadSessionId + "').success", data);
                        deferred.resolve(data.uploadId);
                    })
                    .error(function (data, status, headers, config) {
                        if (status != 0) {
                            logger.error("FilesDataAccessService.sendChunk:$http.patch('api/file/upload/" + uploadSessionId + "').error", data);
                        } else {
                            // Status is 0 most likely because the request was cancelled by the client.  In which case
                            // this is not really an error, so resolve successfully.
                            logger.trace("FilesDataAccessService.sendChunk:$http.patch('api/file/upload/" + uploadSessionId + "').error", data);
                            deferred.resolve(null);
                        }

                        deferred.reject(data);
                    });
                return deferred.promise;

            };

            this.upload = function (file,
                                    sessionId,
                                    sessionChunkSize,
                                    progressCallback,
                                    canceller) {
                logger.trace('FilesDataAccessService.upload', {
                    'file': file,
                    'sessionId': sessionId,
                    'sessionChunkSize': sessionChunkSize,
                    'progressCallback': progressCallback,
                    'canceller': canceller
                });
                var size = file.size;
                var cancelled = false;

                canceller.then(function () {
                    cancelled = true;
                });

                var onChunkUploadDone = function (last, uploaded) {
                    logger.trace('FilesDataAccessService:onChunkUploadDone', {
                        'last': last,
                        'uploaded': uploaded
                    });
                    if (!cancelled) {

                        if (uploaded > size) {
                            uploaded = size;
                        }

                        var progress =
                            Math.round((uploaded / size) * 100);

                        if (progress !== 100) {
                            return uploadChunk(
                                last,
                                uploaded);
                        }
                    }

                    return sessionId;
                };

                var uploadChunk = function (first, uploaded) {
                    logger.trace('FilesDataAccessService:uploadChunk', {
                        'first': first,
                        'uploaded': uploaded
                    });
                    var left = size - uploaded;
                    var chunkSize =
                        left < sessionChunkSize ? left :
                        sessionChunkSize;

                    var last = first + chunkSize - 1;
                    var data = file.slice(first, last + 1);

                    return sendChunk(
                        sessionId,
                        data,
                        first,
                        last,
                        size,
                        function (progressEvent) {
                            logger.trace("FilesDataAccessService:sendChunk:progress-callback", progressEvent);
                            var pos = (first + progressEvent.loaded);
                            var progress =
                                Math.round(pos / size * 100);
                            progressCallback(progress);
                        },
                        canceller)
                        .then(function () {
                            logger.trace("FilesDataAccessService.sendChunk.then.success");
                            uploaded += chunkSize;
                            return onChunkUploadDone(
                                last,
                                uploaded);
                        });
                };

                return uploadChunk(0, 0);
            };

            this.getFileUrl = function (fileId) {
                logger.trace("FilesDataAccessService.getFileUrl(fileId = '%s')", fileId);
                return 'api/' + FILE_UPLOAD_SERVICE_PATH + '/download/' + fileId;
            };

            this.getTempFileUrl = function(sessionId){
                logger.trace("FilesDataAccessService.getTempFileUrl(sessionId = '%s')", sessionId);
                return 'api/' + FILE_UPLOAD_SERVICE_PATH + '/temp/' + sessionId;
            }
        });
})();
