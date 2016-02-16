(function () {
    'use strict';
    angular.module('psteam.common.filetiles.fileAddedFolders.controller', [])
        .controller('fileAddedFoldersController', function ($scope,
                                                            logger) {
            logger.trace('fileAddedFoldersController');

            var that = this;

            this.taskReply = $scope.ctrl.taskReply;
            this.viewModel = $scope.ctrl.viewModel;

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
