(function () {
    'use strict';
    angular.module('psteam.common.data-access.admin', [])
        .service('AdminDataAccessService',
        function ($http, clientLogger /* We don't use server loggger until authenticated*/) {
            clientLogger.trace('LoginDataAccessService');
            this.isUserAdmin = function () {
                clientLogger.trace('AdminDataAccessService.isUserAdmin()');
                return $http.get('api/admin/isadmin').then(function(response){
                    return response.data;
                });
            };

            this.getSystemStatistics = function () {
                clientLogger.trace('AdminDataAccessService.getSystemStatistics()');
                return $http.get('api/admin/overview').then(function(response){
                    return response.data;
                });
            };

            this.getMemoryUsage = function() {
                clientLogger.trace('AdminDataAccessService.getMemoryUsage()');
                return $http.get('api/admin/memory').then(function(response){
                    return response.data;
                });
            }

            this.getCpuUsage = function () {
                clientLogger.trace('AdminDataAccessService.getCpuUsage()');
                return $http.get('api/admin/cpu').then(function(response){
                    return response.data;
                });
            };

        });
})();
