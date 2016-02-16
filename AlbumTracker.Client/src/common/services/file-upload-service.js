(function () {
    'use strict';
    angular.module('psteam.common.services.fileUpload', [])
        .service('fileUploadService', function (FilesRepositoryService,
                                                toastService,
                                                gettextCatalog,
                                                logger) {

            function fileListToArray(fileList) {
                logger.trace('FileUploadController:fileListToArray', fileList);
                var res = [];
                var folderError = false;
                for (var i = 0; i < fileList.length; i++) {
                    var file = fileList[i];

                    // It's possible to drag-and-drop folders as well as files, which is only supported in chrome.
                    // Not sure if we will support it at all, though.
                    if (file.type === '' && file.size % 4096 === 0) {
                        folderError = true;
                    } else {
                        res.push(fileList[i]);
                    }
                }

                if (folderError) {
                    toastService.warning(gettextCatalog.getString('Folder upload is not currently supported.'));
                }
                return res;
            }

            function handleVersioning(sessions, viewModel) {
                sessions.forEach(function (session) {
                    var file = session.file;
                    var existingFiles = viewModel.documents.fileAttachments.filter(function (value) {
                        return file.name === value.fileName;
                    });

                    if (existingFiles.length > 0) {
                        session.version = existingFiles[0].versions.length + 1;
                    }
                });
            }

            function onFileUploaded(session, res) {
                logger.trace('FileUploadController:onFileUploaded', {
                    'res': res,
                    'session': session
                });

                // use here binded this
                this.taskReply.addedAttachedFiles.push(session);
                this.viewModel.documents.addedFileAttachments.push(session);
            }

            function onUploadError(session, err) {
                if (err) {
                    logger.trace('FileUploadController:onUploadError', {
                        'err': err,
                        'session': session
                    });

                    session.cancel();
                    toastService.error(gettextCatalog.getString('Unable to upload the file'));
                }
            }

            function upload(sessions, controlData) {
                logger.trace('TaskUpdateController:upload', sessions);
                sessions =
                    FilesRepositoryService.uploadSessions(sessions);

                sessions.forEach(function (session) {
                    session.deferred.promise.then(
                        onFileUploaded.bind(controlData, session),
                        onUploadError.bind(null, session)
                    );
                });

                controlData.viewModel.documents.uploads = controlData.viewModel.documents.uploads.concat(sessions);
                return sessions;
            }

            this.filesSelected = function (viewModel, taskReply, addOnlyOne, newFiles) {

                logger.trace('FileUploadService.filesSelected', newFiles);

                if (!newFiles || newFiles.length == 0) {
                    logger.warn('DocumentUpdateController.filesSelected: no file selected');
                    return;
                }

                var controlData = {
                    viewModel: viewModel,
                    taskReply: taskReply
                };

                var files = null;

                // Switcher of behavior according to defined parameter
                if (addOnlyOne) {

                    var file;

                    var fileName = viewModel.documents.fileAttachments.length === 0 ? null : viewModel.documents.fileAttachments[0].fileName;

                    if (newFiles.length > 1) {

                        logger.warn('FileUploadService.filesSelected: more than one file selected');

                        var fileArray = fileListToArray(newFiles);

                        var matchingFiles = fileArray.filter(function (newFile) {
                            return fileName === null || fileName === newFile.name;
                        });

                        if (matchingFiles.length === 1) {
                            file = matchingFiles[0];
                        } else if (matchingFiles.length === 0) {
                            toastService.warning(gettextCatalog.getString('The uploaded file must be called {{fileName}}', { fileName:fileName }));
                            return;
                        } else if (matchingFiles.length > 1) {

                            toastService.warning(gettextCatalog.getString('You must upload a single file called {{fileName}}', { fileName:fileName }));
                            return;
                        }
                    } else {
                        file = newFiles[0];
                    }

                    if (file.name !== fileName && fileName !== null) {

                        logger.warn('FileUploadService.filesSelected: uploaded file had incorrect name',
                            { docFileName: fileName, uploadFileName: file.name });

                        toastService.warning(gettextCatalog.getString('The uploaded file must be called {{fileName}}', { fileName: fileName }));

                        return;
                    }

                    var uploadingOrUploaded = viewModel.documents.uploads.map(function (file) {
                        return file.file.name;
                    });

                    if (uploadingOrUploaded.indexOf(file.name) !== -1) {
                        logger.warn('FileUploadService.filesSelected: file has already been uploaded');
                        return;
                    }

                    files = [file];

                } else {

                    var fileArray = fileListToArray(newFiles);

                    files = fileArray
                        .filter(function (file) {
                            var uploadingOrUploaded = viewModel.documents.uploads.map(function (file) {
                                return file.file.name;
                            });

                            return file.size > 0 &&
                                uploadingOrUploaded.indexOf(file.name) === -1;
                        });

                } // end of 'if (addOnlyOne)'

                if (files.length > 0) {

                    var sessions =
                        FilesRepositoryService.createUploadSessions(files);

                    upload(sessions, controlData);

                    handleVersioning(sessions, viewModel);
                }
            };

        });
})();
