(function () {
    'use strict';
    angular.module('psteam.common.filters.taskStatus', [
        'psteam.common.tasks.consts'
    ])
        .filter('taskStatus',
        function (StatusesFactory) {
            return function (input) {
                if (StatusesFactory.hasOwnProperty(input)) {
                    return StatusesFactory[input];
                } else {
                    return '';
                }
            };
        }
    );
})();
