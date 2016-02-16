(function () {
    'use strict';
    angular.module('psteam-task-title', [])
        .filter('taskTitle', function () {
            return function (title) {
                if (title.length > 30) {
                    return title.substring(0, 27) + '...';
                }

                return title;
            };
        });
})();
