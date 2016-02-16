(function () {
    'use strict';
    angular.module('psteam.common.services.contextbar', [])
        .service('ContextBarService', function () {
            var element;
            this.getContextBar = function () {
                return element;
            };

            this.setContextBar = function (el) {
                element = el;
            };
        });
})();
