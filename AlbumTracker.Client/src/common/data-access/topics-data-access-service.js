(function () {
    "use strict";
    angular.module('psteam.common.data-access.topics', [])
        .service('TopicsDataAccessService',
        function ($q, $http, logger) {
            logger.trace("TopicsDataAccessService");

            var getTopicList = function (type) {
                logger.trace("TopicsDataAccessService.getTopicList");
                var deferred = $q.defer();
                var uri = 'api/topics/list';
                if (typeof (type) != 'undefined') {
                    uri += '/' + type;
                }
                $http.get(uri)
                    .success(function (data, status, headers, config) {
                        logger.trace("TopicsDataAccessService.getTopicList:$http.get('api/topics/list').success", data);
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        logger.error("TopicsDataAccessService.getTopicList:$http.get('api/topics/list').error", data);
                        deferred.reject(data);
                    });
                return deferred.promise;
            };

            var searchTopics = function (keyword) {
                logger.trace("TopicsDataAccessService.searchTopics(keyword = '%s')", keyword);
                var deferred = $q.defer();
                $http.get('api/topics/search/' + encodeURIComponent(keyword))
                    .success(function (data, status, headers, config) {
                        logger.trace("TopicsDataAccessService.searchTopics:$http.get('api/topics/search').success", data);
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        logger.error("TopicsDataAccessService.searchTopics:$http.get('api/topics/search').error", data);
                        deferred.reject(data);
                    });
                return deferred.promise;
            };

            var autocompleteTopics = function (keyword, topicType) {
                logger.trace("TopicsDataAccessService.autocompleteTopics(keyword = '%s')", keyword);
                var deferred = $q.defer();
                var topicReq = 'api/topics/autocomplete';
                var request = { keyword: keyword};
                if (topicType) request['topicType'] = topicType;
                $http.post(topicReq, request)
                    .success(function (data, status, headers, config) {
                        logger.trace("TopicsDataAccessService.autocompleteTopics:$http.post('api/topics/autocomplete').success", data);
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        logger.error("TopicsDataAccessService.autocompleteTopics:$http.post('api/topics/autocomplete').error", data);
                        deferred.reject(data);
                    });

                return deferred.promise;
            };

            var autocompleteTopicsWithCreatePermissions = function (keyword, topicType) {
                logger.trace("TopicsDataAccessService.autocompleteTopicsWithCreatePermissions(keyword = '%s')", keyword);
                if (topicType == undefined) {
                    topicType = null;
                }
                var deferred = $q.defer();
                var topicReq = 'api/topics/autocomplete';
                $http.post(topicReq, {keyword: keyword, topicType: topicType, createPermissionsOnly: true})
                    .success(function (data, status, headers, config) {
                        logger.trace("TopicsDataAccessService.autocompleteTopicsWithCreatePermissions:$http.post('api/topics/autocomplete').success", data);
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        logger.error("TopicsDataAccessService.autocompleteTopicsWithCreatePermissions:$http.post('api/topics/autocomplete').error", data);
                        deferred.reject(data);
                    });

                return deferred.promise;
            };

            var getTopics = function (topicCodeList) {
                logger.trace('TopicsDataAccessService.getTopics', topicCodeList);
                var topicReq = 'api/topics';
                return $http.post(topicReq, {topicCodeList: topicCodeList})
                    .then(function (response) {
                        logger.trace("TopicsDataAccessService.getTopics:$http.post('api/topics').success", response);
                        return response.data;
                    },
                    function (response) {
                        logger.error("TopicsDataAccessService.getTopics:$http.post('api/topics').error", response);
                    });

            };

            var getTopicStatistics = function (topicCodeList) {
                logger.trace('TopicsDataAccessService.getTopicStatistics', topicCodeList);
                var topicReq = 'api/topics/statistics';
                return $http.post(topicReq, {topiccodelist: topicCodeList})
                    .then(function (response) {
                        logger.trace("TopicsDataAccessService.getTopicStatistics:$http.post('api/topic/statistic').success", response);
                        return response.data;
                    },
                    function (response) {
                        logger.error("TopicsDataAccessService.getTopicStatistics:$http.post('api/topic/statistic').error", response);
                        return $q.reject(response);
                    });
            };

            angular.extend(this, {
                getTopicList: getTopicList,
                searchTopics: searchTopics,
                autocompleteTopics: autocompleteTopics,
                autocompleteTopicsWithCreatePermissions: autocompleteTopicsWithCreatePermissions,
                getTopicStatistics: getTopicStatistics,
                getTopics: getTopics
            });
        }
    );
})();
