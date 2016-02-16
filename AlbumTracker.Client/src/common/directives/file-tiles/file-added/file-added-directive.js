(function () {
    'use strict';
    angular.module('psteam.common.filetiles.fileAdded.directive', ['psteam.common.filetiles.fileAdded.controller'])
        .directive('fileTileAdded', function (logger) {
            logger.trace("directive('fileTileAdded')");
            return {
                restrict: 'E',
                controller: 'fileTileAddedController',
                controllerAs: 'fileAdded',
                replace: true,
                templateUrl: 'common/directives/file-tiles/file-added/file-added.tpl.html',
                link: function (scope) {
                    logger.trace("directive('fileTileAdded'):link");

                }
            };
        });
})();
