/* global angular */
(function () {
    'use strict';

    var taskCodeSortAsc = function (t1, t2) {
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
        var topicCodeCompareResult = topicCode1.localeCompare(topicCode2, {
            usage: 'sort',
            sensitivity: 'base'
        });
        if (topicCodeCompareResult == 0) {
            return taskId1 - taskId2;
        }
        return topicCodeCompareResult;
    };
    var taskCodeSortDesc = function (t1, t2) {
        var result = taskCodeSortAsc(t1, t2);
        if (result != 0) {
            result = result * -1;
        }
        return result;
    };

    function sortGenerator(propertyName, descending) {
        return function (t1, t2) {
            if (propertyName == 'taskCode') {
                return descending ? taskCodeSortDesc(t1, t2) : taskCodeSortAsc(t1, t2);
            }
            var left = t1.task[propertyName];
            var right = t2.task[propertyName];
            if (left == right) {
                return 0;
            }
            if (left < right) {
                return descending ? 1 : -1;
            }
            return descending ? -1 : 1;
        }
    }

    angular.module('psteam.common.tasks.taskSort', ['psteam.common.tasks.taskCode'])
        .constant('taskSort', sortGenerator);
})();
