(function () {
    'use strict';

    angular.module('psteam.common.date-picker.directive', ['ngLocale'])
        .factory('pickerSettings', function pickerSettingsFactory (gettextCatalog, $locale) {
            return {
                previousMonth: gettextCatalog.getString("Previous Month"),
                nextMonth: gettextCatalog.getString("Next Month"),
                incrementHours: gettextCatalog.getString("Increment Hours"),
                decrementHours: gettextCatalog.getString("Decrement Hours"),
                incrementMinutes: gettextCatalog.getString("Increment Minutes"),
                decrementMinutes: gettextCatalog.getString("Decrement Minutes"),
                switchAmPm: gettextCatalog.getString("Switch AM/PM"),
                now: gettextCatalog.getString("Now"),
                cancel: gettextCatalog.getString("Cancel"),
                save: gettextCatalog.getString("Save"),
                weekdays: [
                    $locale.DATETIME_FORMATS.DAY[0][0].toUpperCase(),
                    $locale.DATETIME_FORMATS.DAY[1][0].toUpperCase(),
                    $locale.DATETIME_FORMATS.DAY[2][0].toUpperCase(),
                    $locale.DATETIME_FORMATS.DAY[3][0].toUpperCase(),
                    $locale.DATETIME_FORMATS.DAY[4][0].toUpperCase(),
                    $locale.DATETIME_FORMATS.DAY[5][0].toUpperCase(),
                    $locale.DATETIME_FORMATS.DAY[6][0].toUpperCase()
                ],
                switchTo: gettextCatalog.getString('Switch to'),
                clock: gettextCatalog.getString('Clock'),
                calendar: gettextCatalog.getString('Calendar')
            };
        })
        .directive('pstDatePicker', function ($mdDialog, logger, $parse, $locale, $timeout, $compile, timezoneService, $filter) {

            function showPicker (model, time, display24, minDate, maxDate, callback) {
                logger.trace(".directive('pstDatePicker'):showPicker");
                $mdDialog.show({
                    template: '<md-dialog class="date-dlg">' +
                    '<md-content class="pst-content date-content">' +
                    '<time-date-picker orientation="true" config={{config}} display-twentyfour={{display24}} mindate={{minDate}} maxdate={{maxDate}} display-mode={{displayMode}} on-cancel="hidePicker();" on-save="saveDate($value, $event);" ng-model="amodel">' +
                    '</time-date-picker>' +
                    '</md-content>' +
                    '</md-dialog>',
                    controller: [
                        '$scope', 'pickerSettings', function (scope, pickerSettings) {
                            scope.display24 = display24;
                            scope.config = pickerSettings;
                            // *** IMPORTANT ***
                            // As long as we work with datetime values as if we're in the user's timezone
                            // specified in PS-Team user's settings, we have to 'workaround' the browser's
                            // behaviour when it automatically constructs the js date object as in the local
                            // timezone. To apply timezone of the user we use the 'timezoneService', so we will
                            // see date, hours and minutes according to user's timezone selected in psteam settings
                            scope.amodel = timezoneService.applyTimezone(model || new Date());
                            scope.minDate = minDate;
                            scope.maxDate = maxDate;
                            if (!time) {
                                scope.displayMode = "date";
                            }
                            scope.hidePicker = function () {
                                $mdDialog.hide();
                            };
                            scope.saveDate = function (value, evt) {
                                if(!time) {
                                  value.setHours(17,0,0,0);
                                }
                                // *** IMPORTANT ***
                                // To properly send to the server datetime value as UTC date, we have to convert
                                // the value back into user's timezone datetime from local js date so we will send
                                // a proper UTC date to the server
                                callback(convertToUserTimezoneDate(value));
                                $mdDialog.hide();
                            };
                        }
                    ]
                });
            }

            function convertLocaleToMomentTemplate (val) {
                if (angular.isString(val) && val.length > 0) {
                    val = val.replace(/([^y]|^)([y])([^y]|$)/i, '$1YYYY$3');//replace lonely 'y' by 'YYYY'
                    val = val.replace(/yyyy/, 'YYYY');                      //replace 'yyyy' by 'YYYY'
                    val = val.replace(/([^y]|^)(yy)([^y]|$)/i, '$1YY$3');   //replace lonely 'yy' by 'YY'

                    val = val.replace(/([^d]|^)(d)([^d]|$)/, '$1D$3');      //replace lonely 'd' by 'D'
                    val = val.replace(/([^d]|^)(dd)([^d]|$)/, '$1DD$3');    //replace lonely 'dd' by 'DD'
                }
                return val;
            }

            function convertToUserTimezoneDate(val) {
                return new timezoneJS.Date(
                    val.getFullYear(), val.getMonth(), val.getDate(), val.getHours(), val.getMinutes(), val.getSeconds(),
                    timezoneService.getCurrentTimezone());
            }

            return {
                require: 'ngModel',
                restrict: 'A',
                scope: true,
                link: function ($scope, $element, $attrs, $ngModel) {
                    logger.trace(".directive('pstDatePicker'):link");

                    //to activate time use  'time="true"' attribute
                    var isTime = !!$scope.$eval($attrs.time);

                    //specifying date format from locale
                    var tz = timezoneService;
                    var dateFilter = $filter('date');
                    var timezoneFilter = $filter('timezone');
                    var timeToStringFilter = function (date) { return dateFilter(timezoneFilter(date), 'short'); };
                    var dateToStringFilter = function (date) { return dateFilter(timezoneFilter(date), 'shortDate'); };

                    var dateFormat = isTime
                        ? convertLocaleToMomentTemplate($locale.DATETIME_FORMATS.short)
                        : convertLocaleToMomentTemplate($locale.DATETIME_FORMATS.shortDate);

                    //$element.attr('placeholder', dateFormat);
                    $scope.placeholder = dateFormat;

                    //if we have time specified then choose in which format
                    var display24 = !!dateFormat.match(/H/);

                    if(!$scope.$eval($attrs.ngDisabled)){
                        var icons = angular.element(
                            //clear icon
                            '<md-icon md-svg-icon="content:clear" ng-click="' + $attrs.ngModel + ' = null" ng-show="' +
                            $attrs.ngModel + '"></md-icon>' +
                            //date icon
                            '<md-icon md-svg-icon="action:today"></md-icon>');

                        //compiling icons
                        var cmpIcons = $compile(icons)($scope);
                        $element.after(cmpIcons);
                    }

                    //canceling a standard class that applies to md-input-container if it has md-icon inside
                    $element.parent('md-input-container').addClass('cancel-has-icon');

                    $element.blur(function (e) {
                        //We need to mess with model inside the onblur handler to force the formatter to
                        //handle the parsed by the parser string value after user manually enters it
                        //To be safe, we need to do that inside the timeout
                        $timeout(function() {
                            $ngModel.$modelValue = null;
                        });
                    });

                    $element.nextAll('md-icon[md-svg-icon="action:today"]').bind('click', function (evt) {
                        var model = $scope.$parent.$eval($attrs.ngModel);
                        var minDate = '';
                        var maxDate = '';
                        if ($attrs.greater) {
                            var modelValue = $scope.$eval($attrs.greater);
                            var date = new Date(modelValue);
                            minDate = date.toString();
                        }
                        if ($attrs.less) {
                            var modelValue = $scope.$eval($attrs.less);
                            var date = new Date(modelValue);
                            maxDate = date.toString();
                        }
                        var parsedNgModel = $parse($attrs.ngModel);
                        var parsedNgModelAssign = parsedNgModel.assign;
                        showPicker(model, $attrs.time, display24, minDate, maxDate, function (value) {
                            parsedNgModelAssign($scope, value);
                        });
                    });

                    $ngModel.$formatters.push(function (val) {

                        if (!angular.isDate(val) && !(val instanceof timezoneJS.Date)) {
                            return val;
                        }

                        if (!isTime) {
                            return dateToStringFilter(val);
                        } else {
                            return timeToStringFilter(val);
                        }

                    });

                    $ngModel.$parsers.push(function fromStringToDate (val) {
                        if (!val) {
                            return val;
                        }

                        // *** IMPORTANT ***
                        // In contrast to setting the datetime value from MaterialDesign datepicker, when
                        // user enters it manually, we have this parser to handle this.
                        // And to properly send to the server datetime value as UTC date, we have to convert
                        // the value back from local js date object into user's timezone datetime so we will
                        // send a proper UTC date to the server
                        var userTimezoneVal = convertToUserTimezoneDate(moment(val, dateFormat).toDate());

                        //if (!isTime) {
                        //    return userTimezoneVal;
                        //} else {
                        //    return userTimezoneVal;
                        //}

                        return userTimezoneVal;
                    });
                }
            };
        });
})();
