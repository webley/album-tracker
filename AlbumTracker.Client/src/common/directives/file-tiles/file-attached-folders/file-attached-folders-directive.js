(function () {
    'use strict';
    angular.module('psteam.common.filetiles.fileAttachedFolders.directive', ['psteam.common.filetiles.fileAttachedFolders.controller'])
        .directive('fileTileAttachedFolders', function (logger) {
            logger.trace("directive('fileTileAttachedFolders')");
            return {
                restrict: 'E',
                controller: 'fileTileAttachedFoldersController',
                controllerAs: 'fileAttachedFolders',
                replace: true,
                templateUrl: 'common/directives/file-tiles/file-attached-folders/file-attached-folders.tpl.html',
                link: function (scope) {
                    logger.trace("directive('fileTileAttachedFolders'):link");

                }
            };
        });
})();
