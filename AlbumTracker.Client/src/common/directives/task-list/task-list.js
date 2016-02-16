(function () {
    'use strict';

    angular.module('psteam.common.directives.taskList', [
        'psteam.common.filters.startDue',
        'psteam.common.filters.taskStatus',
        'psteam.common.taskTypeIcon.filter',
        'psteam.common.filters.taskPriority',
        'psteam.common.topic-sref.directive'
    ])

        .directive('pstTaskList', function () {
            return {
                restrict: 'E',
                templateUrl: 'common/directives/task-list/task-list.tpl.html',
                scope: {
                    data: '=pstListData',
                    onSort: '=?pstOnSort',
                    sorting: '=pstSorting',
                    sortByItems: '=pstSortByItems'
                },
                controllerAs: 'ctrl',
                bindToController: true,
                controller: function ($state, UserService, toastService, gettextCatalog) {
                    var that = this;
                    this.showOptions = false;

                    var rememberUserSortingPreferences = function (doAfter) {
                        UserService.getSettings().then(
                            function success (userSettings) {

                                if (userSettings.settings.sortingPreferences !== undefined &&
                                    userSettings.settings.sortingPreferences.rememberSortingEnabled) {

                                    // field
                                    userSettings.settings.sortingPreferences.settings[$state.current.name + '.field'] = that.sorting.field;
                                    // order
                                    userSettings.settings.sortingPreferences.settings[$state.current.name + '.order'] = that.sorting.order;

                                    UserService.saveUserSettings(userSettings.settings).then(
                                        function success () {
                                            doAfter();
                                        },
                                        function failure () {
                                            logger.error('pstTaskGrid.sort ' + err);
                                            toastService.error(gettextCatalog.getString('Your sorting preference could not be updated'));
                                        });

                                } else {
                                    doAfter();
                                }

                            },
                            function failure (err) {
                                logger.error('pstTaskGrid.sort ' + err);
                                toastService.error(gettextCatalog.getString('Your sorting preference could not be get from profile'));
                            }
                        );
                    };

                    if(angular.isUndefined(this.onSort)){
                        this.onSort = function () {
                            rememberUserSortingPreferences(function () {
                                $state.go('.', {
                                    sortField: that.sorting.field,
                                    order: that.sorting.order
                                });
                            });
                        };
                    }
                }

            };
        });
})();
