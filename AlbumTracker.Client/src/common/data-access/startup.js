(function () {
    'use strict';
    angular.module('psteam.common.data-access.startup', [])
        .service('StartupDataAccessService', function ($http, logger) {
            logger.trace("StartupDataAccessService");
            var isStarted = false;

            var start = function () {
                logger.trace("StartupDataAccessService.start");
                return $http.get('api/startup').then(function (response) {
                        logger.trace("StartupDataAccessService.autocompleteUsers:$http.get('api/startup').success", response);
                        var data = response.data;
                        if (data.Status === 'Started') {
                            isStarted = true;
                        } else {
                            isStarted = false;
                        }
                        return data;
                    }
                );
            };

            var started = function () {
                logger.trace("StartupDataAccessService.started");
                return isStarted;
            };

            angular.extend(this, {
                started: started,
                start: start
            });
        });
})();
