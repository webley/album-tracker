(function () {
    'use strict';
    angular.module('psteam.logger', ['psteam.client.logger'])
        .provider('logger', function loggerProvider(clientLoggerProvider) {
            var provider = this;
            var logStorage = [];
            // In the provider function, you cannot inject any  service or factory. This can only be done at the "$get" method.
            var map = {
                'trace': 1000,
                'debug': 2000,
                'log': 3000,
                'info': 4000,
                'warn': 5000,
                'error': 6000,
                'fatal': 7000

            };
            var reverseMap = {
                '1000': 'trace',
                '2000': 'debug',
                '3000': 'log',
                '4000': 'info',
                '5000': 'warn',
                '6000': 'error',
                '7000': 'fatal'

            };
            this.console = {
                'level': ('logger' in config && 'console' in config['logger'] && 'level' in config['logger']['console'] && config['logger']['console']['level'] in map)
                    ? map[config['logger']['console']['level']]
                    : 6000,
                'enabled': ('logger' in config && 'console' in config['logger'] && 'enabled' in config['logger']['console'])
                    ? config['logger']['console']['enabled']
                    : true
            };
            this.server = {
                'level': ('logger' in config && 'server' in config['logger'] && 'level' in config['logger']['server'] && config['logger']['server']['level'] in map)
                    ? map[config['logger']['server']['level']]
                    : 6000,
                'flushLevel': ('logger' in config && 'server' in config['logger'] && 'flushLevel' in config['logger']['server'] && config['logger']['server']['flushLevel'] in map)
                    ? map[config['logger']['server']['flushLevel']]
                    : 6000,
                'buffer': ('logger' in config && 'server' in config['logger'] && 'buffer' in config['logger']['server'])
                    ? config['logger']['server']['buffer']
                    : 50,
                'enabled': ('logger' in config && 'server' in config['logger'] && 'enabled' in config['logger']['server'])
                    ? config['logger']['server']['enabled']
                    : true,
                'url': ('logger' in config && 'server' in config['logger'] && 'url' in config['logger']['server'])
                    ? config['logger']['server']['url']
                    : 'api/log'
            };

            if (this.server.url.charAt(0) != '/' && this.server.url.indexOf('http:') != 0 && this.server.url.indexOf('www') != 0) {
                this.server.url = window.location.pathname + this.server.url;
            }

            function parseArguments(args) {
                var messages = [];
                var exceptions = [];
                var objects = [];

                function parseException(e) {
                    var result = {};
                    var name = e.name;
                    name = !name ? 'Error' : String(name);
                    var msg = e.message || e.description;
                    msg = !msg ? '' : String(msg);
                    result.header = name + (msg ? (': ' + msg) : '');
                    if (e.stack) {
                        result.stack = e.stack.toString();
                    }
                    return result;
                }

                for (var i = 0; i < args.length; i++) {
                    var arg = args[i];
                    if (arg) {
                        if (typeof(arg) == 'object' && 'stack' in arg && 'message' in arg && 'arg' in arg) { // if error
                            exceptions.push(parseException(arg));
                        } else if (typeof(arg) == 'object') {
                            objects.push(arg);
                        }
                        else {
                            messages.push(arg);
                        }
                    }
                }

                return {
                    messages: messages,
                    exceptions: exceptions,
                    objects: objects
                };
            }

            function sendLogToServer() {
                var toSend = _.clone(logStorage);
                logStorage = [];
                var initInjector = angular.injector(['ng']);
                var $http = initInjector.get('$http');


                try {
                    try {
                        $http.post(provider.server.url, angular.toJson({logs: toSend}))
                            .then(
                            function (resp) {
                                console.groupCollapsed("We sent logs to the server.");
                                console.dir(toSend);
                                console.groupEnd();

                            }, function (resp) {
                                handleError(resp);
                            });
                    } catch (ex) {
                        handleError(ex);
                    }
                } catch (e) {
                    try {
                        $.post(provider.server.url, angular.toJson({logs: toSend}), null, "json")
                            .then(
                            function (resp) {
                                console.groupCollapsed("We sent logs to the server.");
                                console.dir(toSend);
                                console.groupEnd();

                            }, function (resp) {
                                handleError(resp);
                            });
                    } catch (e) {
                        handleError(ex);
                    }
                }

                function handleError(e) {
                    console.groupCollapsed("We were unable to send logs to the server.");
                    console.dir(e);
                    console.groupEnd();
                }
            }

            function logToServer(level, args) {
                if (!provider.server.enabled) {
                    return;
                }

                if (level >= provider.server.level) {
                    var msg = args.messages.length > 1 ? s.sprintf.apply(console, args.messages) : args.messages[0];
                    _.forEach(args.exceptions, function (ex) {
                        if (ex.header) {
                            msg += "\r\n" + ex.header;
                        }
                        if (ex.stack) {
                            msg += "\r\n" + ex.stack;
                        }
                    });
                    _.forEach(args.objects, function (obj) {
                        msg += "\r\n" + angular.toJson(obj);
                    });
                    var now = new Date();
                    logStorage.push({
                        date: now,
                        timeZoneOffset: now.getTimezoneOffset(),
                        level: level,
                        message: msg
                    });
                    if (logStorage.length > provider.server.buffer) {
                        logStorage.shift();
                    }
                }

                if (level >= provider.server.flushLevel) {
                    sendLogToServer();
                }
            }

            function logMessage(level, args) {
                if (!provider.console.enabled && !provider.server.enabled
                    || level < provider.console.level && level < provider.server.level) {
                    return;
                }

                clientLoggerProvider.logMessage(level, args);
                var argsArray = [].slice.apply(args);
                var parsedArgs = parseArguments(argsArray);
                if (provider.currentUser) {
                    logToServer(level, parsedArgs);
                }
            }


            /**
             * Log message with trace level: 1000
             */
            provider.trace = function () {
                logMessage(1000, arguments);
            };

            /**
             * Log message with debug level: 2000
             */
            provider.debug = function () {
                logMessage(2000, arguments);
            };

            /**
             * Log message with default(log) level: 3000
             */
            provider.log = function () {
                logMessage(3000, arguments);
            };

            /**
             * Log message with info level: 4000
             */
            provider.info = function () {
                logMessage(4000, arguments);
            };

            /**
             * Log message with warning level: 5000
             */
            provider.warn = function () {
                logMessage(5000, arguments);
            };

            /**
             * Log message with error level: 6000
             */
            provider.error = function () {
                logMessage(6000, arguments);
            };

            /**
             * Log message with fatal error level: 7000
             */
            provider.fatal = function () {
                logMessage(7000, arguments);
            };

            this.$get = function () {
                var logger = {
                    debug: provider.debug,
                    trace: provider.trace,
                    log: provider.log,
                    info: provider.info,
                    warn: provider.warn,
                    error: provider.error,
                    fatal: provider.fatal
                };
                Object.defineProperty(logger, 'currentUser', {
                    enumerable: true,
                    configurable: false,
                    get: function () {
                        return provider.currentUser;

                    },
                    set: function (newValue) {
                        provider.currentUser = newValue;
                    }
                });
                return logger;

            };
        })
        .config(function configLogger(loggerProvider) {

        });
})();

