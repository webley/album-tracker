(function () {
    'use strict';
    angular.module('psteam.common.filters.documentStatus', [
        'psteam.common.tasks.consts'
    ])
        .filter('documentStatus',
        function (DocumentStatusesFactory) {
            return function (input) {
                if (DocumentStatusesFactory.hasOwnProperty(input)) {
                    return DocumentStatusesFactory[input];
                } else {
                    return '';
                }
            };
        }
    );
})();
