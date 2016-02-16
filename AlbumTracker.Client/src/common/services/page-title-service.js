(function () {
    'use strict';
    angular.module('psteam.common.services.pagetitle', [])
        .service('PageTitleService', function () {
            var title = 'PS-Team';
            this.getPageTitle = function () {
                return title;
            };

            this.setPageTitle = function (pageTitle) {
                title = pageTitle;
            }
        });
})();
