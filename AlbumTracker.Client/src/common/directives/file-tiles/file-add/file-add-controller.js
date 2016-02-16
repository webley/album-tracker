(function () {
    'use strict';
    angular.module('psteam.common.filetiles.fileAdd.controller', ['psteam.common.tasks.authorisation',
                                                                  'psteam.common.services.fileUpload'])
        .controller('fileTileAddController', function ($scope,
                                                       $attrs,
                                                       $mdDialog,
                                                       fileUploadService,
                                                       logger) {
            logger.trace('fileTileAddController');

            var that = this;

            this.taskReply = $scope.ctrl.taskReply;
            this.viewModel = $scope.ctrl.viewModel;

            // Permissions
            this.authorisation = $scope.ctrl.authorisation;

            // Show dialogs to attach Task or Folder if that is necessary
            this.showAttachDialogs = $attrs.showAttachDialogs === 'true';

            // Only one file can be added
            this.addOnlyOne = $attrs.addOnlyOne === 'true';

            function attachTask(vmExistingCollection, vmAddedCollection, replyCollection, task) {
                if (task && angular.isString(task.topicCode)) {
                    var existingTasks = vmExistingCollection.filter(function (innerTask) {
                        return (task.topicCode === innerTask.topicCode) &&
                            (task.id === innerTask.id);
                    });

                    var addedTasks = vmAddedCollection.filter(function (innerTask) {
                        return task.taskCode === innerTask.taskCode;
                    });

                    var existing = existingTasks.length > 0;
                    var added = addedTasks.length > 0;

                    if (added) {
                        return;
                    }

                    if (!existing) {
                        replyCollection.push(task);
                        vmAddedCollection.push(task);
                    } else {
                        existingTasks[0].removed = false;
                    }
                }
            }

            function attachDocTask(docTask) {
                attachTask(that.viewModel.documents.attachedDocumentTasks,
                    that.viewModel.documents.addedDocumentTasks,
                    that.taskReply.attachedDocumentTasks,
                    docTask);
            }

            function attachDocFolder(folder) {
                attachTask(that.viewModel.documents.attachedDocumentFolders,
                    that.viewModel.documents.addedDocumentFolders,
                    that.taskReply.attachedDocumentFolders,
                    folder);
            }

            this.showAttachDocTaskDialog = function (event) {
                $mdDialog.show({
                        controller: function docTaskDialogController($mdDialog, DocumentsRepositoryService) {
                            logger.trace("TaskUpdateController.attachDocTask:$mdDialog.show:controller");
                            this.docsAutocomplete = DocumentsRepositoryService.autocompleteDocuments;
                            this.cancel = function () {
                                logger.trace("TaskUpdateController.attachDocTask:$mdDialog.show:controller.cancel");
                                $mdDialog.cancel();
                            };
                            this.attachDocument = function () {
                                logger.trace("TaskUpdateController.attachDocTask:$mdDialog.show:controller.attachDocument");
                                $mdDialog.hide(this.document);
                            };
                        },
                        controllerAs: 'ctrl',
                        templateUrl: 'common/templates/attach-document-dialog.tpl.html',
                        targetEvent: event,
                        focusOnOpen: false
                    })
                    .then(function (document) {
                        logger.trace("TaskUpdateController.attachDocTask:$mdDialog.show:success", document);
                        attachDocTask(document);
                    }, function (cancellation) {
                        logger.trace("TaskUpdateController.attachDocTask:$mdDialog.show:cancel", cancellation);
                    });
            };

            this.showAttachDocFolderDialog = function (event) {
                $mdDialog.show({
                        controller: function docFolderDialogController($mdDialog, FoldersRepositoryService) {
                            logger.trace("TaskUpdateController.attachDocFolder:$mdDialog.show:controller");
                            this.docsAutocomplete = FoldersRepositoryService.autocompleteFolders;
                            this.cancel = function () {
                                logger.trace("TaskUpdateController.attachDocFolder:$mdDialog.show:controller.cancel");
                                $mdDialog.cancel();
                            };
                            this.attachDocument = function () {
                                logger.trace("TaskUpdateController.attachDocFolder:$mdDialog.show:controller.attachDocument");
                                $mdDialog.hide(this.document);
                            };
                        },
                        controllerAs: 'ctrl',
                        templateUrl: 'common/templates/attach-folder-dialog.tpl.html',
                        targetEvent: event,
                        focusOnOpen: false
                    })
                    .then(function (folder) {
                        logger.trace("TaskUpdateController.attachDocFolder:$mdDialog.show:success", folder);
                        attachDocFolder(folder);
                    }, function (cancellation) {
                        logger.trace("TaskUpdateController.attachDocFolder:$mdDialog.show:cancel", cancellation);
                    });
            };

            // Callback for 'file-input' directive
            this.filesSelected = fileUploadService.filesSelected.bind(null, that.viewModel, that.taskReply, that.addOnlyOne);

        });
})();
