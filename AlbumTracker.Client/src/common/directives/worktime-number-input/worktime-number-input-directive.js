(function () {
    'use strict';

    angular.module('psteam.common.worktime-number-input.directive', [])
        .directive('pstWorktimeNumberInput', function (logger) {
            logger.trace(".directive('pstWorktimeNumberInput')");

            return {
                require: '?ngModel',
                restrict: 'E',
                transclude: true,
                templateUrl: 'common/directives/worktime-number-input/worktime-number-input.tpl.html',
                scope: {
                    workTime: '=ngModel'
                },
                bindToController: true,
                controllerAs: 'ctrl',
                controller: function () {
                    var that = this;

                    that.focus = false;

                    that.onTimeChange = function () {

                        // To allow for rolling round of values if the spinner arrows or mouse wheel were used.
                        if (that.days < 0) {
                            that.days = 0;
                        }
                        if (that.hours === -1 && that.previous.hours === 0) {
                            that.hours = 7;
                        } else if (that.hours === 8 && that.previous.hours === 7) {
                            that.hours = 0;
                        }
                        if (that.minutes === -1 && that.previous.minutes === 0) {
                            that.minutes = 59;
                        } else if (that.minutes === 60 && that.previous.minutes === 59) {
                            that.minutes = 0;
                        }

                        that.workTime = that.minutes * 60 + that.hours * 3600 + that.days * 28800; //28800 because we use 8hrs as 1 working day
                    };

                    that.onFocus = function () {
                        that.focus = true;
                    };

                    that.onBlur = function () {
                        that.focus = false;

                        //On leaving an input with no value, set it to zero.
                        if (!parseInt(that.days, 10) || that.days < 0) {
                            that.days = 0;
                        }
                        if (!parseInt(that.hours, 10) || that.hours < 0) {
                            that.hours = 0;
                        } else if (that.hours > 7) {
                            that.hours = 7;
                        }
                        if (!parseInt(that.minutes, 10) || that.minutes < 0) {
                            that.minutes = 0;
                        } else if (that.minutes > 59) {
                            that.minutes = 59;
                        }
                    };
                },
                link: function (scope, element, attrs, ngModel, transcludeFn) {
                    logger.trace(".directive('pstWorktimeNumberInput'):link");

                    scope.ctrl.disabled = attrs.ngdisabled === 'true';
                    scope.ctrl.label = attrs.label;

                    if (!ngModel) return; // do nothing if no ng-model

                    var secondsToTime = function(modelValue) {
                        modelValue = parseInt(modelValue || 0);

                        var days = 0;
                        var hours = 0;
                        var mins = 0;
                        //28800 to reflect 8hrs working day
                        while (modelValue >= 28800) {
                            days++;
                            modelValue -= 28800;
                        }
                        while (modelValue >= 3600) {
                            hours++;
                            modelValue -= 3600;
                        }
                        while (modelValue >= 60) {
                            mins++;
                            modelValue -= 60;
                        }

                        return { days: days, hours: hours, minutes: mins };
                    };

                    ngModel.$formatters.push(function (modelValue) {
                        //pre-process the model value to be displayed to user

                        var time = secondsToTime(modelValue);
                        scope.ctrl.days    = time.days;
                        scope.ctrl.hours   = time.hours;
                        scope.ctrl.minutes = time.minutes;

                        scope.ctrl.previous = time;
                        return time;
                    });
                }
            };
        });
})();
