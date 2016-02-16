(function () {
    'use strict';
    angular.module('psteam.common.filetiles.fileAdded.controller', [])
        .controller('fileTileAddedController', function ($scope,
                                                            FilesRepositoryService,
                                                            logger) {
            logger.trace('fileTileAddedController');

            var that = this;

            this.taskReply = $scope.ctrl.taskReply;
            this.viewModel = $scope.ctrl.viewModel;

            function removeSessionFromArray(array, session) {

                logger.trace('fileTileAddedController:removeSessionFromArray', {
                    'array': array,
                    'session': session
                });

                var index = array.indexOf(session);

                if (index !== -1) {
                    return array.splice(index, 1);
                } else {
                    return [];
                }
            }

            function handleVersioning(sessions) {
                sessions.forEach(function (session) {
                    var file = session.file;
                    var existingFiles = that.viewModel.documents.fileAttachments.filter(function (value) {
                        return file.name === value.fileName;
                    });

                    if (existingFiles.length > 0) {
                        session.version = existingFiles[0].versions.length + 1;
                    }
                });
            };

            var onFileUploaded = function (session, res) {
                logger.trace('fileTileAddedController:onFileUploaded', {
                    'res': res,
                    'session': session
                });

                that.taskReply.addedAttachedFiles.push(session);
                that.viewModel.documents.addedFileAttachments.push(session);
            };

            var onUploadError = function (session, err) {
                if (err) {
                    logger.trace('fileTileAddedController:onUploadError', {
                        'err': err,
                        'session': session
                    });

                    session.cancel();
                    toastService.error(gettextCatalog.getString('Unable to upload the file'));
                }
            };

            this.cancel = function (session) {
                logger.trace('fileTileAddedController.cancel', session);
                removeSessionFromArray(that.viewModel.documents.uploads, session);

                if (session.done) {
                    removeSessionFromArray(that.taskReply.addedAttachedFiles, session);
                    removeSessionFromArray(that.viewModel.documents.addedFileAttachments, session);
                } else {
                    if (that.toUpload) {
                        removeSessionFromArray(that.toUpload, session);
                    }
                }

                FilesRepositoryService.cancelUploadSession(session);

                session.cancel();
            };

            this.retry = function (session) {

                var sessions = FilesRepositoryService.createUploadSessions([session.file]);

                sessions =
                    FilesRepositoryService.uploadSessions(sessions);

                sessions.forEach(function (session) {
                    session.deferred.promise.then(
                        onFileUploaded.bind(that, session),
                        onUploadError.bind(that, session)
                    );
                });

                var index = that.viewModel.documents.uploads.indexOf(session);

                if (index > -1) {
                    that.viewModel.documents.uploads[index] = sessions[0];
                    handleVersioning(sessions);
                }
            };

        });
})();
