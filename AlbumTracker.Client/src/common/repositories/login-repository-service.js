(function () {
    'use strict';
    angular.module('psteam.common.repositories.login', [
        'psteam.common.data-access.login',
        'psteam.common.services.localStorage'
    ])
        .service('LoginRepositoryService', function ($q,
                                                     $localStorage,
                                                     $cookies,
                                                     LoginDataAccessService,
                                                     clientLogger
                                                     /* We don't use server loggger until authenticated*/) {
            clientLogger.trace('LoginRepositoryService');
            var getConfigPromise = undefined;

            function createOnLoginHandler(deferred) {
                clientLogger.trace('LoginRepositoryService.createOnLoginHandler', deferred);
                var onLogin = function (response) {
                    clientLogger.trace('LoginRepositoryService.createOnLoginHandler:onLogin', response);
                    var headers = response.headers();
                    var jwt = headers.authorization;
                    if (angular.isDefined(jwt) && jwt) {
                        deferred.resolve(jwt);
                    } else {
                        deferred.resolve(undefined);
                    }
                };

                return onLogin;
            }

            function createOnLoginErrorHandler(deferred) {
                clientLogger.trace('LoginRepositoryService.createOnLoginErrorHandler', deferred);
                var onLoginError = function (error) {
                    clientLogger.error('LoginRepositoryService.createOnLoginErrorHandler:onLoginError', error);
                    deferred.resolve(undefined);
                };
                return onLoginError;
            }

            var cachedJwt = undefined;
            var cachedJwtExpiry = undefined;
            var cachedAuthType = undefined;
            var cachedUsername = undefined;

            Object.defineProperty(this, 'jwt', {
                enumerable: true,
                get: function () {
                    clientLogger.trace("LoginRepositoryService.jwt.get", jwt);
                    if (angular.isUndefined(cachedJwt)) {
                        var jwt = $localStorage.getItem('jwt');
                        if (angular.isDefined(jwt)) {
                            $cookies.put('Authorization', jwt);
                        } else {
                            $cookies.remove('Authorization');
                        }
                        cachedJwt = jwt;
                    }
                    return cachedJwt;
                },
                set: function (jwt) {
                    clientLogger.trace("LoginRepositoryService.jwt.set");
                    if (angular.isDefined(jwt)) {
                        $cookies.put('Authorization', jwt);
                        $localStorage.setItem('jwt', jwt);
                    } else {
                        $cookies.remove('Authorization');
                        $localStorage.removeItem('jwt');
                    }
                    cachedJwt = jwt;
                }
            });


            Object.defineProperty(this, 'jwtExpiry', {
                enumerable: true,
                get: function () {
                    clientLogger.trace("LoginRepositoryService.jwtExpiry.get");
                    if (angular.isUndefined(cachedJwtExpiry)) {
                        var expiryJson = $localStorage.getItem('jwtExpiry');
                        if (angular.isUndefined(expiryJson) || !expiryJson) {
                            cachedJwtExpiry = undefined;
                        } else {
                            var localExpiry = new Date(angular.fromJson(expiryJson));
                            cachedJwtExpiry = localExpiry;
                        }
                    }
                    return cachedJwtExpiry;
                },
                set: function (jwtExpiry) {
                    clientLogger.trace("LoginRepositoryService.jwtExpiry.set()", typeof (jwtExpiry) != 'undefined'
                        ? jwtExpiry
                        : undefined);
                    if (angular.isDefined(jwtExpiry)) {
                        $localStorage.setItem('jwtExpiry', angular.toJson(jwtExpiry));
                    } else {
                        $localStorage.removeItem('jwtExpiry');
                    }
                    cachedJwtExpiry = jwtExpiry;
                }
            });

            Object.defineProperty(this, 'username', {
                enumerable: true,
                get: function () {
                    clientLogger.trace("LoginRepositoryService.username.get");
                    if (angular.isUndefined(cachedUsername)) {
                        cachedUsername = $localStorage.getItem('username');
                    }
                    return cachedUsername;
                },
                set: function (username) {
                    clientLogger.trace("LoginRepositoryService.username.set(value = '%s')", typeof (username) != 'undefined'
                        ? username
                        : 'undefined');
                    if (angular.isDefined(username)) {
                        cachedUsername = username;
                        $localStorage.setItem('username', username);
                    } else {
                        cachedUsername = undefined;
                        $localStorage.removeItem('username');
                    }
                }
            });

            Object.defineProperty(this, 'authType', {
                enumerable: true,
                get: function () {
                    clientLogger.trace("LoginRepositoryService.authType.get");
                    if (angular.isUndefined(cachedAuthType)) {
                        cachedAuthType = $localStorage.getItem('authType');
                    }
                    return cachedAuthType;
                },
                set: function (type) {
                    clientLogger.trace("LoginRepositoryService.authType.set(value = '%s')", typeof(type) != 'undefined'
                        ? type
                        : 'undefined');
                    if (angular.isDefined(type)) {
                        cachedAuthType = type;
                        $localStorage.setItem('authType', type);
                    } else {
                        cachedAuthType = undefined;
                        $localStorage.removeItem('authType');
                    }
                }
            });


            this.getLoginConfig = function () {
                clientLogger.trace("LoginRepositoryService.getLoginConfig");
                if (angular.isUndefined(getConfigPromise)) {
                    getConfigPromise = LoginDataAccessService.getLoginConfig().then(function (response) {
                        clientLogger.trace("LoginRepositoryService.getLoginConfig:LoginDataAccessService.getLoginConfig.then", response);
                        return response.data;
                    });
                }
                return getConfigPromise;
            };

            this.windowsLogin = function () {
                clientLogger.trace("LoginRepositoryService.windowsLogin");
                var deferred = $q.defer();
                LoginDataAccessService.windowsLogin()
                    .then(createOnLoginHandler(deferred),
                    createOnLoginErrorHandler(deferred));
                return deferred.promise;
            };

            this.certificateLogin = function () {
                clientLogger.trace("LoginRepositoryService.certificateLogin");
                var deferred = $q.defer();
                LoginDataAccessService.certificateLogin()
                    .then(createOnLoginHandler(deferred),
                    createOnLoginErrorHandler(deferred));

                return deferred.promise;
            };

            this.login = function (userName, password) {
                clientLogger.trace("LoginRepositoryService.login(userName = '%s', password = '%s')", userName, '...');
                var deferred = $q.defer();
                LoginDataAccessService.login(userName, password)
                    .then(createOnLoginHandler(deferred),
                    createOnLoginErrorHandler(deferred));
                return deferred.promise;
            };
        }
    );
})();
