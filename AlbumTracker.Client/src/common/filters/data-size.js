(function () {
    'use strict';

    angular.module('psteam.common.filters.dataSize', [])

        .filter('dataSize', function ($filter) {
            return function (input, fractionSize) {
                if (angular.isUndefined(fractionSize)) {
                    fractionSize = 1;
                }

                if (!input) {
                    input = 0;
                }
                var out = input;

                var suffix = 'B';
                var kilo = 1 << 10;
                var mega = 1 << 20;
                var giga = 1 << 30;
                var tera = Math.pow(2, 40);

                if (out >= tera) {
                    out = out / tera;
                    suffix = 'TB';
                } else if (out >= giga) {
                    out = out / giga;
                    suffix = 'GB';
                } else if (out >= mega) {
                    out = out / mega;
                    suffix = 'MB';
                } else if (out >= kilo) {
                    out = out / kilo;
                    suffix = 'KB';
                } else {
                    fractionSize = 0;
                }

                var filtered =
                    $filter('number')(out, fractionSize);

                return filtered + suffix;
            };
        });
})();
