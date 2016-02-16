(function () {
    'use strict';

    angular.module('psteam.common.directives.pstMenuLink', [])

        .directive('pstMenuLink', function ($timeout) {
            return {
                restrict: 'E',
                templateUrl: 'common/directives/menu-link/menu-link.tpl.html',
                scope: {
                    section: '=',
                    callback: '='
                }
            };
        }
    );

})();
