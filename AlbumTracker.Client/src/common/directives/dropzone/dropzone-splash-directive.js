(function () {
    'use strict';

    function getLink($window, $timeout, logger) {
        logger.log(".directive('pstDropzoneSplash').getLink");
        return function (scope, element) {
            logger.log(".directive('pstDropzoneSplash').link");

            var leave = scope.onLeave();
            var drop = scope.onDrop();
            element
                .on('dragover', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    event.originalEvent.dataTransfer.dropEffect = 'copy';
                })
                .on('dragleave', function (e) {
                    logger.log(".directive('pstDropzoneSplash'):element.$on('leave')");
                    leave(e);
                })
                .on('drop', function (e) {
                    logger.log(".directive('pstDropzoneSplash'):element.$on('drop')");
                    e.preventDefault();
                    e.stopPropagation();
                    drop(e);
                });
        };
    }

    angular.module('psteam.common.dropzone-splash.directive', ['psteam.logger'])
        .directive('pstDropzoneSplash', function ($window, $timeout, logger) {
            return {
                restrict: 'E',
                scope: {
                    onDrop: '&pstOnDrop',
                    onLeave: '&pstOnLeave'
                },
                templateUrl: 'common/directives/dropzone/dropzone-splash.tpl.html',
                link: getLink($window, $timeout, logger)
            };
        });
})();
