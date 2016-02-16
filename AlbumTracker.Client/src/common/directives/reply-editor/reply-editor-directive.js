(function () {
    'use strict';
    angular.module('psteam.common.reply-editor.directive', ['psteam.common.filters.emptyChecker'])

        .directive('pstReplyEditor', function ($timeout, logger) {
            logger.trace('pstReplyEditor');
            function link(scope, element, attrs, ctrl) {
                var that = this;
                logger.trace('pstReplyEditor:link');
                scope.enablePreview = function () {
                    logger.trace('pstReplyEditor:enablePreview');
                    ctrl.preview = true;
                };

                scope.disablePreview = function () {
                    logger.trace('pstReplyEditor:disablePreview');
                    ctrl.preview = false;
                    $timeout(function () {
                        element.find('textarea').focus();
                    }, 250);
                };

                if (ctrl.markdown === undefined) {
                    ctrl.markdown = true;
                }
                scope.$watch(scope.preview, function(n) {
                    ctrl.preview = n;
                });
            }

            return {
                controller: function () {
                },
                controllerAs: 'ctrl',
                bindToController: true,
                templateUrl: 'common/directives/reply-editor/reply-editor.tpl.html',
                scope: {
                    disabled: '=?ngDisabled',
                    replyText: '=pstReplyText',
                    markdown: '=?',
                    preview: '=pstPreview'
                },
                link: link
            };
        }
    );
})();
