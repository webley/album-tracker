(function () {
    'use strict';
    angular
        .module('psteam.common.agenda.controller', [])
        .controller('AgendaController', function ($scope, $stateParams, logger, uiCalendarConfig, $filter, gettextCatalog, TaskCodeFactory) {
            logger.trace('psteam.common.agenda.controller:AgendaController');
            var that = this;
            that.columns = [
                {
                    width: {
                        xs: 15,
                        'gt-xs': 15
                    },
                    isSortable: false,
                    name: 'startDate',
                    label: gettextCatalog.getString('Date'),
                    isNumerical: false,
                    filters: ['startDue'],
                    mappings: [
                        {
                            name: 'day',
                            filters: [['startDue', 'dd']]
                        },
                        {
                            name: 'weekDay',
                            filters: [['startDue', 'EEEE']]
                        },
                        {
                            name: 'monthYear',
                            filters: [['startDue', 'MMMM, yyyy']]
                        },
                        {
                            name: 'startTime',
                            filters: [['startDue', 'shortTime']]
                        },
                        {
                            property: 'end',
                            name: 'endTime',
                            filters: [['startDue', 'shortTime']]
                        }
                        ,
                        {
                            property: 'end',
                            name: 'endDate',
                            filters: [['startDue', 'short']]
                        }
                        
                    ]
                },
                 {
                     width: {
                         xs: 15,
                         'gt-xs': 15
                     },
                     isSortable: false,
                     name: 'startTime',
                     label: gettextCatalog.getString('Time'),
                     isNumerical: false,
                     filters: [['startDue', 'shortTime']]
                 },
                  {
                      width: {
                          xs: 70,
                          'gt-xs': 70
                      },
                      isSortable: false,
                      name: 'event',
                      label: gettextCatalog.getString('Event'),
                      isNumerical: false,
                      filters: []
                  }
            ];


            var media = ['xs', 'gt-xs', 'sm', 'gt-sm', 'md', 'gt-md', 'lg', 'gt-lg'];

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
            var columnMap = {
                'startDate': 'start',
                'startTime': 'start',
                'endTime': 'end',
                'event': 'title'
            };
            var mapAgenda = function () {
                that.page = ('page' in $stateParams ? parseInt($stateParams['page']) : 1);
                that.pageSize = ('pageSize' in $stateParams ? parseInt($stateParams['pageSize']) : 10);
                
                that.agenda = that.agenda.map(function (item) {
                    var filtered = that.columns.reduce(function (prevColumn, column) {
                        prevColumn[column.name] = column.filters.reduce(function (filteredItem, filterName) {
                            
                            if (angular.isArray(filterName)) {
                                var filterParams = [filteredItem].concat(filterName.slice(1));
                                return $filter(filterName[0]).apply(this, filterParams);
                            }
                            else return $filter(filterName)(filteredItem);

                            }, item[columnMap[column.name]]);
                            if ('mappings' in column) {
                                for (var i in column.mappings) {
                                    
                                    var map = column.mappings[i];
                                    var property = columnMap[column.name];
                                    if ('property' in map) property = map.property;
                                        prevColumn[map.name] = map.filters.reduce(function (filteredItem, filterName) {
                                        if (angular.isArray(filterName)) {
                                            var filterParams = [filteredItem].concat(filterName.slice(1));
                                            return $filter(filterName[0]).apply(this, filterParams);
                                        }
                                        else return $filter(filterName)(filteredItem);

                                    }, item[property]);
                                    
                                }
                            }
                        prevColumn.priority = item.priority;
                            return prevColumn;
                    }, {});
                    filtered.allDay = item.allDay;
                    filtered.oneDay = (item.start.getDate() == item.end.getDate());
                    filtered.taskCode = TaskCodeFactory.fromString(item.id);
                    return filtered;
                });
                that.lastPage = Math.ceil(that.total / that.pageSize);
            }
         
            $scope.$watch('ctrl.data', function (newValue, oldValue) {
                
                if (typeof (newValue.then) == 'function') {
                    newValue.then(function (data) {
                        that.agenda = data.events;
                        that.total = data.total;
                        mapAgenda();
                        return data;
                    });
                } else {
                    that.agenda = newValue.events;
                    that.total = newValue.total;
                    mapAgenda();
                }
            });

    });

})();
