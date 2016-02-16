(function () {
    'use strict';
    angular.module('psteam.common.services.progressbar', [])
        .service('ProgressBarService', function () {
            var state = false;

            this.getProgressBarState = function () {
                return state;
            };

            this.setProgressBarState = function (value) {
                state = value;
            };
        });
})();
