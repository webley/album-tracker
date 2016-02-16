(function () {
    'use strict';

    angular.module('psteam.common.directives.taskGrid', [
            'ui.router',
            'psteam.common.filters.startDue',
            'psteam.common.filters.assignees',
            'psteam.common.filters.taskStatus',
            'psteam.common.filters.taskPriority',
            'psteam.common.tasks.taskCode',
            'psteam.common.services.user'
        ])
        .directive('pstTaskGrid', function () {
                return {
                    restrict: 'E',
                    templateUrl: 'common/directives/task-grid/task-grid.tpl.html',
                    scope: {
                        data: '=pstData',
                        sorting: '=pstSorting',
                        onSort: '=?pstOnSort',
                        columns: '=pstColumns',
                        useTab: '=pstUseTab'
                    },
                    controller: function (logger, $scope, $state, $filter, UserService, toastService, gettextCatalog) {
                        var that = this;

                        this.target = this.useTab ? '_blank' : '';

                        var dataWatch = $scope.$watch(function () {
                            return that.data;
                        }, function () {
                            that.filteredData = that.data.map(function (item) {
                                return that.columns.reduce(function (acc, column) {
                                    acc[column.name] = column.filters.reduce(function (filteredItem, filterName) {
                                        if (angular.isArray(filterName)) {
                                            var filterParams = [filteredItem].concat(filterName.slice(1));
                                            return $filter(filterName[0]).apply(this, filterParams);
                                        } else {
                                            return $filter(filterName)(filteredItem);
                                        }
                                    }, item.task[column.name]);

                                    return acc;
                                }, {
                                    topicCode: item.task.topicCode,
                                    id: item.task.id,
                                    taskType: item.task.taskType
                                });
                            });
                        });

                        var media = ['sm', 'gt-sm', 'md', 'gt-md', 'lg', 'gt-lg'];

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

                        this.columnClasses = this.columns.map(function (column) {
                            var classes = {};
                            if (angular.isNumber(column.width)) {
                                classes['flex-' + column.width] = true;
                                return classes;
                            }

                            if (column.width.default === 0) {
                                classes['hide'] = true;
                            } else if (angular.isNumber(column.width.default)) {
                                classes['flex-' + column.width.default] = true;
                            }

                            return media.reduce(function (acc, val) {
                                if (column.width[val] === 0) {
                                    acc['hide-' + val] = true;
                                } else if (angular.isNumber(column.width[val])) {
                                    acc['flex-' + val + '-' + column.width[val]] = true;
                                }
                                return acc;
                            }, classes);
                        });

                        this.sort = function (columnName) {
                            if (angular.isFunction(that.onSort)) {
                                that.onSort.call(this, columnName);
                            } else {

                                if (that.sorting.field === columnName) {
                                    that.sorting.order = that.sorting.order === 'desc' ? 'asc' : 'desc';
                                    rememberUserSortingPreferences(function () {
                                        $state.go('.', {
                                            order: that.sorting.order
                                        });
                                    });
                                } else {
                                    that.sorting.field = columnName;
                                    rememberUserSortingPreferences(function () {
                                        $state.go('.', {
                                            sortField: that.sorting.field
                                        });
                                    });
                                }
                            }
                        };

                        $scope.$on('$destroy', function () {
                            dataWatch();
                        });

                    },
                    bindToController: true,
                    controllerAs: 'ctrl'
                };
            }
        );

})();
