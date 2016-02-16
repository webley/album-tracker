/* global angular */
(function () {
    'use strict';

    angular.module('psteam.common.tasks.taskCode', [])
        .factory('TaskCodeFactory', function () {

            var TaskCode = function (topicCode, taskId) {
                this.topicCode = topicCode;
                this.taskId = taskId;
            };

            TaskCode.prototype = {
                toString: function () {
                    return this.topicCode + '#' + this.taskId;
                },
                equals: function (other) {
                    return this.topicCode === other.topicCode &&
                        this.taskId === other.taskId;
                },
                equalsString: function (other) {
                    return this.toString() === other;
                }
            };

            TaskCode.fromString = function (taskCode) {
                var task = taskCode.split('#');
                var topicCode = task[0];
                var taskId = task.length > 1 ? task[1] : undefined;
                taskId = parseInt(taskId);

                taskId = (taskId === NaN) ? undefined : taskId;

                return new TaskCode(topicCode, taskId);
            };

            return TaskCode;
        })

        .constant('taskCodeSort', function (t1, t2) {
            var topicCode1 = null;
            var taskId1 = null;
            var topicCode2 = null;
            var taskId2 = null;
            if (typeof(t1) === 'object' && 'task' in t1) {
                topicCode1 = t1.task.topicCode;
                taskId1 = t1.task.id;
                topicCode2 = t2.task.topicCode;
                taskId2 = t2.task.id;
            }
            if (topicCode1 == null || taskId1 == null) {
                return 0;
            }
            var topicCodeCompareResult = topicCode1.localeCompare(
                topicCode2, {
                    usage: 'sort',
                    sensitivity: 'base'
                });
            if (topicCodeCompareResult == 0) {
                return taskId1 - taskId2;
            }
            return topicCodeCompareResult;
        });
})();
