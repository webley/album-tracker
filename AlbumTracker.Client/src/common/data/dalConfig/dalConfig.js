(function () {
    'use strict';
    angular.module('psteam.common.data.dalConfig',
        [
            'psteam.common.data.dalConfig.dalTranlatorDecorator',
            'psteam.common.data.dalConfig.dalLoggerDecorator'
        ])
        .config(function (dalProvider) {
            dalProvider.rest.config = _.extend(dalProvider.rest.config, {
                baseUrl: 'api'
            });
        });
})();
