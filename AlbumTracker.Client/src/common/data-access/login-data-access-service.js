(function () {
    'use strict';
    angular.module('psteam.common.data-access.login', [])
        .service('LoginDataAccessService',
        function ($http, clientLogger /* We don't use server loggger until authenticated*/) {
            clientLogger.trace('LoginDataAccessService');
            this.login = function (userName, password) {
                clientLogger.trace("LoginDataAccessService.login(userName = '%s', password = ...)", userName);
                return $http.post('api/login', {
                    userName: userName,
                    password: password
                });
            };

            this.windowsLogin = function () {
                clientLogger.trace('LoginDataAccessService.windowsLogin');
                return $http.get('api/login/wa');
            };

            this.certificateLogin = function () {
                clientLogger.trace('LoginDataAccessService.certificateLogin');
                return $http.get('api/login/ca');
            };

            this.getLoginConfig = function () {
                clientLogger.trace('LoginDataAccessService.getLoginConfig');
                return $http.get('api/login/config');
            };
        });
})();
