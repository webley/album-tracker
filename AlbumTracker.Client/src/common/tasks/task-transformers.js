/* global angular */
(function () {
    'use strict';

    var TASK_DATE_FIELDS = [
        'startDate',
        'dueDate',
        'baseStartDate',
        'baseDueDate'
    ];

    var TASK_RELATION_FIELDS = [
        'associates',
        'childTasks',
        'parentTasks',
        'attachedDocumentTasks'
    ];

    angular.module('psteam.common.tasks.taskTransformers', [
        'psteam.common.tasks.taskCode'
    ])
        .service('TaskTransformersService',
        function (TaskCodeFactory) {
            var that = this;

            this.transformTaskCode = function (task) {
                task.taskCode =
                    new TaskCodeFactory(
                        task.topicCode,
                        task.id);
                return task;
            };

            this.transformTaskCodeString = function (task) {
                task.taskCode =
                    new TaskCodeFactory(
                        task.topicCode,
                        task.id)
                        .toString();
                return task;
            };

            this.transformDateFields = function (task) {
                TASK_DATE_FIELDS.forEach(function (field) {
                    if (task.hasOwnProperty(field) && task[field]) {
                        var taskValue = task[field];
                        if (taskValue === null) {
                            task[field] = null;
                        } else {
                            task[field] = new Date(taskValue);
                        }
                    }
                });

                return task;
            };

            this.transformTaskRelationFields = function (task) {
                TASK_RELATION_FIELDS.forEach(function (field) {
                    if (task.hasOwnProperty(field) && task[field]) {
                        task[field]
                            .forEach(function (relatedTask) {
                                that.transformTaskCodeString(
                                    relatedTask);
                            });
                    }
                });

                return task;
            };

        }
    );

})();
