(function () {
    'use strict';
    angular.module('psteam.common.filters.startDue', [])
        .filter('startDue', function ($filter) {
            return function (value, format) {
                if (value === "0001-01-01T00:00:00" || value === "1970-01-01T00:00:00") {
                    return "";
                }
                var filtered = $filter('date')(value, typeof(format) === "undefined" ? "shortDate" : format);
                return filtered;
            };
        });
})();
