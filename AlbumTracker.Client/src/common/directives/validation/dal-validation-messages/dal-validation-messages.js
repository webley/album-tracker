(function () {
    'use strict';
    angular.module('psteam.common.dalValidationMessages', [])
        .directive('dalValidationMessages', function () {
            return {
                restrict: 'E',
                scope: {
                    model: '=',
                    field: '@'
                },
                templateUrl: 'common/directives/validation/dal-validation-messages/dal-validation-messages.tpl.html',
                controller: function ($scope) {
                    var unwatchModel = $scope.$watch('model.$model',
                        function () {
                            if ($scope.model && $scope.model.validateField) {
                                $scope.messages = $scope.model.validateField($scope.field);
                            } else {
                                delete $scope.messages;
                            }
                        },
                        true);

                    $scope.$on('$destroy', function () {
                        unwatchModel();
                    });
                }
            };
        });
})();
