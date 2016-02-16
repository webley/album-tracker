/* global angular */
(function () {
    'use strict';

    function createGuid() {
        var d = new Date().getTime();
        var uuid =
            'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
                /[xy]/g,
                function (c) {
                    var r = (d + Math.random() * 16) % 16 | 0;
                    d = Math.floor(d / 16);

                    return (c === 'x' ? r : (r & 0x3 | 0x8))
                        .toString(16);
                });
        return uuid;
    }

    angular.module('psteam.common.services.correlation', ['ngCookies'])

        .factory('CorrelationService', function ($cookies, clientLogger) {
            clientLogger.trace('CorrelationService');
            var instanceCorrelationId = createGuid();
            $cookies.put('instance-correlation-id', instanceCorrelationId);

            var aplicationName = 'psteam-client';
            $cookies.put('application-name', aplicationName);

            return {
                getInstanceCorrelationId: function () {
                    clientLogger.trace('CorrelationService:getInstanceCorrelationId');
                    return instanceCorrelationId;
                },
                generateRequestCorrelationId: function () {
                    clientLogger.trace('CorrelationService:generateRequestCorrelationId');
                    var guid = createGuid();
                    $cookies.put('request-correlation-id', guid);
                    return guid;
                },
                getApplicationName: function () {
                    clientLogger.trace('CorrelationService:getApplicationName');
                    return aplicationName;
                }
            };
        }
    );
})();
