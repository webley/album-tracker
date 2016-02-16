(function () {
    'use strict';

    angular.module('psteam.common.worktime-input.directive', [])

        .directive('pstDurationInput', function (logger) {
            logger.trace(".directive('pstDurationInput')");
            var TIME_STRINGS = ['d', 'h', 'm'];
            var TIME = {
                1: 8 * 60 * 60,
                2: 60 * 60,
                3: 60
            };

            var REGEX = /^(?:(\d+)d)?\s*(?:(\d+)h)?\s*(?:(\d+)m)?\s*$/;

            function secondsToString(val) {
                logger.trace(".directive('pstDurationInput'):secondsToString(val = %d)", val);

                var isNegative = val < 0;
                val = Math.abs(val);
                var res = new Array(3);
                for (var i = 0; i < 3; i++) {
                    res[i * 2] = (isNegative && Math.floor(val / TIME[i + 1]) != 0 ? '-' : '') + Math.floor(val / TIME[i + 1]) + TIME_STRINGS[i];
                    val = val % TIME[i + 1];
                }
                return res.join(' ');
            }

            function stringToSeconds(val) {
                logger.trace(".directive('pstDurationInput'):stringToSeconds(val = '%s')", val);
                var matches = val.match(REGEX);

                if (matches === null) {
                    return undefined;
                }

                return matches.slice(1)
                    .reduce(function (seconds, val, index) {
                        if (angular.isUndefined(val)) {
                            return seconds;
                        }

                        return seconds +
                            parseInt(val) * TIME[index + 1];
                    }, 0);
            }

            return {
                require: 'ngModel',
                restrict: 'A',
                link: function (scope, element, attrs, ngModel, transcludeFn) {
                    logger.trace(".directive('pstDurationInput'):link");

                    ngModel.$parsers.push(function (val) {
                        logger.trace(".directive('pstDurationInput'):link:ngModel.$parsers.push(val = '%s')", val);
                        if (angular.isUndefined(val)) {
                            return val;
                        }
                        var res = stringToSeconds(val);
                        return res;
                    });

                    ngModel.$formatters.push(function (val) {
                        logger.trace(".directive('pstDurationInput'):link:ngModel.$formatters.push(val = %d)", val);
                        if (angular.isUndefined(val) || (typeof (val) === 'number' && isNaN(val))) {
                            return secondsToString(0);
                        }
                        return secondsToString(val);
                    });

                }
            };
        });
})();
