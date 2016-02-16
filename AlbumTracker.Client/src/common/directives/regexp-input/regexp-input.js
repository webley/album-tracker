(function () {
    'use strict';
    angular.module('psteam.common.regexp-input.directive', [])
        .directive('regexpInput', function (logger, $parse, $locale) {
            logger.trace("directive('regexpInput')");
            return {
                require: 'ngModel',
                restrict: 'A',
                link: function (scope, element, attrs, ngModel) {
                    logger.trace("directive('regexpInput'):link");

                    var modelSetter = $parse(attrs['ngModel']).assign;
                    var separator = '';

                    scope.$watch(
                        function() {
                             return ngModel.$modelValue;
                        },
                        function (newValue, oldValue) {

                        if (!newValue) {
                            //do nothing cause it's just probably user entering digits separator
                        }
                        else if (!(new RegExp(attrs.regexp).test(String(newValue)))) {
                            modelSetter(scope, oldValue);
                        }

                    });
                }
            };
        });

})();
