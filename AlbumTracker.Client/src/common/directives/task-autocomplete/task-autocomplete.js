(function () {
    'use strict';
    angular.module('psteam.common.autocomplete.task.directive', ['psteam-task-title', 'psteam.common.topic-sref.directive'])

        .directive('pstTaskAutocomplete', function (logger) {
            logger.trace('pstTaskAutocomplete');
            return {
                restrict: 'E',
                templateUrl: 'common/directives/task-autocomplete/task-autocomplete.tpl.html',
                transclude: true,
                scope: {
                    searchQuery: '&',
                    taskTypes: '@',
                    label: '@',
                    tasks: '=tasksCollection',
                    extraDisplay: '=extraCollection',
                    disabled: '=?ngDisabled'
                },
                compile: function (tElem, tAttrs) {
                    logger.trace('pstTaskAutocomplete:compile');
                    var mdChips = tElem.find('md-chips')[0];
                    var appendAttr = document.createAttribute('md-on-append');
                    appendAttr.value = 'appendTask($chip)';
                    mdChips.attributes.setNamedItem(appendAttr);

                    // Returned function is post-link.
                    return function (scope, element, attrs) {
                        logger.trace('pstTaskAutocomplete:compile:postlink(returned)');
                        var searchFn = scope.searchQuery();
                        var taskDict = {};

                        var _tasklist = [];
                        // Add any already-bound objects to the dictionary, to prevent adding duplicates.
                        for (var i = 0; i < scope.tasks.length; i++) {
                            var task = scope.tasks[i];
                            taskDict[task.taskCode] = task;
                            _tasklist.push(task);
                        }

                        if (scope.extraDisplay) {
                            for (var i = 0; i < scope.extraDisplay.length; i++) {
                                var task = scope.extraDisplay[i];
                                taskDict[task.taskCode] = task;
                                _tasklist.push(task);
                            }
                        }

                        scope.tasklist = _tasklist;

                        if (scope.extraDisplay == undefined) {
                            scope.extraDisplay = [];
                        }

                        scope.$watchCollection('tasklist', function (newList, oldList) {
                            if (newList !== undefined) {
                                var newTasks = [];
                                var newExtraDisplay = [];
                                for (var i = 0; i < newList.length; i++) {
                                    var index = scope.extraDisplay.map(function (e) {
                                        return e.taskCode;
                                    }).indexOf(newList[i].taskCode);
                                    if (index > -1) {
                                        newExtraDisplay.push(newList[i]);
                                    } else {
                                        newTasks.push(newList[i]);
                                    }
                                }
                                scope.tasks = newTasks;
                                scope.extraDisplay = newExtraDisplay;
                            }
                        });

                        scope.searchQuery = function (searchTerm, taskTypes) {
                            logger.trace('pstTaskAutocomplete:compile:scope.searchQuery', searchTerm);
                            return searchFn(searchTerm, taskTypes).then(function (data) {
                                logger.trace('pstTaskAutocomplete:compile:scope.searchQuery:return searchFn(searchTerm, taskTypes).then.success', data);
                                for (var i = 0; i < data.length; i++) {
                                    var task = data[i];
                                    if (taskDict[task.taskCode] !== undefined) {
                                        data[i] = taskDict[task.taskCode];
                                    }
                                }

                                return data;
                            });
                        };

                        scope.appendTask = function (taskChip) {
                            logger.trace('pstTaskAutocomplete:compile:scope.scope.appendTask', taskChip);
                            taskDict[taskChip.taskCode] = taskChip;
                            return taskChip;
                        }
                    }
                }
            };
        }
    );

})();
