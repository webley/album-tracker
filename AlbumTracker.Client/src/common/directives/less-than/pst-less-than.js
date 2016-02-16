(function () {
    'use strict';
    angular.module('psteam.common.less-than.directive', [])

        .directive('pstLessThan', function ($timeout, logger) {
            logger.trace("directive('pstLessThan')");
            return {
                require: 'ngModel',
                restrict: 'A',
                scope: {
                    otherInput: '=pstLessThan'
                },
                link: function (scope, element, attrs, ngModel, transcludeFn) {
                    logger.trace("directive('pstLessThan'):link");
                    var inProgress = false;
                    ngModel.$validators.pstLessThan = function (val) {
                        logger.trace("directive('pstLessThan'):link:ngModel.$validators.pstLessThan", {
                            'val': val
                        });
                        var otherInput = scope.otherInput;
                        if (!otherInput.$valid) {
                            if (!inProgress) {
                                inProgress = true;
                                $timeout(function () {
                                    otherInput.$validate();
                                }).then(function () {
                                    logger.trace("directive('pstLessThan'):link:$timeout.success");
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

                        return val <= otherInput.$modelValue;
                    }
                }
            };
        });
})();
