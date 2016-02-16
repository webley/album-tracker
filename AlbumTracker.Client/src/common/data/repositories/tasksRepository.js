(function () {
    'use strict';
    angular.module('psteam.common.data.repositories.tasksRepository', ['dal'])

        .service('tasksRepository', function (dal) {

            /**
             * Get statistics about tasks in topics.
             * @returns {Promise<Object[]>} promise of task statistic
             */
            function getTaskStatistic () {
                return dal
                    .get('topic/statistic');
            }

            /**
             * Get task model by task code
             * @param {string} taskCode task model
             * @returns {Promise<RepresentationModel>} promise of task model
             */
            function getTask (taskCode) {
                return dal
                    .get('tasks/' + encodeURIComponent(taskCode))
                    .mapToModel('TaskModel');
            }

            /**
             * Cretae new task
             * @param {string} topicCode topic code
             * @returns {RepresentationModel} task model
             */
            function getEmptyTask (topicCode) {
                var task = dal.newModel('TaskModel');
                task.$model.topicCode = topicCode; // todo
                return task;
            }

            /**
             * Get authorisation for task
             * @param {string} taskCode task code
             * @returns {Promise<Object>} promise of authorisation object for task
             */
            function getTaskAuthorisation (taskCode) {
                return dal
                    .get('authorisation/tasks/' + encodeURIComponent(taskCode));
            }

            /**
             * Get authorisation for new task
             * @param {string} topicCode topic code
             * @returns {Promise<Object>} promise of authorisation object for new task
             */
            function getNewTaskAuthorisation (topicCode) {
                return dal
                    .get('authorisation/taskcreate/' + encodeURIComponent(topicCode));
            }

            return {
                getTaskStatistic: getTaskStatistic,
                getTask: getTask,
                getEmptyTask: getEmptyTask,
                getTaskAuthorisation: getTaskAuthorisation,
                getNewTaskAuthorisation: getNewTaskAuthorisation
            };

        });

})();
