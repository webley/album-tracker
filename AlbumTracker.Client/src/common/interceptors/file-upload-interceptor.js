/*global angular:true, browser:true */

/**
 * @license HTTP Auth Interceptor Module for AngularJS
 * (c) 2012 Witold Szczerba
 * License: MIT
 */
(function () {
    'use strict';

    angular.module('file-upload-interceptor', [])
        .factory('fileUploadInterceptor',
        function ($log) {
            $log.debug('$log is here to show you that this is a regular factory with injection');

            var requestInterceptor = {
                request: function (config) {
                    config.headers['__setXHR_'] = function () {
                        if (angular.isFunction(config.progressCallback)) {

                            return function (xhr) {
                                if (!xhr) {
                                    return;
                                }
                                xhr.upload.addEventListener('progress', config.progressCallback, false);
                            };
                        }
                    };
                    return config;
                }
            };
            return requestInterceptor;
        }
    )
        .config(function ($httpProvider) {
            $httpProvider.interceptors.push('fileUploadInterceptor');

        }
    );
})();
