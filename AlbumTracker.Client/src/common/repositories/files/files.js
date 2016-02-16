(function () {
    'use strict';
    angular.module('psteam.common.repositories.files', [
        'psteam.common.repositories.files.session',
        'psteam.common.data-access.files',
        'psteam.common.services.correlation'
    ])

        .constant('maxConcurrency', 2)

        .service('FilesRepositoryService', function (FilesDataAccessService,
                                                     FileUploadSessionFactory,
                                                     maxConcurrency,
                                                     CorrelationService,
                                                     logger) {
            logger.trace("FilesRepositoryService");
            var that = this;
            var activeUploads = 0;
            var queued = [];

            var activate = function () {
                logger.trace("FilesRepositoryService:activate");
                if (!queued.length) {
                    return;
                }

                activeUploads++;

                var session = queued.pop();

                session.sessionId.then(function (sessionId) {
                    logger.trace("FilesRepositoryService:session.sessionId.then.success(sessionId = '%s')", sessionId);
                    return FilesDataAccessService.upload(
                        session.file,
                        sessionId,
                        session.chunkSize,
                        session.progressCallback.bind(
                            session),
                        session.canceller.promise
                    ).then(
                        function (res) {
                            logger.trace("FilesRepositoryService:session.sessionId.then.success:FilesDataAccessService.upload.then.success", res);
                            session.deferred.resolve(res);
                            activate();
                        },
                        function (err) {
                            logger.error("FilesRepositoryService:session.sessionId.then.success:FilesDataAccessService.upload.then.error", err);
                            session.deferred.reject(err);
                            activate();
                        }
                    )
                        .finally(function () {
                            logger.trace("FilesRepositoryService:session.sessionId.then.success:FilesDataAccessService.upload.then.finally");
                            activeUploads--;
                        });
                });
            };

            var updateQueue = function () {
                logger.trace("FilesRepositoryService:updateQueue");
                var numberOfFreeSlots = maxConcurrency - activeUploads;

                for (var i = 0; i < numberOfFreeSlots; i++) {
                    activate();
                }
            };

            that.createUploadSession = function (file) {
                logger.trace("FilesRepositoryService:createUploadSession", file);
                var sessionIdPromise = FilesDataAccessService.createUploadSession(
                    file);
                return new FileUploadSessionFactory(file,
                    sessionIdPromise);
            };

            that.cancelUploadSession = function (session) {
                logger.trace("FilesRepositoryService:cancelUploadSession", session);
                return FilesDataAccessService.cancelUploadSession(session);
            };

            that.createUploadSessions = function (files) {
                logger.trace("FilesRepositoryService:createUploadSessions", files);
                return files.map(function (file) {
                    return that.createUploadSession(file);
                });
            };

            that.cancelUploadSessions = function (sessions) {
                logger.trace("FilesRepositoryService:cancelUploadSessions", sessions);
                return FilesDataAccessService.cancelUploadSessions(sessions);
            };

            that.uploadFile = function (file) {
                logger.trace("FilesRepositoryService:uploadFile", file);
                var session = that.createUploadSession(file);
                return that.uploadSessions([session]);
            };

            that.uploadFiles = function (files) {
                logger.trace("FilesRepositoryService:uploadFiles", files);
                var sessions = that.createUploadSessions(files);
                return that.uploadSessions(sessions);
            };

            that.uploadSessions = function (sessions) {
                logger.trace("FilesRepositoryService:uploadSessions", sessions);
                queued = queued.concat(sessions);
                updateQueue();

                return sessions;
            };

            that.getFileUrl = function (fileId) {
                logger.trace("FilesRepositoryService:getFileUrl(fileId = '%s')", fileId);
                return FilesDataAccessService.getFileUrl(fileId);
            };

            that.getTempFileUrl = function (sessionId) {
                logger.trace("FilesRepositoryService:getTempFileUrl(sessionId = '%s')", sessionId);
                return FilesDataAccessService.getTempFileUrl(sessionId);
            };

            that.downloadFile = function () {
                logger.trace("FilesRepositoryService:downloadFile");
                CorrelationService.generateRequestCorrelationId();
            };
        }
    );

})();
