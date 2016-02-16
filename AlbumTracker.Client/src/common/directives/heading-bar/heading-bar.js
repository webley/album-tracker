(function () {
    'use strict';
    angular.module('psteam.common.heading-bar.directive', ['ngMaterial'])

        .directive('pstHeadingBar', function (logger, toastService) {
            logger.trace("directive('pstHeadingBar')");
            return {
                restrict: 'E',
                templateUrl: 'common/directives/heading-bar/heading-bar.tpl.html',
                transclude: true
            };
        }
    );
})();
