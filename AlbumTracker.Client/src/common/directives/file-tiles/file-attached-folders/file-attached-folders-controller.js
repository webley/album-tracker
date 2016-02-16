(function () {
    'use strict';
    angular.module('psteam.common.filetiles.fileAttachedFolders.controller', [])
        .controller('fileTileAttachedFoldersController', function ($scope,
                                                                   logger) {
            logger.trace('fileTileAttachedFoldersController');

            var that = this;

            this.taskReply = $scope.ctrl.taskReply;
            this.viewModel = $scope.ctrl.viewModel;

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

            this.attachDocFolder = function (folder) {
                attachTask(that.viewModel.documents.attachedDocumentFolders,
                    that.viewModel.documents.addedDocumentFolders,
                    that.taskReply.attachedDocumentFolders,
                    folder);
            }

            this.detachDocFolder = function (folder) {
                var index = that.taskReply.attachedDocumentFolders.indexOf(folder);
                that.taskReply.attachedDocumentFolders.splice(index, 1);

                // If this is a doc task that we've added ourselves, remove it completely.
                // If it was an existing link, set it to "removed" so the change can be undone if needed.
                var index2 = that.viewModel.documents.addedDocumentFolders.indexOf(folder);
                if (index2 > -1) {
                    that.viewModel.documents.addedDocumentFolders.splice(index2, 1);
                } else {
                    var index3 = that.viewModel.documents.attachedDocumentFolders.indexOf(folder);
                    that.viewModel.documents.attachedDocumentFolders[index3].removed = true;
                }
            };

        });
})();
