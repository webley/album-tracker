(function () {
    'use strict';
    angular.module('psteam.common.filters.taskPriority', ['gettext'])
        .filter('taskPriority', function ($filter, gettextCatalog) {
            //gettext('TaskPriority-High');
            //gettext('TaskPriority-Medium');
            //gettext('TaskPriority-Low');

            var map = {
                1: gettextCatalog.getString('High'),
                2: gettextCatalog.getString('Medium'),
                3: gettextCatalog.getString('Low')
            };

            return function (priority) {
                if (angular.isNumber(priority)) {
                    return map[priority];
                }
            };
        });
})();
