(function () {
    'use strict';
    angular.module('psteam-file-download-url-filter', ['psteam.common.repositories.files'])
        .filter('fileDownloadUrl', function (FilesRepositoryService) {
            return function (fileId) {
                if (!fileId) {
                    return null;
                }

                return FilesRepositoryService.getFileUrl(fileId);
            };
        });
})();
