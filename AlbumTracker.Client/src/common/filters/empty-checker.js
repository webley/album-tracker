(function () {
    'use strict';

    angular.module('psteam.common.filters.emptyChecker', [])

        .filter('emptyChecker', function () {
            return function (replyText) {
                if (angular.isUndefined(replyText) || replyText === null) {
                    return '';
                }
                return replyText;
            };
        });
})();
