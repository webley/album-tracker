(function () {
    'use strict';
    angular.module('psteam.task.directives.taskHistory', [
        'psteam.common.oneWayBindingContainer.directive',
        'psteam.common.filters.markedSanitizer',
        'psteam.common.filters.timezone',
        'psteam.task.controllers.history',
        'psteam-file-download-url-filter',
        'psteam.task.directives.taskReplyAudit'
    ])

        // <pst-task-history></pst-task-history>
        .directive('pstTaskHistory', function () {
            return {
                templateUrl: 'common/directives/task-history/task-history.tpl.html',
                controller: 'TaskHistoryController',
                controllerAs: 'ctrl',
                scope: {
                    history: '=pstHistory',
                    authorisation: '=pstAuthorisations',
                    reverse: '=?',
                    replyId: '=pstReplyId'
                },
                link: function (scope, element, attrs) {
                    scope.history.reverse = scope.reverse || false;
                    scope.mode = attrs.mode;
                }
            };
        });
})();
