(function () {
    'use strict';

    angular.module('psteam.common.directives.usersMeetingsExpand', [
        'psteam.common.directives.taskGrid',
        'gettext'
    ])

        .directive('pstUsersMeetingsExpand', function () {
            return {
                restrict: 'E',
                templateUrl: 'common/directives/users-meetings-expand/users-meetings-expand.tpl.html',
                scope: {
                    data: '=pstData'
                },
                controller: function (gettextCatalog) {
                    var that = this;
                    that.users = Object.keys(that.data);
                    that.sortField = 'dueDate';
                    that.order = 'desc';
                    that.showGrid = true;
                    that.onSort = function (sortField) {
                        if (that.sortField === sortField) {
                            that.order = (that.order === 'desc' ? 'asc' : 'desc');
                        } else {
                            that.sortField = sortField;
                            that.order = 'desc';
                        }
                        var isDate = false;
                        if (sortField === 'startDate' || sortField === 'dueDate') {
                            isDate = true;
                        }
                        for (var k in that.data) {
                            var temp = that.data[k].slice(0);
                            temp.sort(function(a, b) {
                                var comparison;
                                if (isDate) {
                                    var fDate = new Date(a.task[sortField]);
                                    var sDate = new Date(b.task[sortField]);
                                    comparison = fDate > sDate ? 1 : -1;
                                } else {
                                    comparison = a.task[sortField] > b.task[sortField] ? 1 : -1;
                                }
                                if (that.order === 'asc') {
                                    return comparison;
                                } else {
                                    return comparison * -1;
                                }
                            });
                            that.data[k] = temp;
                        }
                    };
                    that.columns = [
                        {
                            width: {
                                sm: 0,
                                md: 20,
                                'gt-md': 20
                            },
                            isSortable: true,
                            name: 'taskCode',
                            label: gettextCatalog.getString('Task'),
                            isNumerical: false,
                            filters: []
                        },
                        {
                            width: {
                                sm: 50,
                                md: 20,
                                'gt-md': 20
                            },
                            isSortable: true,
                            name: 'title',
                            label: gettextCatalog.getString('Title'),
                            isNumerical: false,
                            filters: []
                        },
                        {
                            width: {
                                sm: 50,
                                md: 20,
                                'gt-md': 20
                            },
                            isSortable: true,
                            name: 'startDate',
                            label: gettextCatalog.getString('Start Date'),
                            isNumerical: false,
                            filters: [['startDue', 'short']]
                        },
                        {
                            width: {
                                sm: 0,
                                md: 20,
                                'gt-md': 20
                            },
                            isSortable: true,
                            name: 'dueDate',
                            label: gettextCatalog.getString('Due Date'),
                            isNumerical: false,
                            filters: [['startDue', 'short']]
                        }
                    ];
                    that.showOverlaps = [];
                    that.showOverlap = function (user) {
                        that.showOverlaps[user] = !that.showOverlaps[user];
                    };
                },
                controllerAs: 'ctrl',
                bindToController: true
            };
        }
      );

})();
