(function () {
    'use strict';
    angular.module('psteam.common.filetiles.fileAddedTasks.directive', ['psteam.common.filetiles.fileAddedTasks.controller'])
        .directive('fileTileAddedTasks', function (logger) {
            logger.trace("directive('fileTileAddedTasks')");
            return {
                restrict: 'E',
                controller: 'fileAddedTasksController',
                controllerAs: 'fileAddedTasks',
                replace: true,
                templateUrl: 'common/directives/file-tiles/file-added-tasks/file-added-tasks.tpl.html',
                link: function (scope) {
                    logger.trace("directive('fileTileAddedTasks'):link");

                }
            };
        });
})();
