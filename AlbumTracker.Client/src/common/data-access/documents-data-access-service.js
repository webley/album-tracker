(function () {
    'use strict';
    angular.module('psteam.common.data-access.documents', [])
        .service('DocumentsDataAccessService',
        function ($http, logger) {
            logger.trace('DocumentsDataAccessService');
            this.autocompleteDocuments = function (keyword) {
                logger.trace("DocumentsDataAccessService.autocompleteDocuments(keyword = '%s')", keyword);
                return $http
                    .post('api/documents/autocomplete', {keyword: keyword})
                    .then(function (response) {
                        logger.trace("DocumentsDataAccessService.autocompleteDocuments:$http.post('api/documents/autocomplete'", response);
                        return response.data;
                    });
            };
            this.getRootFolders = function (topicCode) {
                logger.trace("DocumentsDataAccessService.getRootFolders(topicCode = '%s')", topicCode);
                var topic = encodeURIComponent(topicCode);
                return $http
                    .get('api/documents/topic/' + encodeURIComponent(topic))
                    .then(function (response) {
                        logger.trace("DocumentsDataAccessService.getRootFolders:$http.get('api/documents/topic/" + topic + "')", response);
                        return response.data;
                    });
            };

            this.getDocument = function (taskCode) {
                logger.trace("DocumentsDataAccessService.getDocument(taskCode = '%s')", taskCode);
                var encodedTaskCode = encodeURIComponent(taskCode);
                return $http
                    .get('api/documents/' + encodedTaskCode)
                    .then(function (response) {
                        logger.trace("DocumentsDataAccessService.getDocument:$http.get('api/documents/" + encodedTaskCode + "')", response);
                        return response.data;
                    }, function(err) {
                        logger.error(err);
                    });
            };

            this.getDocumentHistory = function (taskCode) {
                logger.trace("DocumentsDataAccessService.getDocumentHistory(taskCode = '%s')", taskCode);

                var topicReq = 'api/documents/' + encodeURIComponent(taskCode) + '/history';
                return $http.get(topicReq)
                    .then(function (data, status, headers, config) {
                        logger.trace("TasksDataAccessService.getTaskHistory:$http.get('api/tasks/taskCode/history').success", data);
                    }, function (data, status, headers, config) {
                        logger.error("TasksDataAccessService.getTaskHistory:$http.get('api/tasks/taskCode/history').error", data);
                    });
            };
        });
})();
