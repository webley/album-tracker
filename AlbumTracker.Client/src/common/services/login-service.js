(function () {
    'use strict';
    angular.module('psteam.common.services.login', [
        'psteam.common.i18n.timezone',
        'psteam.common.i18n.translations',
        'psteam.common.repositories.login',
        'psteam.common.services.user'
    ])

        .service('LoginService', function ($window,
                                           $q,
                                           timezoneService,
                                           translationService,
                                           UserService,
                                           LoginRepositoryService,
                                           clientLogger /* We don't use server loggger until authenticated*/,
                                           logger) {
            clientLogger.trace("LoginService");
            var that = this;

            var cachedToken = undefined;

            var initialisePromise = undefined;

            this.authenticationTypes = {
                forms: 'forms',
                windows: 'windows',
                certificate: 'cert'
            };

            this.currentUser = {
                login: undefined,
                name: undefined
            };

            this.configuration = {
                WindowsAuthentication: false,
                FormsAuthentication: false,
                CertificateAuthentication: false
            };

            //region Private functions

            /**
             * Get object encoded inside JWT token
             * @param {string} jwt
             * @returns {{exp:string, iat:string, iss:string, jti:string, sub:string, user:{fullName:string}}}
             */
            function getJwtPayload(jwt) {
                clientLogger.trace("LoginService:getJwtPayload(jwt = '...')");
                if (angular.isUndefined(jwt)) {
                    return undefined;
                }
                var b64 = jwt.split('.')[1];
                b64 = b64.replace(/-/g, '+');
                b64 = b64.replace(/_/g, '/');
                // `escape` function is deprecated but necessary
                // and can't be replaced by encodeURIComponent because of UTF-8 characters issue
                return angular.fromJson(decodeURIComponent(escape(window.atob(b64))));
            }

            function loadUserSettings() {
                clientLogger.trace("LoginService:loadUserSettings");
                return UserService.getSettings().then(function (settings) {
                    timezoneService.setTimezone(settings.timezoneId);
                    translationService.setLanguage(settings.language);
                });
            }

            function storeToken(newToken) {
                clientLogger.trace("LoginService:storeToken(newToken = ...)");
                if (angular.isDefined(newToken)) {
                    LoginRepositoryService.jwt = newToken.jwt;
                    LoginRepositoryService.jwtExpiry = newToken.localExpiry;
                    that.currentUser.login = newToken.sub;
                    logger.currentUser = that.currentUser.login;
                    that.currentUser.name = newToken.user.fullName;
                    cachedToken = newToken;
                    loadUserSettings();
                } else {
                    LoginRepositoryService.jwt = undefined;
                    LoginRepositoryService.jwtExpiry = undefined;
                    that.currentUser.login = undefined;
                    logger.currentUser = undefined;
                    that.currentUser.name = undefined;
                    cachedToken = undefined;
                }
            }

            function loadToken() {
                clientLogger.trace("LoginService:loadToken");
                if (angular.isDefined(cachedToken)) {
                    return cachedToken;
                }
                var jwt = LoginRepositoryService.jwt;
                if (angular.isUndefined(jwt) || !jwt) {
                    that.token = undefined;
                    return undefined;
                }
                var token = getJwtPayload(jwt);
                var localExpiry = LoginRepositoryService.jwtExpiry;
                if (angular.isUndefined(localExpiry) || localExpiry <= new Date()) {
                    storeToken(undefined);
                    return undefined;
                }

                loadUserSettings();
                token.localExpiry = localExpiry;
                token.jwt = jwt;
                that.currentUser.login = token.sub;
                logger.currentUser = that.currentUser.login;
                that.currentUser.name = token.user.fullName;
                cachedToken = token;
                return token;
            }

            function getTokenFromJwt(jwt) {
                clientLogger.trace("LoginService:getTokenFromJwt");
                if (angular.isUndefined(jwt)) {
                    return undefined;
                }

                var token = getJwtPayload(jwt);
                var serverIssueTime = new Date(token.iat);
                var serverExpiryTime = new Date(token.exp);
                var timeDiff = new Date().getTime() - serverIssueTime.getTime();
                token.localExpiry = new Date(serverExpiryTime.getTime() + timeDiff);
                token.jwt = jwt;
                return token;
            }

            function createOnLoginHandler(remember, authType) {
                clientLogger.trace("LoginService:createOnLoginHandler",
                    {
                        'remember': remember,
                        'authType': authType
                    });
                return function (jwt) {
                    clientLogger.trace("LoginService:onLogin");
                    if (angular.isUndefined(jwt)) {
                        return false;
                    }
                    var token = getTokenFromJwt(jwt);

                    storeToken(token);
                    if (remember === true) {
                        LoginRepositoryService.authType = authType;
                        if (authType === that.authenticationTypes.forms) {
                            LoginRepositoryService.username = token.sub;
                        }
                    }
                    return true;
                };
            }

            function initialise() {
                clientLogger.trace("LoginService:initialise");
                if (angular.isUndefined(initialisePromise)) {
                    initialisePromise = LoginRepositoryService.getLoginConfig().then(function (config) {
                        that.configuration = config;
                        loadToken();
                    });
                }
                return initialisePromise;
            }

            function onLoginError(err) {
                clientLogger.error("LoginService:onLoginError", err);
                that.logout();
                throw err;
            }

            function isTokenValid() {
                return angular.isDefined(cachedToken) && cachedToken.localExpiry > new Date();
            }

            //endregion

            //region Public functions

            this.getAuthenticationType = function () {
                clientLogger.trace("LoginService.getAuthenticationType");
                var type = LoginRepositoryService.authType;
                var config = that.configuration;
                var authenticationTypes = that.authenticationTypes;
                if (angular.isUndefined(type)) {
                    return undefined;
                } else if (type === authenticationTypes.windows && config.WindowsAuthentication) {
                    return type;
                } else if (type === authenticationTypes.forms && config.FormsAuthentication) {
                    return type;
                } else if (type === authenticationTypes.certificate && config.CertificateAuthentication) {
                    return type;
                } else if (config.FormsAuthentication) {
                    return authenticationTypes.forms;
                } else {
                    return undefined;
                }
            };

            this.getUsername = function () {
                clientLogger.trace("LoginService.getUsername");
                return LoginRepositoryService.username;
            };

            this.authenticated = function () {
                clientLogger.trace("LoginService.authenticated");
                return isTokenValid();
            };

            this.authenticate = function () {
                clientLogger.trace("LoginService.authenticate");
                var deferred = $q.defer();

                var resolveLogin = function () {
                    clientLogger.trace("LoginService.authenticate:resolveLogin");
                    deferred.resolve(isTokenValid());
                };
                var reject = function () {
                    clientLogger.trace("LoginService.authenticate:reject");
                    deferred.resolve(false);
                };

                initialise().then(function () {
                    clientLogger.trace("LoginService.authenticate:initialise().then.success");
                    if (isTokenValid()) {
                        deferred.resolve(true);
                    } else {

                        var windowsOnly = that.configuration.WindowsAuthentication && !that.configuration.FormsAuthentication && !that.configuration.CertificateAuthentication;

                        var certificateOnly = that.configuration.CertificateAuthentication && !that.configuration.FormsAuthentication && !that.configuration.WindowsAuthentication;

                        var authType = LoginRepositoryService.authType;

                        var authTypes = that.authenticationTypes;

                        var authTypeSaved = angular.isDefined(authType) && authType !== null;

                        if ((authTypeSaved && authType === authTypes.windows) || windowsOnly === true) {
                            that.windowsLogin(true).then(resolveLogin, reject);
                        } else if ((authTypeSaved && authType === authTypes.certificate) || certificateOnly === true) {
                            that.certificateLogin(true).then(resolveLogin, reject);
                        } else {
                            that.logout();
                            deferred.resolve(false);
                        }
                    }
                }, reject);

                return deferred.promise;
            };

            this.getToken = function () {
                clientLogger.trace("LoginService.getToken");
                return loadToken();
            };

            this.invalidateLogin = function () {
                clientLogger.trace("LoginService.invalidateLogin");
                storeToken(undefined);
            };

            this.logout = function () {
                clientLogger.trace("LoginService.logout");
                that.invalidateLogin();
                LoginRepositoryService.authType = undefined;
            };

            this.windowsLogin = function (remember) {
                clientLogger.trace("LoginService.windowsLogin", {
                    'remember': remember
                });
                that.invalidateLogin();
                return LoginRepositoryService
                    .windowsLogin()
                    .then(createOnLoginHandler(remember, that.authenticationTypes.windows), onLoginError);
            };

            this.certificateLogin = function (remember) {
                clientLogger.trace("LoginService.certificateLogin", {
                    'remember': remember
                });
                that.invalidateLogin();
                return LoginRepositoryService
                    .certificateLogin()
                    .then(createOnLoginHandler(remember, that.authenticationTypes.certificate), onLoginError);
            };

            this.login = function (username, password, remember) {
                clientLogger.trace("LoginService.login", {
                    'username': username,
                    'password': '...',
                    'remember': remember

                });
                that.invalidateLogin();
                return LoginRepositoryService
                    .login(username, password)
                    .then(createOnLoginHandler(remember, that.authenticationTypes.forms), onLoginError);
            };

            //endregion
        });

})();
