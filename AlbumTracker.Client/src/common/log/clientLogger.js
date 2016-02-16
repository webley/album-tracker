(function () {
    'use strict';
    angular.module('psteam.client.logger', [])
        .provider('clientLogger', function clientLoggerProvider() {
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

            function logToConsoleByLevel(level, msg) {
                if (level <= 1000) { // trace
                    console.trace(msg);
                } else if (level <= 2000) { // debug
                    console.debug(msg);
                } else if (level <= 3000) { // log
                    console.log(msg);
                } else if (level <= 4000) { // info
                    console.info(msg);
                } else if (level <= 5000) { // warn
                    console.warn(msg);
                } else if (level <= 6000) { // error
                    console.error(msg);
                } else { // fatal
                    console.error(msg);
                }
            }

            function logToConsole(level, args) {

                if (!provider.console.enabled) {
                    return;
                }
                if (level < provider.console.level) {
                    return;
                }

                var msg = args.messages.length > 1 ? s.sprintf.apply(null, args.messages) : args.messages[0];
                if (msg && args.objects.length == 0 && args.exceptions.length == 0) {
                    logToConsoleByLevel(level, msg);
                }
                if (args.objects.length > 0) {
                    console.groupCollapsed(msg ? msg : 'Objects:');
                    _.forEach(args.objects, function (obj) {

                        logToConsoleByLevel(level, obj);


                    });
                    console.groupEnd();
                }
                if (args.exceptions.length > 0) {
                    console.groupCollapsed(msg ? msg : 'Exceptions:');
                    _.forEach(args.exceptions, function (ex) {
                        if (ex.stack) {
                            console.groupCollapsed(ex.header);
                            logToConsoleByLevel(level, ex.stack);
                            console.groupEnd();
                        } else {
                            logToConsoleByLevel(level, ex.header);
                        }
                    });
                    console.groupEnd();
                }

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

            provider.logMessage = function (level, args) {
                if (!this.console.enabled) {
                    return;
                }
                var argsArray = [].slice.apply(args);
                var parsedArgs = parseArguments(argsArray);
                logToConsole(level, parsedArgs);

            }.bind(this);


            /**
             * Log message with trace level: 1000
             */
            provider.trace = function () {
                provider.logMessage(1000, arguments);
            };

            /**
             * Log message with debug level: 2000
             */
            provider.debug = function () {
                provider.logMessage(2000, arguments);
            };

            /**
             * Log message with default(log) level: 3000
             */
            provider.log = function () {
                provider.logMessage(3000, arguments);
            };

            /**
             * Log message with info level: 4000
             */
            provider.info = function () {
                provider.logMessage(4000, arguments);
            };

            /**
             * Log message with warning level: 5000
             */
            provider.warn = function () {
                provider.logMessage(5000, arguments);
            };

            /**
             * Log message with error level: 6000
             */
            provider.error = function () {
                provider.logMessage(6000, arguments);
            };

            /**
             * Log message with fatal error level: 7000
             */
            provider.fatal = function () {
                provider.logMessage(7000, arguments);
            };

            provider.$get = function () {
                return {
                    debug: provider.debug,
                    trace: provider.trace,
                    log: provider.log,
                    info: provider.info,
                    warn: provider.warn,
                    error: provider.error,
                    fatal: provider.fatal
                };
            };
        })
        .config(function configLogger(clientLoggerProvider) {

        });
})();

