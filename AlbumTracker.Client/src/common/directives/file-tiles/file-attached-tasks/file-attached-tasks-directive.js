(function () {
    'use strict';
    angular.module('psteam.common.filetiles.fileAttachedTasks.directive', ['psteam.common.filetiles.fileAttachedTasks.controller'])
        .directive('fileTileAttachedTasks', function (logger) {
            logger.trace("directive('fileTileAttachedTasks')");
            return {
                restrict: 'E',
                controller: 'fileTileAttachedTasksController',
                controllerAs: 'fileAttachedTasks',
                replace: true,
                templateUrl: 'common/directives/file-tiles/file-attached-tasks/file-attached-tasks.tpl.html',
                link: function (scope) {
                    logger.trace("directive('fileTileAttachedTasks'):link");

                }
            };
        });
})();
