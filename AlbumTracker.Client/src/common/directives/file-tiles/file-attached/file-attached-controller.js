(function () {
    'use strict';
    angular.module('psteam.common.filetiles.fileAttached.controller', [])
        .controller('fileTileAttachedController', function ($scope,
                                                            FilesRepositoryService,
                                                            logger) {
            logger.trace('fileTileAttachedController');

            var that = this;

            this.taskReply = $scope.ctrl.taskReply;
            this.viewModel = $scope.ctrl.viewModel;

            this.getFileDownloadUrl = function (fileCollection, version) {
                var file = version != null ? fileCollection.versions[version - 1] : that.getLastVersion(fileCollection);
                return FilesRepositoryService.getFileUrl(file.id);
            };

        });
})();
