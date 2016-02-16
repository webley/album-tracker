(function () {
    'use strict';
    angular.module('psteam.common.data-access.authorisation', [])
        .service('AuthorisationDataAccessService',
        function ($q, $http, logger) {
            this.getTaskAuthorisation = function (taskCode) {
                logger.trace("AuthorisationDataAccessService.getTaskAuthorisation(task = '%s')", taskCode);
                var deferred = $q.defer();
                $http.get('api/authorisation/tasks/' + encodeURIComponent(taskCode))
                    .success(function (data, status, headers, config) {
                        logger.trace("AuthorisationDataAccessService.getTaskAuthorisation:$http.get.success", data);
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        logger.error("AuthorisationDataAccessService.getTaskAuthorisation:$http.get.error", data);
                        deferred.reject(data);
                    });
                return deferred.promise;
            };

            this.getTaskCreateAuthorisation = function (topicCode) {
                logger.trace("AuthorisationDataAccessService.getTaskCreateAuthorisation(topicCode = '%s')", topicCode);
                var deferred = $q.defer();
                $http.get('api/authorisation/taskcreate/' + encodeURIComponent(topicCode))
                    .success(function (data, status, headers, config) {
                        logger.trace("AuthorisationDataAccessService.getTaskCreateAuthorisation:$http.get.success", data);
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        logger.error("AuthorisationDataAccessService.getTaskCreateAuthorisation:$http.get.error", data);
                        deferred.reject(data);
                    });
                return deferred.promise;
            };

        }
    );
})();
