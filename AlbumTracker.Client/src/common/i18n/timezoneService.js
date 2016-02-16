(function () {
    'use strict';

    angular.module('psteam.common.i18n.timezone', [
        'psteam.common.i18n.timezonesByCountry'
    ])

        .service('timezoneService', function ($log, $q, timezonesByCountry) {
            var currentTimezone = 'Europe/London';

            this.getTimezoneDictionary = function () {
                var deferred = $q.defer();
                deferred.resolve(timezonesByCountry);
                return deferred.promise;
            };

            // Sets the current timezone on the client side.
            this.setTimezone = function (timezoneId) {
                var deferred = $q.defer();
                currentTimezone = timezoneId;
                deferred.resolve();
                return deferred.promise;
            };

            this.getCurrentTimezone = function () {
                return currentTimezone;
            };

            // Todo: Should this return a promise? It is used by the ubiquitous timezone filter.
            // Allows us to 'convert' UTC date into js Date object representing what user 
            // would expect according to his timezone settings in PS-Team settings
            // In other words, this function gets the jsDate representing proper UTC date (no matter 
            // browser adds to it when displaying in debugger) and constructs the local js Date
            // that will present to user numbers that he expects when the date is shown in the UI
            this.applyTimezone = function (date) {
                return new timezoneJS.Date(date, currentTimezone)._dateProxy;
            };

            function findTimeZoneSync(timezoneId) {
                var timezoneObj = null;

                for (var country in timezonesByCountry) {
                    var timezones = timezonesByCountry[country];
                    for (var i = 0; i < timezones.length; i++) {
                        var timezone = timezones[i];
                        if (timezone.timezoneId === timezoneId) {
                            timezoneObj = {
                                country: country,
                                timezone: timezone
                            };
                            return timezoneObj;
                        }
                    }
                }

                return null;
            }

            // Searches for thetimeZoneId in the array. Returns a promise that resolves to the array containing the timezone.
            this.findTimeZone = function (timezoneId) {
                var deferred = $q.defer();

                var timezoneObj = findTimeZoneSync(timezoneId);
                if (timezoneObj) {
                    deferred.resolve(timezoneObj);
                } else {
                    deferred.reject();
                }

                return deferred.promise;
            };
        }
    );
})();
