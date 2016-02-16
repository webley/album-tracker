(function () {
    'use strict';
    var classes = {
        task: 'fa-list-alt',
        project: 'fa-sitemap',
        supplyChain: 'fa-archive',
        'document': 'fa-file',
        folder: 'fa-folder-open',
        meeting: 'fa-calendar'
    };

    angular.module('psteam.common.taskTypeIcon.filter', [])

        .filter('pstTaskTypeIcon', function () {
            return function (taskType) {
                return classes[taskType];
            }
        });
})();
