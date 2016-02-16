(function () {
    'use strict';
    angular.module('psteam.common.filetiles.fileAttached.directive', ['psteam.common.filetiles.fileAttached.controller'])
        .directive('fileTileAttached', function (logger) {
            logger.trace("directive('fileTileAttached')");
            return {
                restrict: 'E',
                controller: 'fileTileAttachedController',
                controllerAs: 'fileAttached',
                replace: true,
                templateUrl: 'common/directives/file-tiles/file-attached/file-attached.tpl.html',
                link: function (scope) {
                    logger.trace("directive('fileTileAttached'):link");

                }
            };
        });
})();
