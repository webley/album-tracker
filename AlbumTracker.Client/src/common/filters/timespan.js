/* global angular */
(function () {
    'use strict';

    angular.module('psteam.common.filters.timespan', [])
        .filter('timespan', function () {
            return function (input) {
                var out = input || '';
                if (out.length >= 8) {
                    out = out.substring(0, 8);
                }
                return out;
            };
        });
})();
