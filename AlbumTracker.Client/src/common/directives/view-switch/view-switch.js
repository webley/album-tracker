(function () {
    'use strict';
    angular.module('psteam.common.directives.viewSwitch', [])
        .directive('pstViewSwitchButton', function () {
            return {
                restrict: 'E',
                scope: {
                    icon: '@pstViewIcon',
                    label: '@pstViewLabel',
                    state: '@pstViewState',
                    tooltip: '@pstViewTooltip'
                },
                transclude: 'element',
                require: '^pstViewSwitch',
                link: function (scope, element, attrs, pstViewSwitchController) {
                    pstViewSwitchController.addView({
                        icon: scope.icon,
                        label: scope.label,
                        state: scope.state,
                        tooltip: scope.tooltip
                    });
                }
            };
        })
        .directive('pstViewSwitch', function () {
            return {
                restrict: 'E',
                templateUrl: 'common/directives/view-switch/view-switch.tpl.html',
                transclude: true,
                scope: {},
                require: ['pstViewSwitch'],
                link: function (scope, element, attrs, ctrl, transcludeFn) {
                    transcludeFn(scope, function (clone) {
                        element.append(clone);
                    });
                },
                controller: function ($state, $scope) {
                    var that = this;
                    that.views = [];

                    this.addView = function (view) {
                        that.views.push(view);
                    };

                    var unWatch = $scope.$watch(function () {
                        return $state.current.name;
                    }, function () {
                        if ($state.is($state.current.data.mainStateName)) {
                            $state.go($state.current.data.defaultView, {}, {
                                location: 'replace'
                            });
                        }
                    });

                    $scope.$on('$destroy', function () {
                        unWatch();
                    });
                },
                controllerAs: 'ctrl',
                bindToController: true
            };
        });
})();
