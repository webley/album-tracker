(function () {
    'use strict';
    angular.module('psteam.common.filters.escape', [])
        .filter('escape', function ($window) {
            return $window.encodeURIComponent;
        });
})();
