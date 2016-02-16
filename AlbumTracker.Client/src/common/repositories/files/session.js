(function () {
    'use strict';
    angular.module('psteam.common.repositories.files.session', [])
        .constant('chunkSize', 4 * 1024 * 1024)
        .service('FileUploadSessionFactory',
        function (chunkSize, $q, logger) {
            logger.trace("FileUploadSessionFactory");
            var FileUploadSession = function (file, sessionId) {
                logger.trace("FileUploadSessionFactory.FileUploadSession", {
                    'file': file,
                    'sessionId': sessionId
                });
                var that = this;

                this.chunkSize = chunkSize;
                this.file = file;
                this.progressCallbacks = [];

                this.cancelled = false;
                this.preparing = true;
                that.uploading = false;
                that.done = false;
                that.error = false;
                that.progress = 0;

                this.sessionId = $q.when(sessionId);
                this.sessionIdObject = undefined;
                this.sessionId
                    .then(function (id) {
                        logger.trace("FileUploadSessionFactory.sessionId.then.success(id = '%s')", id);
                        that.preparing = false;
                        that.uploading = true;
                        that.sessionIdObject = id;
                    }, function () {
                        logger.error("FileUploadSessionFactory.sessionId.then.error");
                        that.preparing = false;
                        that.error = true;
                    });

                this.deferred = $q.defer();

                this.deferred.promise.then(function () {
                    logger.trace("FileUploadSessionFactory.deferred.promise.then.success");
                    that.uploading = false;
                    that.done = true;

                }, function (err) {
                    logger.error("FileUploadSessionFactory.deferred.promise.then.error");
                    if (!that.cancelled) {
                        that.error = err;
                        that.uploading = false;
                    }
                });

                this.canceller = $q.defer();
                this.canceller.promise.then(function () {
                    logger.trace("FileUploadSessionFactory.canceller.promise.then.success");
                    that.cancelled = true;
                    that.uploading = false;
                });

            };

            FileUploadSession.prototype = {
                cancel: function () {
                    logger.trace("FileUploadSessionFactory.FileUploadSession.prototype.cancel");
                    this.canceller.resolve();
                },

                progressCallback: function (progress) {
                    logger.trace("FileUploadSessionFactory.progressCallback(progress = %d)", progress);
                    var that = this;

                    this.progress = progress;

                    if (this.progressCallbacks.length) {
                        var callbackCall = function (callback) {
                            callback.call(that, progress);
                        };

                        this.progressCallbacks.forEach(callbackCall);
                    }
                }
            };
            return FileUploadSession;
        }
    );
})();
