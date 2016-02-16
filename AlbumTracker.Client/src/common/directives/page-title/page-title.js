(function () {
    'use strict';
    angular.module('psteam.common.directives.pst-page-title', [])
        .directive('pstPageTitle', function (PageTitleService) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    scope.$watch(function () {
                        return PageTitleService.getPageTitle();
                    }, function (pageTitle) {
                        document.title = pageTitle;
                    });
                }
            };
        });
})();
