(function () {
    'use strict';
    angular.module('psteam.common.filetiles.fileAddedFolders.directive', ['psteam.common.filetiles.fileAddedFolders.controller'])
        .directive('fileTileAddedFolders', function (logger) {
            logger.trace("directive('fileTileAddedFolders')");
            return {
                restrict: 'E',
                controller: 'fileAddedFoldersController',
                controllerAs: 'fileAddedFolders',
                replace: true,
                templateUrl: 'common/directives/file-tiles/file-added-folders/file-added-folders.tpl.html',
                link: function (scope) {
                    logger.trace("directive('fileTileAddedFolders'):link");

                }
            };
        });
})();
