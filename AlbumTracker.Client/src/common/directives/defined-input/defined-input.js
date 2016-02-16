(function () {
    'use strict';

    angular.module('psteam.common.defined-input.directive', [])

        .directive('pstDefinedInput', function (logger, $parse) {
            return {
                require: 'ngModel',
                restrict: 'A',
                link: function ($scope, $element, $attrs, $ngModel) {
                    var def = $scope.$eval($attrs.pstDefault) || 0;
                    var parsedNgModel = $parse($attrs.ngModel);
                    var parsedNgModelAssign = parsedNgModel.assign;

                    $element.focusout(function() {
                      if($ngModel.$viewValue == "") {
                        $ngModel.$viewValue = def.toString();
                        parsedNgModelAssign($scope, def);
                        $ngModel.$render();
                      }
                    });
                }
            };
        });
})();
