(function () {
    'use strict';
    angular.module('psteam.common.initialise-from.directive', [])

        .directive('pstInitialiseFrom', function ($timeout, logger, $parse) {
            logger.trace("directive('pstInitialiseFrom')");
            return {
                require: 'ngModel',
                restrict: 'A',
                link: function ($scope, $element, $attrs, $ngModel) {
                  logger.trace("directive('pstInitialiseFrom'):link");
                  var inProgress = false;
                  $scope.$watch(function () {
                    var model = $scope.$eval($attrs.pstInitialiseFrom);
                    if(model == undefined) {
                      return undefined;
                    } else {
                      return model;
                    }
                  }, function(newValue) {
                    if(newValue == undefined || newValue == null || newValue == NaN) {
                      return;
                    }
                    var model = $parse($attrs.ngModel);
                    var modelAssign = model.assign;
                    var initialiseDelta = $scope.$eval($attrs.initialiseDelta);
                    if($ngModel.$modelValue == undefined) {
                      var newDate = new Date(newValue);
                      if(newDate != 'Invalid Date') {
                        var millisDate = newDate.getTime();
                        var finalDate = new Date(millisDate+initialiseDelta);
                        modelAssign($scope.$parent, finalDate);
                      }
                    }
                  });
                }
            };
        });
})();
