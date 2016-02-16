(function () {
    'use strict';
    angular.module('psteam.common.services.searchquery', [])
        .service('SearchQueryService', function () {
            var query = '';
            this.getSearchQuery = function () {
                return query;
            };

            this.setSearchQuery = function (searchQuery) {
                query = searchQuery;
            };
        });
})();
