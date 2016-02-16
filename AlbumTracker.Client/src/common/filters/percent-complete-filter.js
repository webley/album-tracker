(function () {
    'use strict';
    angular.module('psteam-percent-complete-filter', [])
        .filter('percentComplete', function () {
            return function (completeAmount) {
                if (!completeAmount) {
                    return '0%';
                }

                var completeAsFloat = parseFloat(completeAmount);
                return completeAsFloat.toFixed(0) + '%';
            };
        });
})();
