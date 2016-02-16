angular.module('psteam.common.services.task',
    ['psteam.common.repositories.tasks'])
    .service('TaskService', function (TasksRepositoryService, logger) {
        logger.trace("TaskService");
        this.getTask = function (taskCode) {
            logger.trace("TaskService.getTask(taskCode = '%s')", taskCode);
            return TasksRepositoryService.getTask(taskCode);
        };

        this.getTasksByCodes = function (taskCodeList) {
            logger.trace("TaskService.getTasksByCodes", taskCodeList);
            return TasksRepositoryService.getTasksByCodes({
                taskCodeList: taskCodeList
            });
        };

        this.getEmptyTask = function (topicCode, taskType) {
            logger.trace("TaskService.getEmptyTask(taskCode = '%s', taskType = '%s')", topicCode, taskType);
            return TasksRepositoryService.getEmptyTask(topicCode, taskType);
        };

        this.getTaskHistory = function (taskCode) {
            logger.trace("TaskService.getTaskHistory(taskCode = '%s')", taskCode);
            return TasksRepositoryService.getTaskHistory(taskCode);
        };

        this.searchTasks = function (query, pageSize, pageNumber, sortOrder) {
            logger.trace("TaskService.searchTasks", {
                'query': query,
                'pageSize': pageSize,
                'pageNumber': pageNumber,
                'sortOrder': sortOrder
            });
            return TasksRepositoryService.searchTasks(query, pageSize, pageNumber, sortOrder);
        };

        this.saveTasks = function (replyArray, sendEmailNotifications) {
            logger.trace("TaskService.saveTasks", {
                'replyArray': replyArray,
                'sendEmailNotifications': sendEmailNotifications
            });
            return TasksRepositoryService.saveTasks(replyArray, sendEmailNotifications);
        };

        this.autocompleteTasks = function (keyword, taskTypes) {
            logger.trace("TaskService.autocompleteTasks(keyword = '%s', taskTypes = '%s')", keyword, taskTypes);
            return TasksRepositoryService.autocompleteTasks(keyword, taskTypes);
        };

        this.calculateRollupFromChildren = function (childTaskCodes) {
            logger.trace("TaskService.calculateRollupFromChildren", childTaskCodes);
            return TasksRepositoryService.calculateRollupFromChildren(childTaskCodes);

        };
    });
