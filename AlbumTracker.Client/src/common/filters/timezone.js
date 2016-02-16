/* global angular */
(function () {
    'use strict';

    angular.module('psteam.common.filters.timezone', [
        'psteam.common.i18n.timezone'
    ])
        .filter('timezone',
        function (timezoneService) {
            return function (inputDate) {
                return timezoneService
                    .applyTimezone(inputDate);
            };
        }
    );
})();
