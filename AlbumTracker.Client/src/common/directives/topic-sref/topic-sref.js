(function () {
    'use strict';

    angular.module('psteam.common.topic-sref.directive', ['ui.router'])
        .directive('pstTopicSref', function ($state) {
            return {
                restrict: 'A',
                scope: {
                    topicCode: '@pstTopicCode',
                    taskId: '@pstTaskId'
                },
                link: function ($scope, $element, $attrs) {
                    var stateName;
                    switch ($attrs.pstTaskType) {
                        case 'meeting':
                            stateName = 'meeting_update';
                            break;
                        case 'project':
                            stateName = 'project';
                            break;
                        case 'task':
                        case 'supplyChain':
                            stateName = 'task_update';
                            break;
                        case 'document':
                            stateName = 'document_update';
                            break;
                        case 'folder':
                            stateName = 'folders';
                            break;
                        default:
                            stateName = 'task_redirect';
                            break;
                    }
                    var url = $state.href(stateName, {
                        topicCode: $scope.topicCode,
                        id: $scope.taskId
                    });
                    $attrs.$set('href', url);
                }
            };
        });
})();
