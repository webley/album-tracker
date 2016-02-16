(function () {
    'use strict';
    var classes = {
        task: 'fa-list-alt',
        project: 'fa-sitemap',
        supplyChain: 'fa-archive',
        documentFolder: 'fa-files-o',
        meeting: 'fa-calendar'
    };

    angular.module('psteam.common.topicTypeIcon.filter', [])

        .filter('pstTopicTypeIcon', function () {
            return function (topicType) {
                return classes[topicType];
            }
        });
})();
