(function () {
    'use strict';
    angular.module('psteam.common.scheduler.directive', [
        'psteam.common.filters.escape',
        'psteam.common.scheduler.controller',
        'psteam.common.agenda.directive'
    ]).directive('pstScheduler', function ($window, $mdMedia, logger) {
        logger.trace("directive('pstScheduler')");
        return {
            restrict: 'E',
            templateUrl: 'common/directives/scheduler/scheduler.tpl.html',
            scope: {
                schedulerOptions: '='
            },
            link: function (scope, element, attrs, ctrl) {
                var w = angular.element($window);
                var calendarContainer = element.find('.pst-calendar-container');
                var calendar = calendarContainer.find('.pst-calendar');

               
                function calcHeightAndRatio() {
                    var fontSize = parseInt(calendar.find('.ui-widget-content').css('font-size'));
                    var minSize = fontSize * 6 * 4 + 14;
                    var height = (w.height() - calendarContainer.offset().top - (calendarContainer.outerHeight(true) - calendarContainer.height()));

                    if (height <= minSize) {
                        return {
                            height: 'auto'
                        };
                    } else {
                        return {
                            height: null,
                            aspectRatio: calendarContainer.width() / height
                        };
                    }
                }

                ctrl.resize = function () {
                    
                    if (calendar.fullCalendar('getView').name === 'month') {
                        var heightAndRatio = calcHeightAndRatio();

                        calendar
                            .fullCalendar('option', 'height', heightAndRatio.height);
                        calendar
                            .fullCalendar('option', 'aspectRatio', heightAndRatio.aspectRatio);
                    } else {
                        calendar
                            .fullCalendar('option', 'height', 'auto');
                    }
                };

                ctrl.calendar = calendar;
                var sview = 'month';
                if ('views' in ctrl.schedulerOptions) {
                    for (var key in ctrl.schedulerOptions.views) {
                        var view = ctrl.schedulerOptions.views[key];
                        if (angular.isObject(view) && view.selected) {
                            sview = view.type;
                        }
                    }
                };
                ctrl.setView(sview);

                var heightAndRatio = calcHeightAndRatio();
                ctrl.calendarConfig = {
                    theme: true,
                    editable: false,
                    header: false,
                    firstDay: 1,
                    height: heightAndRatio.height,
                    aspectRatio: heightAndRatio.aspectRatio,
                    windowResize: ctrl.resize
                };

                var screenWatch = scope.$watch(function () {
                    return !$mdMedia('gt-md');
                }, function (small) {
                    ctrl.smallScreen = small;
                });

                scope.$on('$destroy', function () {
                    logger.trace("directive('pstScheduler'):controller:$scope.$on('$destroy')");
                    calendar.fullCalendar('destroy');
                    screenWatch();
                });

            },
            controller: 'SchedulerController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    });
})();
