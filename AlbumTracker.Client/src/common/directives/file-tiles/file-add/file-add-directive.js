(function () {
    'use strict';
    angular.module('psteam.common.filetiles.fileAdd.directive', ['psteam.common.filetiles.fileAdd.controller'])
        .directive('fileTileAdd', function (logger) {
            logger.trace("directive('fileTileAdd')");
            return {
                restrict: 'E',
                controller: 'fileTileAddController',
                controllerAs: 'fileAdd',
                replace: true,
                templateUrl: 'common/directives/file-tiles/file-add/file-add.tpl.html',
                link: function (scope) {
                    logger.trace("directive('fileTileAdd'):link");

                }
            };
        });
})();
