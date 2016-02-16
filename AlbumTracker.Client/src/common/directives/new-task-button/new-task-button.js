(function () {
    'use strict';
    angular.module('psteam.common.new-task-button.directive', ['ngMaterial'])

        .directive('pstNewTaskButton', function ($q, logger, $mdDialog) {
            logger.trace("directive('pstNewTaskButton')");

            var templateMap = {
                task: 'common/directives/new-task-button/new-task-dialog.tpl.html',
                documentFolder: 'common/directives/new-task-button/new-document-dialog.tpl.html',
                meeting: 'common/directives/new-task-button/new-meeting-dialog.tpl.html'
            };

            var showDialog = function (tasktype, topicCode) {
                return $mdDialog.show({
                    controller: function dialogController($mdDialog, $timeout, TopicsDataAccessService) {
                        var that = this;
                        logger.trace("directive('pstNewTaskButton'):controller.newTask:$mdDialog.show:controller");
                        that.tasktype = tasktype;
                        that.tasktypeName = (tasktype === 'documentFolder' ? 'document' : tasktype);
                        that.topicsAutocomplete = function (query) {
                            return TopicsDataAccessService.autocompleteTopicsWithCreatePermissions(query, tasktype);
                        };
                        that.cancel = function () {
                            logger.trace("directive('pstNewTaskButton'):controller.newTask:$mdDialog.show:controller.cancel");
                            $mdDialog.cancel();
                        };
                        that.createTask = function () {
                            logger.trace("directive('pstNewTaskButton'):controller.newTask:$mdDialog.show:controller.createTask");
                            $mdDialog.hide(that.topic);
                        };

                        if (topicCode) {
                            TopicsDataAccessService.autocompleteTopicsWithCreatePermissions(topicCode, tasktype).then(function(results) {
                                if (results && results.length > 0) {
                                    if (results[0].code === topicCode) {
                                        that.topic = results[0];
                                    }
                                }
                            });
                        }
                    },
                    controllerAs: 'ctrl',
                    templateUrl: templateMap[tasktype],
                    targetEvent: event,
                    focusOnOpen: false
                });
            };
            return {
                restrict: 'E',
                templateUrl: 'common/directives/new-task-button/new-task-button.tpl.html',
                transclude: false,
                scope: {},
                controller: function ($state, $mdDialog) {
                    logger.trace("directive('pstNewTaskButton'):controller");
                    this.newTask = function (event, tasktype) {
                        logger.trace("directive('pstNewTaskButton'):controller.newTask", event);
                        var topicCode = '';
                        if ($state.params && $state.params.topicCode) {
                            topicCode = $state.params.topicCode;
                        }
                        showDialog(tasktype, topicCode)
                            .then(function (topic) {
                                logger.trace("directive('pstNewTaskButton'):controller.newTask:$mdDialog.show:success", topic);
                                var stateName;
                                switch (tasktype) {
                                  case 'meeting':
                                    stateName = 'meeting_update';
                                    break;
                                  case 'task':
                                  case 'project':
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
                                if (topic && angular.isString(topic.code)) {
                                    $state.go(stateName, {
                                        topicCode: topic.code,
                                        id: 'new'
                                    }, {
                                        reload: true
                                    });
                                }
                            }, function (cancellation) {
                                logger.trace("directive('pstNewTaskButton'):controller.newTask:$mdDialog.show:cancel", cancellation);
                            });
                    };

                    this.newDocument = function (event) {
                        logger.trace("directive('pstNewTaskButton'):controller.newDocument", event);
                        var topicCode = '';
                        if ($state.params && $state.params.topicCode) {
                            topicCode = $state.params.topicCode;
                        }
                        showDialog('documentFolder', topicCode)
                            .then(function (topic) {
                                logger.trace("directive('pstNewTaskButton'):controller.newDocument:$mdDialog.show:success", topic);
                                if (topic && angular.isString(topic.code)) {
                                    $state.go('document_update', {
                                        topicCode: topic.code,
                                        id: 'new'
                                    }, {
                                        reload: true
                                    });
                                }
                            }, function (cancellation) {
                                logger.trace("directive('pstNewTaskButton'):controller.newDocument:$mdDialog.show:cancel", cancellation);
                            });
                    }
                },
                controllerAs: 'ctrl',
                bindToController: true
            };
        }
    );

})();
