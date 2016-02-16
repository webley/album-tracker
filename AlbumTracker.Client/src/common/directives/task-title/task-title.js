(function () {
    'use strict';
    angular.module('psteam.common.task-title.directive', ['ngMaterial'])

        .directive('pstTaskTitle', function (logger) {
            logger.trace("directive('pstTaskTitle')");

            function onKeyDown(event) {
                if (event.which === 13 || event.which === 10) {
                    event.preventDefault();
                }
            }

            function onChange(event) {
                var textarea = $(event.target);
                var text = textarea.val();
                textarea.val(text.replace(/[\n\r]/g, ''));
            }

            return {
                controller: function () {                                      
                },
                controllerAs: 'ctrl',
                bindToController: true,
                restrict: 'E',
                link: function link(scope, element, attrs, controller, transcludeFn) {
                    var textarea = element.find('textarea');
                    textarea.on('keydown', onKeyDown);
                    textarea.on('input', onChange);
                    scope.$on('$destroy', function () {
                        textarea.off('keydown', onKeyDown);
                        textarea.off('input', onChange);
                    });
                },
                templateUrl: 'common/directives/task-title/task-title.tpl.html',
                scope: {
                    title: '=ngModel',
                    disabled: '=ngDisabled'
                }
            };
        });

})();
