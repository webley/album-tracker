(function () {
    'use strict';
    angular.module('psteam.common.fileList.controller', [
        'psteam.common.repositories.files'
    ])

        .controller('FileListController', function (FilesRepositoryService, logger) {
            logger.trace('FileListController');
            var that = this;

            this.shownVersions = {};

            this.toggleVersions = function (file) {
                logger.trace('FileListController.toggleVersions.success', file);
                var versionShown = this.shownVersions[file.fileName];

                if (versionShown === undefined) {
                    this.shownVersions[file.fileName] = true;
                } else {
                    this.shownVersions[file.fileName] = !versionShown;
                }
            };

            this.getLastVersion = function (file) {
                logger.trace('FileListController.getLastVersion', file);
                return file.versions[file.versions.length - 1];
            };

            this.getUrl = function (file) {
                logger.trace('FileListController.getUrl', file);
                if (file.hasOwnProperty(that.fileIdField) &&
                    file[that.fileIdField]) {

                    return FilesRepositoryService.getFileUrl(
                        file[that.fileIdField]);
                }
                return '#';
            };

            this.download = function () {
                logger.trace('FileListController.download');
                FilesRepositoryService.downloadFile();
                return true;
            };

        });
})();
