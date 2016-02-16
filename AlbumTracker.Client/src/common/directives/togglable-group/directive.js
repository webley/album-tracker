(function () {
    'use strict';
    angular.module('psteam.common.togglableGroup.directive', [
        'ngAnimate'
    ])

        // <togglable-group></togglable-group>
        .directive('togglableGroup', function (logger) {
            logger.trace(".directive('togglableGroup'");
            function link(scope, iElement, iAttrs, ctrl, transcludeFn) {
                logger.trace(".directive('togglableGroup':link");
                scope.state = false;

                transcludeFn(function (clone) {
                    logger.trace(".directive('togglableGroup':link:transcludeFn");
                    var label = clone.filter(scope.labelSelector);
                    var content = clone.filter(scope.contentSelector);

                    iElement.find('[data-group-label]')
                        .append(label);

                    iElement.find('[data-group-content]')
                        .append(content);
                });

            }

            return {

                restrict: 'E',
                transclude: true,
                link: link,
                templateUrl: 'common/directives/togglable-group/template.tpl.html',
                scope: {
                    labelSelector: '@pstLabelSelector',
                    contentSelector: '@pstContentSelector',
                    labelClass: '@?pstLabelClass',
                    contentClass: '@?pstContentClass'
                }
            };
        });
})();
