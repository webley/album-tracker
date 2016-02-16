(function () {
    'use strict';
    var link = function (scope, element, attrs, ngModel, transcludeFn) {
        logger.trace(".directive('pstDuration'):link");
        ngModel.$formatters.push(function (val) {
            if (angular.isUndefined(val)) {
                return undefined;
            }
            var days = val / (3600 * 24);
            if (days <= 0) {
                return undefined;
            }

            return days + 'd';
        });
    };

    var Duration = [
        function (logger) {
            logger.trace(".directive('pstDuration')");
            return {
                require: 'ngModel',
                restrict: 'A',
                link: link
            };
        }
    ];

    angular.module('psteam.common.duration.directive', [])

        .directive('pstDuration', Duration);
})();
