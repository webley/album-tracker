(function () {
    'use strict';
    angular.module('psteam.common.validated-tabs.directive', [])
        .directive('pstValidatedTabs', function (logger, $compile) {
            logger.trace(".directive('pstValidatedTabs')");
            return {
                require: ['mdTabs', '^form'],
                restrict: 'A',
                link: function (scope, element, attrs, controllersArr) {

                    scope.mdTabs = controllersArr[0];
                    scope.ngForm = controllersArr[1];

                    //Flag to indicate we don't want to disable tabs, but mark invalid one instead
                    //This is done for the cases when the validation of the whole object (task) is
                    //done not via forma validation, but via object model validation, which allows
                    //us to have tabs navigation as we will not allow to submit task unless all
                    //properties are valid no matter on which form their values are updated
                    var disableInvalidTab = scope.$eval(attrs.disableInvalidTab);
                    var warningIcon = $compile(angular.element('<md-icon md-svg-icon="content:report"></md-icon>'))(scope);

                    scope.$watch(attrs.pstValidatedTabs, function (newValue, oldValue) {
                        if (newValue === oldValue) {
                            return;
                        }

                        if (disableInvalidTab) {
                            //Disable invalid tab to deny navigation from it
                            var selindex = scope.mdTabs.selectedIndex;
                            for (var i = 0; i < scope.mdTabs.tabs.length; i++) {
                                if (i === selindex) {

                                } else {
                                    var element = scope.mdTabs.tabs[i].scope;
                                    element.disabled = newValue;
                                }
                            }
                        } else {
                            //Mark invalid tab but not disable it
                            var currentTabData = scope.mdTabs.tabs[scope.mdTabs.selectedIndex].element;
                            var tabs = $(currentTabData).parentsUntil($('md-tabs')).find($('md-tab-item'));

                            if (!newValue) {
                                $(tabs[scope.mdTabs.selectedIndex]).prepend(warningIcon);
                            } else {
                                $(tabs[scope.mdTabs.selectedIndex]).find('md-icon').remove();
                            }
                        }
                    });
                }
            };
        });
})();
