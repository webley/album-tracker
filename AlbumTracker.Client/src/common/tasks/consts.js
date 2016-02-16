/* global angular */
(function () {
    'use strict';
    angular.module('psteam.common.tasks.consts', ['gettext'])
        .factory('PrioritiesFactory',
        function (gettextCatalog) {
            return {
                1: gettextCatalog.getString('1 - High'),
                2: gettextCatalog.getString('2 - Medium'),
                3: gettextCatalog.getString('3 - Low')
            };
        })

        .factory('StatusesFactory',
        function (gettextCatalog) {
            return {
                'unscheduled': gettextCatalog.getString('Unscheduled'),
                'scheduled': gettextCatalog.getString('Scheduled'),
                'workInProgress': gettextCatalog.getString('WIP'),
                'completed': gettextCatalog.getString('Completed'),
                'review': gettextCatalog.getString('Review')
            };
        })

        .factory('DocumentStatusesFactory',
        function (gettextCatalog) {
            return {
                'deleted': gettextCatalog.getString('Deleted'),
                'checkedIn': gettextCatalog.getString('Checked In'),
                'checkedOut': gettextCatalog.getString('Checked Out'),
                'archived': gettextCatalog.getString('Archived')
            };
        });
})();
