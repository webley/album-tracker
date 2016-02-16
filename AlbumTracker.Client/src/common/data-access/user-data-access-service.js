(function () {
    "use strict";
    angular.module('psteam.common.data-access.users', ['psteam.logger'])
        .service('UsersDataAccessService',
        function ($q, $http, logger) {
            logger.trace('UsersDataAccessService');

            /**
             * autocompleteUsers
             *
             * @param {string} keyword
             * @return {object}
             */
            this.autocompleteUsers = function (keyword) {
                logger.trace("UsersDataAccessService.autocompleteUsers(keyword = '%s')", keyword);
                var deferred = $q.defer();
                var topicReq = 'api/users/autocomplete';
                $http.post(topicReq, {keyword: keyword})
                    .success(function (data, status, headers, config) {
                        logger.trace("UsersDataAccessService.autocompleteUsers:$http.post('api/user/autocomplete').success", data);
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        logger.error("UsersDataAccessService.autocompleteUsers:$http.post('api/user/autocomplete').error", data);
                        deferred.reject(data);
                    });

                return deferred.promise;
            };

            this.updatePassword = function (oldPassword, newPassword) {
                logger.trace("UsersDataAccessService.updatePassword");
                var pwObj = {oldPassword: oldPassword, newPassword: newPassword};
                var deferred = $q.defer();
                $http.post('api/user/password', pwObj)
                    .success(function (data, status, headers, config) {
                        logger.trace("UsersDataAccessService.updatePassword:$http.post('api/user/password').success", data);
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        logger.error("UsersDataAccessService.updatePassword:$http.post('api/user/password').error", data);
                        deferred.reject(data);
                    });
                return deferred.promise;
            };

            this.updateJsonSettings = function (settings) {
                logger.trace("UsersDataAccessService.updateJsonSettings");

                return $http.post('api/user/json-settings', settings)
                    .then(function () {
                        logger.trace("UsersDataAccessService.updateJsonSettings:$http.post('api/user/json-ettings').success");
                    },
                    function (reason) {
                        logger.error("UsersDataAccessService.updateJsonSettings:$http.post('api/user/json-settings').error", reason);
                    });

            };

            // Returns the basic properties of the logged in user.
            this.getResults = function () {
                logger.trace("UsersDataAccessService.getResults");
                var deferred = $q.defer();
                $http.get('api/user/settings/')
                    .success(function (data, status, headers, config) {
                        logger.trace("UsersDataAccessService.getResults:$http.get('api/user/settings').success", data);
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        logger.error("UsersDataAccessService.getResults:$http.get('api/user/settings').error", data);
                        deferred.reject(data);
                    });
                return deferred.promise;
            };


            this.updateResults = function (person) {
                logger.trace("UsersDataAccessService.updateResults", person);
                var deferred = $q.defer();
                $http.post('api/user/settings/', person)
                    .success(function (data, status, headers, config) {
                        logger.trace("UsersDataAccessService.updateResults:$http.post('api/user/settings').success", data);
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        logger.error("UsersDataAccessService.updateResults:$http.post('api/user/settings').error", data);
                        deferred.reject(data);
                    });
                return deferred.promise;
            };

            // Get the topics of the logged in user. Returns either the topics of the user or an error message
            this.getTopics = function () {
                logger.trace("UsersDataAccessService.getTopics");
                var deferred = $q.defer();
                $http.get('api/user/topics/')
                    .success(function (data, status, headers, config) {
                        logger.trace("UsersDataAccessService.getTopics:$http.get('api/user/topics').success", data);
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        logger.error("UsersDataAccessService.getTopics:$http.get('api/user/topics').error", data);
                        deferred.reject(data);
                    });
                return deferred.promise;
            };

            // Service to update the topics of a user. Returns the response from the server.
            this.updateTopics = function (modifiedTopics) {
                logger.trace("UsersDataAccessService.updateTopics", modifiedTopics);
                var deferred = $q.defer();
                $http.post('api/user/topics/', modifiedTopics)
                    .success(function (data, status, headers, config) {
                        logger.trace("UsersDataAccessService.updateTopics:$http.post('api/user/topics').success", data);
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        logger.error("UsersDataAccessService.updateTopics:$http.post('api/user/topics').error", data);
                        deferred.reject(data);
                    });
                return deferred.promise;
            };
            this.getSettings = function () {
                logger.trace('UsersDataAccessService.getSettings');
                var deferred = $q.defer();
                $http.get('api/user/settings')
                    .success(function (data, status, headers, config) {
                        logger.trace("UsersDataAccessService.getSettings:$http.get('api/user/settings').success", data);
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        logger.error("UsersDataAccessService.getSettings:$http.get('api/user/settings').error", data);
                        deferred.reject(data);
                    });
                return deferred.promise;
            };
        }
    );
})();
