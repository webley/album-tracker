(function () {
    'use strict';
    angular.module('psteam.common.stateTransformers.pageStateTransformer', [])
        .provider('PageStateTransformer', function () {

            var that = this;

            var url = 'page&pageSize';
            var resolves = /* @ngInject */ {
                pageSize: function ($stateParams) {
                    return parseInt($stateParams.pageSize, 10);
                },
                page: function ($stateParams) {
                    return parseInt($stateParams.page, 10);
                }
            };

            var params = {
                page: {
                    squash: true,
                    value: '1'
                },
                pageSize: {
                    squash: true,
                    value: '10'
                }
            };

            that.transformer = /* @ngInject */ function (state) {
                if (!angular.isString(state.url)) {
                    state.url = '';
                }
                if (!angular.isObject(state.resolve)) {
                    state.resolve = {};
                }
                if (!angular.isObject(state.params)) {
                    state.params = {};
                }

                if (state.url.indexOf('?') > 1) {
                    state.url += '&' + url;
                } else {
                    state.url += '?' + url;
                }

                angular.extend(state.resolve, resolves);

                angular.extend(state.params, params);

                return state;

            };

            that.$get = function () {
                return that.transformer;
            };

        });


})();
