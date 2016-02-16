(function () {
    'use strict';

    angular.module('psteam.common.filters.markedSanitizer', [])

        .filter('markedSanitizer', function () {
            return function (replyText) {
                if (angular.isUndefined(replyText) || replyText === null) {
                    return '';
                }

                return replyText
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;');
            };
        });
})();
