(function () {
    'use strict';

    angular.module('psteam.common.pst-autofocus.directive', [])

        .directive('pstAutofocus', function ($timeout, $parse, logger) {
            logger.trace("directive('pstAutofocus')");
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    logger.trace("directive('pstAutofocus'):link");
                    if (!attrs.pstAutofocus || $parse(attrs.pstAutofocus)(scope)) { // If not defined or expression evaluates to true.
                        $timeout(function () {
                            element[0].focus();
                        }, 50);
                    }
                }
            };
        });
})();
