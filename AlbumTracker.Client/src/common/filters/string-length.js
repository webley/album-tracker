/* global angular */
(function () {
    'use strict';

    angular.module('psteam.common.filters.string-length', [])
        .filter('stringLength', function () {
            return function (inputStr, maxLength, addEllipsis) {
                if (addEllipsis === undefined) {
                    addEllipsis = true;
                }

                var out = inputStr;
                if (out.length > maxLength) {
                    if (addEllipsis) {
                        maxLength -= 3;
                    }

                    out = out.substring(0, maxLength);

                    if (addEllipsis) {
                        out = out + '...';
                    }
                }

                return out;
            };
        });
})();
