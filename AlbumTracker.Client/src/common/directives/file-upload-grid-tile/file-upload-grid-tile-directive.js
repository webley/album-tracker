(function () {
    'use strict';
    angular.module('psteam.common.file-upload-grid-tile.directive', [])
        .directive('pstFileUploadGridTile',
        function (logger) {
            logger.log(".directive('pstFileUploadGridTile')");
            return {
                restrict: 'E',

                scope: {
                    session: '='
                },

                transclude: false,
                templateUrl: 'common/directives/file-upload-grid-tile/file-upload-grid-tile.tpl.html',
                controller: function () {
                },

                controllerAs: 'ctrl',
                bindToController: true,

                link: function (scope, element, attrs, ctrl, transcludeFn) {
                    logger.log(".directive('pstFileUploadGridTile').link");
                    transcludeFn(scope, function (clone) {
                    });
                }
            };
        }
    );
})();
