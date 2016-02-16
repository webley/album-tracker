(function () {
    "use strict";
    angular.module('psteam.common.data-access.projects', [])
        .service('ProjectsDataAccessService',
        function ($q, $http, logger) {
            logger.trace('ProjectsDataAccessService');
            this.autocompleteProjects = function (keyword) {
                logger.trace('ProjectsDataAccessService.autocompleteProjects');
                var deferred = $q.defer();
                var uri = 'api/projects/autocomplete';
                $http.post(uri, {keyword: keyword})
                    .success(function (data, status, headers, config) {
                        logger.trace("ProjectsDataAccessService.autocompleteProjects:$http.post('api/projects/autocomplete').success", data);
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        logger.error("ProjectsDataAccessService.autocompleteProjects:$http.post('api/projects/autocomplete').error", data);
                        deferred.reject(data);
                    });
                return deferred.promise;
            }
        }
    );
})();
