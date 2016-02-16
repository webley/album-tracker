(function () {
    'use strict';
    angular
        .module('psteam.common.scheduler.controller', [])
        .controller('SchedulerController', function ($scope, $state, $stateParams, logger, $rootScope) {
            logger.trace("directive('pstScheduler'):controller");
            var that = this;
         
            
            function hasTime(date) {
                var dateObj = new Date(date);

                return dateObj.getHours() || dateObj.getMinutes() && dateObj.getSeconds();
            }

            function isAllDay(start, end) {
                return !hasTime(start) || !hasTime(end);
            }

            function getEvents(startDate, endDate) {
                logger.trace("directive('pstScheduler'):controller:getEvents", startDate, endDate);
                
                
                
                endDate.setDate(endDate.getDate() + 1);
                return that.schedulerOptions.getTasks(startDate, endDate).then(function (data) {
                	data = data.meetings;
                    logger.trace("directive('pstScheduler'):controller:getEvents:schedulerOptions.getTasks.success", startDate, endDate);
                    var events = [];
                    for (var i = 0; i < data.length; i++) {
                        var task = data[i];

                        if (task.topicType !== 'meeting') {
                            var date = new Date(task.end);
                            date.setDate(date.getDate() + 1);
                            task.end = date.toJSON();
                        }

                        var event = {
                            id: task.taskCode,
                            title: task.title,
                            start: task.start.toString(),
                            end: task.end.toString(),
                            allDay: isAllDay(task.start, task.end)
                        };

                        events.push(event);
                    }
                    return events;
                });
            }

            that.eventSources = [
                function (start, end, timezone, callback) {
                    logger.trace("directive('pstScheduler'):controller.eventSources", {
                        'start': start,
                        'end': end,
                        'timezone': timezone,
                        'callback': callback
                    });
                    getEvents(start.toDate(), end.toDate()).then(function (events) {
                        logger.trace("directive('pstScheduler'):controller.eventSources:getEvents.success", events);
                        
                        
                        callback(events);
                    });
                }
            ];

            

            that.isActiveView = function (view) {
                return !that.isAgenda && that.calendar.fullCalendar('getView').name === view;
            };

            that.setView = function (view) {
                
                that.isAgenda = (view == 'agenda');
                
                $state.go('.', { 'sview': view }, { reload: false });
                if (that.calendar && !that.isAgenda) {
                    if (view == 'day' || view == 'week') view = 'agenda' + view.substr(0,1).toUpperCase() + view.substr(1);
                    that.calendar.fullCalendar('changeView', view);
                    that.resize();
                    
                }
                
            };

         
            that.prev = function () {
                that.calendar.fullCalendar('prev');
                var view = that.calendar.fullCalendar('getView');
                that.currentDate = new Date(view.intervalStart);
                
            };

            that.next = function () {
                that.calendar.fullCalendar('next');
                var view = that.calendar.fullCalendar('getView');
                that.currentDate = new Date(view.intervalStart);
            };

            that.today = function () {
                that.calendar.fullCalendar('today');
                var view = that.calendar.fullCalendar('getView');
                that.currentDate = new Date(view.intervalStart);
                
            };
            
            
            var now = new Date();
            var todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
            var page = ('page' in $stateParams ? parseInt($stateParams['page']) : 1);
            var pageSize = ('pageSize' in $stateParams ? parseInt($stateParams['pageSize']) : 10);
            var updateAgendaEvents = function () {
            that.todayDate = todayDate;
            that.currentDate = now;

            that.agendaEvents = that.schedulerOptions.getTasks(todayDate, new Date(4000, 0, 0, 0, 0, 0, 0), page - 1, pageSize)
                .then(function(data) {
                    var total = data.total;
                    data = data.meetings;
                    var events = [];
                    for (var i = 0; i < data.length; i++) {
                        var task = data[i];
                        var event = {
                            id: task.taskCode,
                            title: task.title,
                            start: new Date(task.start),
                            end: new Date(task.end),
                            allDay: isAllDay(task.start, task.end),
                            priority: task.priority
                        };

                        events.push(event);
                    }
                    return {
                        total: total,
                        events: events
                    };
                });
            };
            updateAgendaEvents();
            $scope.$on('$locationChangeSuccess', function() {
            page = ('page' in $stateParams ? parseInt($stateParams['page']) : 1);
            pageSize = ('pageSize' in $stateParams ? parseInt($stateParams['pageSize']) : 10);
            var view = ('sview' in $stateParams ? $stateParams['sview'] : 'month');
            updateAgendaEvents();
        });
    });

})();
