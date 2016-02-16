(function () {
    'use strict';
    angular.module('psteam.common.filetiles.fileAttachedTasks.controller', [])
        .controller('fileTileAttachedTasksController', function ($scope,
                                                                 logger) {
            logger.trace('fileTileAttachedTasksController');

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

            this.attachDocTask = function (docTask) {
                attachTask(that.viewModel.documents.attachedDocumentTasks,
                    that.viewModel.documents.addedDocumentTasks,
                    that.taskReply.attachedDocumentTasks,
                    docTask);
            };


            this.detachDocTask = function (docTask) {
                var index = that.taskReply.attachedDocumentTasks.indexOf(docTask);
                that.taskReply.attachedDocumentTasks.splice(index, 1);

                // If this is a doc task that we've added ourselves, remove it completely.
                // If it was an existing link, set it to "removed" so the change can be undone if needed.
                var index2 = that.viewModel.documents.addedDocumentTasks.indexOf(docTask);
                if (index2 > -1) {
                    that.viewModel.documents.addedDocumentTasks.splice(index2, 1);
                } else {
                    var index3 = that.viewModel.documents.attachedDocumentTasks.indexOf(docTask);
                    that.viewModel.documents.attachedDocumentTasks[index3].removed = true;
                }
            };
        });
})();
