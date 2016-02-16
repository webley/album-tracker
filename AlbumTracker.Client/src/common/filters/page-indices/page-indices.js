(function () {
    'use strict';
    angular.module('psteam.common.filters.pageIndices', [])
        .filter('pageFirstIndex', function () {
            return function (page, pageSize, totalHits) {
                return totalHits === 0
                    ? 0
                    : (page - 1) * pageSize + 1;

            };
        })
        .filter('pageLastIndex', function () {
            return function (page, pageSize, totalHits) {
                return (page * pageSize) > totalHits
                    ? totalHits
                    : (page * pageSize);

            };

        });

})();
