(function () {
    'use strict';
    angular.module('psteam.common.filetiles.fileAddedTasks.controller', [])
        .controller('fileAddedTasksController', function ($scope,
                                                          FilesRepositoryService,
                                                          logger) {
            logger.trace('fileAddedTasksController');

            var that = this;

            this.taskReply = $scope.ctrl.taskReply;
            this.viewModel = $scope.ctrl.viewModel;

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

            this.getDocumentDownloadUrl = function (doc) {
                return FilesRepositoryService.getFileUrl(doc.fileId);
            };
        });
})();
