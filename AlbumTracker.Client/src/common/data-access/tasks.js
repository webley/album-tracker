(function () {
    'use strict';
    angular.module('psteam.common.data-access.tasks', [])
        .service('TasksDataAccessService',
        function ($http, $q, logger) {
            logger.trace("TasksDataAccessService");
            this.getTask = function (taskCode) {
                logger.trace("TasksDataAccessService.getTask(taskСode = '%s')", taskCode);
                var deferred = $q.defer();
                $http.get('api/tasks/' + encodeURIComponent(taskCode))
                    .success(function (data, status, headers, config) {
                        logger.trace("TasksDataAccessService.getTask:$http.get('api/tasks').success", data);
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        logger.error("TasksDataAccessService.getTask:$http.get('api/tasks').error", data);
                        deferred.reject(data);
                    });
                return deferred.promise;
            };

            this.getTasksByCodes = function (taskCodeRequest) {
                logger.trace("TasksDataAccessService.getTasksByCodes", taskCodeRequest);
                return $http.post('api/tasks/bycodes', taskCodeRequest)
                    .then(function(data) {
                        return data.data;
                    },
                    function (reason) {
                        logger.error("TasksDataAccessService.getTasksByCodes:$http.get('api/tasks/bycodes').error ='%s'", reason, taskCodeRequest);
   
                    });
            };

            this.getTaskHistory = function (taskCode) {
                logger.trace("TasksDataAccessService.getTaskHistory(taskCode = '%s')", taskCode);
                var deferred = $q.defer();
                var topicReq = 'api/tasks/' + encodeURIComponent(taskCode) + '/history';
                $http.get(topicReq)
                    .success(function (data, status, headers, config) {
                        logger.trace("TasksDataAccessService.getTaskHistory:$http.get('api/tasks/taskCode/history').success", data);
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        logger.error("TasksDataAccessService.getTaskHistory:$http.get('api/tasks/taskCode/history').error", data);
                        deferred.reject(data);
                    });

                return deferred.promise;
            };

            this.saveTasks = function (reply) {
                logger.trace("TasksDataAccessService.saveTasks", reply);
                var deferred = $q.defer();
                $http.post('api/tasks', reply)
                    .success(function (data, status, headers, config) {
                        logger.trace("TasksDataAccessService.saveTasks:$http.post('api/tasks').success", data);
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        logger.error("TasksDataAccessService.saveTasks:$http.post('api/tasks').error", data);
                        deferred.reject(data);
                    });
                return deferred.promise;
            };

            /**
             * autocompleteTasks
             *
             * @param {string} keyword
             * @return {var} promise or something
             */
            this.autocompleteTasks = function (keyword, taskTypes) {
                logger.trace("TasksDataAccessService.autocompleteTasks(keyword = '%s', taskTypes = '%s')", keyword, taskTypes);
                var deferred = $q.defer();
                var topicReq = 'api/tasks/autocomplete';
                var taskTypesArray = taskTypes === undefined ? [] : taskTypes.replace(/\s+/g, '').split(',');
                $http.post(topicReq, { keyword: keyword, taskTypes: taskTypesArray })
                    .success(function (data, status, headers, config) {
                        logger.trace("TasksDataAccessService.autocompleteTasks:$http.post('api/tasks/autocomplete').success", data);
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        logger.error("TasksDataAccessService.autocompleteTasks:$http.post('api/tasks/autocomplete').error", data);
                        deferred.reject(data);
                    });

                return deferred.promise;
            };

            this.calculateRollupFromChildren = function (childTaskCodes) {
                logger.trace("TasksDataAccessService.calculateRollupFromChildren", childTaskCodes);
                var deferred = $q.defer();
                $http.post('api/tasks/rollup', {
                    childTaskCodes: childTaskCodes
                })
                    .success(function (data, status, headers, config) {
                        logger.trace("TasksDataAccessService.autocompleteTasks:$http.post('api/tasks/autocomplete').success", data);
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        logger.error("TasksDataAccessService.autocompleteTasks:$http.post('api/tasks/autocomplete').error", data);
                        deferred.reject(data);
                    });

                return deferred.promise;
            };
            this.searchTasks = function (query, pageSize, pageNumber, sortOrder) {
                logger.trace("TasksDataAccessService.searchTasks", {
                    'query': query,
                    'pageSize': pageSize,
                    'pageNumber': pageNumber,
                    'sortOrder': sortOrder
                });
                //sort array of {field:'fieldName', descending:false}
                var deferred = $q.defer();
                var searchReq = 'api/tasks/search';
                var queryType;
                var pageNumberParam = pageNumber;
                if (pageSize !== undefined && pageSize > 0) {
                    queryType =
                    {
                        query: query,
                        options: {
                            pageSize: pageSize,
                            pageNumber: pageNumberParam,
                            sortOrder: sortOrder
                        }
                    };
                } else {
                    queryType =
                    {
                        query: query,
                        options: {
                            pageSize: 0,
                            pageNumber: 0,
                            sortOrder: sortOrder
                        }
                    };
                }
                $http.post(searchReq, queryType)
                    .success(function (data, status, headers, config) {
                        logger.trace("TasksDataAccessService.searchTasks:$http.post('api/tasks/search').success", data);
                        angular.forEach(data.taskSearchResults, function (result) {
                            result.task.taskCode = result.task.topicCode + '#' + result.task.id;
                            result.task.taskId = result.task.id;
                        });

                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        logger.error("TasksDataAccessService.searchTasks:$http.post('api/tasks/search').error", data);
                        deferred.reject(data);
                    });

                return deferred.promise;
            };
        }
    );
})();
