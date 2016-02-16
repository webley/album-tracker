/* global angular */
(function () {
    'use strict';
    angular.module('psteam.common.interceptors.correlation', [
        'psteam.common.services.correlation'
    ])

        .config([
            '$httpProvider', function ($httpProvider) {
                $httpProvider.interceptors.push(
                    function (CorrelationService) {
                        return {
                            request: function (config) {
                                angular.extend(config.headers, {
                                    'application-name': CorrelationService
                                        .getApplicationName(),
                                    'instance-correlation-id': CorrelationService
                                        .getInstanceCorrelationId(),
                                    'request-correlation-id': CorrelationService
                                        .generateRequestCorrelationId()
                                });
                                return config;
                            }
                        };
                    }
                );
            }
        ]);
})();
