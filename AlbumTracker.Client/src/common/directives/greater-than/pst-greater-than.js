(function () {
    'use strict';
    angular.module('psteam.common.greater-than.directive', [])

        .directive('pstGreaterThan', function ($timeout, logger) {
            logger.trace(".directive('pstGreaterThan')");
            return {
                require: 'ngModel',
                restrict: 'A',
                scope: {
                    otherInput: '=pstGreaterThan'
                },
                link: function (scope, element, attrs, ngModel, transcludeFn) {
                    logger.trace(".directive('pstGreaterThan'):link");
                    var inProgress = false;
                    ngModel.$validators.pstGreaterThan = function (val) {
                        logger.trace(".directive('pstGreaterThan'):link:ngModel.$validators.pstGreaterThan", {
                            'val': val
                        });
                        var otherInput = scope.otherInput;
                        if (!otherInput.$valid) {
                            if (!inProgress) {
                                inProgress = true;
                                $timeout(function () {
                                    otherInput.$validate();
                                }).then(function () {
                                    logger.trace(".directive('pstGreaterThan'):link:$timeout.success");
                                    inProgress = false;
                                });
                            }
                        }

                        if (angular.isUndefined(val) ||
                            val === null ||
                            (typeof (val) === 'number' && isNaN(val))) {
                            return true;
                        }

                        var otherInputModelValue = otherInput.$modelValue;

                        if (!otherInput.$valid ||
                            otherInputModelValue === null ||
                            angular.isUndefined(otherInputModelValue) ||
                            (typeof (otherInputModelValue) === 'number' && isNaN(otherInputModelValue))) {
                            return true;
                        }

                        return val >= otherInputModelValue;
                    }
                }
            };
        });
})();
