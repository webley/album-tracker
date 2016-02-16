(function () {
    'use strict';
    angular.module('psteam.common.fileList.directive', [
        'psteam.common.fileList.controller',
        'psteam.common.togglableGroup.directive',
        'psteam.common.filters.string-length'
    ])

        .directive('pstFileList', function (logger) {
            logger.trace("directive('pstFileList')");
            return {
                restrict: 'E',
                controller: 'FileListController',
                controllerAs: 'ctrl',
                transclude: true,
                bindToController: true,
                link: function (scope, element, attrs, ctrl, transcludeFn) {
                    logger.trace("directive('pstFileList'):link");
                    ctrl.fileIdField = ctrl.fileIdField || 'id';
                },
                templateUrl: 'common/directives/file-list/file-list.tpl.html',
                scope: {
                    files: '=pstFiles',
                    fileIdField: '=pstFileId'
                }
            };
        });
})();
