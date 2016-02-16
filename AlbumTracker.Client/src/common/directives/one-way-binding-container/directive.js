(function () {
    'use strict';
    angular.module('psteam.common.oneWayBindingContainer.directive', [])

        .directive('pstOneWayBindingContainer', function ($compile, logger) {
            logger.trace("directive('pstOneWayBindingContainer')");
            return {
                //restrict: 'E',
                terminal: true,
                scope: {
                    model: '='
                },
                compile: function (element) {
                    logger.trace("directive('pstOneWayBindingContainer'):compile");
                    var compileFn =
                        $compile(angular.element(element.html()));

                    return function (scope, elmnt, attrs, ngModel) {
                        logger.trace("directive('pstOneWayBindingContainer'):compile:return");
                        function domInsert(cloned) {
                            logger.trace("directive('pstOneWayBindingContainer'):compile:return:domInsert", cloned);
                            element.empty().append(cloned);
                        }

                        scope.$watch(function () {
                            logger.trace("directive('pstOneWayBindingContainer'):compile:return:scope.$watch:watchExpression");
                            return scope.model;
                        }, function () {
                            logger.trace("directive('pstOneWayBindingContainer'):compile:return:scope.$watch:listener");
                            compileFn(scope, domInsert);
                        });

                    };
                }
            };
        });
})();
