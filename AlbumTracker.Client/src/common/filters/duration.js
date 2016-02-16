(function () {
    'use strict';
    angular.module('psteam.common.filters.duration', [])
        .filter('duration', function () {
            return function (duration) {
                if (isNaN(duration)) {
                    return '';
                }
                return duration / (3600 * 24) + 'd';
            };
        });
})();
