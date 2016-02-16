(function () {
    angular.module('psteam.common.services.notification', [])
        .service('notificationService', function($state, $q, LoginService, CorrelationService, toastService, gettextCatalog) {
                var hubId = 0;
                var currentHubs = null;
                var connectionPromise;
                var errorOccured = false;

                $.connection.hub.error(function (error) {
                    //avoid showing too many errors.
                    if (!errorOccured) {
                        toastService.warning(gettextCatalog.getString('Disconnected from the notification server.'));
                    }
                    errorOccured = true;
                    if (currentHubs != null) {
                        connectionPromise = startSignalRConnection(currentHubs);
                        connectionPromise.then(function () {
                            toastService.success(gettextCatalog.getString('Reconnected to the notification server.'));
                            errorOccured = false;
                        });
                    }
                });

                $.connection.hub.disconnected(function () {
                    if (currentHubs !== null) {
                        startSignalRConnection(currentHubs);
                    }
                });

                function startSignalRConnection(hubs) {
                    var conn = $.connection;
                    var connectionHub = conn.connectionHub;

                    connectionHub.client.authenticated = function(authenticated) {
                        if (!authenticated) {
                            LoginService.invalidateLogin();
                            $state.reload();
                        }
                    };
                    for (var i = 0; i < hubs.definitions.length; i++) {
                        var definition = hubs.definitions[i];
                        var listeners = definition.listeners;
                        if (listeners) {
                            var proxy = conn[definition.name];
                            angular.forEach(listeners, function(fn, event) {
                                proxy.on(event, fn);
                            });
                        }
                    }

                    var hubConn = conn.hub;
                    hubConn.qs = {
                        'jwt': LoginService.getToken().jwt,
                        'application-name': CorrelationService.getApplicationName(),
                        'instance-correlation-id': CorrelationService.getInstanceCorrelationId(),
                        'request-correlation-id': CorrelationService.generateRequestCorrelationId()
                    };

                    var deferred = $q.defer();
                    hubConn.start()
                        .done(function() {
                            currentHubs = hubs;
                            if (currentHubs.definitions.onConnected) {
                                currentHubs.definitions.onConnected();
                            }
                            deferred.resolve();
                        })
                        .fail(function() {
                            currentHubs = null;
                            deferred.reject();
                        });

                    return deferred.promise;
                }

                function startConnection(hubs) {
                    if (angular.isUndefined(hubs) || hubs === null)
                        throw 'Cannot connect to null hubs';

                    if (currentHubs == null) {
                        connectionPromise = startSignalRConnection(hubs);
                    } else if (currentHubs.id !== hubs.id) {
                        stopConnection(currentHubs);
                        connectionPromise = startSignalRConnection(hubs);
                    }
                    return connectionPromise;
                }

                function stopConnection(hubs) {
                    if (angular.isUndefined(hubs) || hubs === null)
                        throw 'Cannot disconnect null hubs';
                    if (currentHubs.id === hubs.id) {
                        currentHubs = null;
                        $.connection.hub.stop();
                        if (hubs.definitions.onDisconnected) {
                            hubs.definitions.onDisconnected();
                        }
                    }
                }

                return {
                    connect: function (hubDefinitions) {
                        if (!(hubDefinitions instanceof Array) || hubDefinitions.length === 0)
                            throw 'Cannot connect to 0 notfication hubs';

                        var hubs = {
                            id: hubId++,
                            definitions: hubDefinitions,
                            disconnect: function() {
                                stopConnection(this);
                            }
                        };

                        var deferred = $q.defer();
                        startConnection(hubs).then(function () {
                            deferred.resolve(hubs);
                        },function() {
                            deferred.reject();
                        });

                        return deferred.promise;
                    }
                };
            }
        );
}());
