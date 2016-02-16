(function () {
    'use strict';
    angular.module('psteam.common.services.localStorage', ['psteam.client.logger'])

        .provider('$localStorage', function (clientLoggerProvider) {
            var $log = clientLoggerProvider;
            var localStorage = window && window.localStorage ? window.localStorage : null;
            var uniquePrefix = "psteam" + hashCode(getBaseUrl()) + "_";

            var _this = this;

            function getBaseUrl () {
                var baseTags = document.getElementsByTagName ("base");
                return location.origin + baseTags[0].href;
            }

            function hashCode(string) {
                var hash = 0, i, chr, len;
                if (string.length == 0) {
                    return hash;
                }
                for (i = 0, len = string.length; i < len; i++) {
                    chr = string.charCodeAt(i);
                    hash = ((hash << 5) - hash) + chr;
                    hash |= 0; // Convert to 32bit integer
                }
                return hash;
            }

            //region Public methods

            /**
             * Gets item from localStorage by its key. If there is no such key - return NULL.
             */
            this.getItem = function (key) {
                var value;

                if (localStorage) {
                    try {
                        value = angular.fromJson(localStorage.getItem(uniquePrefix + key));
                    } catch (e) {
                        $log.error("Exception during LocalStorage access!", e);
                    }
                } else {
                    $log.warn("Browser does not support LocalStor" +
                        "age feature! Returning nothing from LocalStorage.");
                }

                return value;
            };

            /**
             * Sets item into localStorage by its key. Item will be rewritten, if there is value with such key already.
             */
            this.setItem = function (key, value) {
                if (localStorage) {
                    try {
                        localStorage.setItem(uniquePrefix + key, angular.toJson(value));
                    } catch (e) {
                        $log.error("Exception during LocalStorage access!", e);
                    }
                } else {
                    $log.warn("Browser does not support LocalStorage feature! Setting nothing into LocalStorage.");
                }
            };

            /**
             * Remove localStorage item by its key.
             */
            this.removeItem = function (key) {
                if (localStorage) {
                    try {
                        localStorage.removeItem(uniquePrefix + key);
                    } catch (e) {
                        $log.error("Exception during LocalStorage access!", e);
                    }
                } else {
                    $log.warn("Browser does not support LocalStorage feature! Removing nothing from LocalStorage.");
                }
            };

            //endregion

            this.$get = function () {
                return {
                    getItem: this.getItem,
                    setItem: this.setItem,
                    removeItem: this.removeItem
                };
            };
        });
})();
