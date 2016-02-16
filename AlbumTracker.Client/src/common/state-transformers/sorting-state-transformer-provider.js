(function () {
    'use strict';
    angular.module('psteam.common.stateTransformers.sortingStateTransformer', [])
        .provider('SortingStateTransformer', function () {

            var that = this;

            var url = 'sortField&order';
            var resolves = /* @ngInject */ {
                userSettings: function (UserService) {
                    return UserService.getSettings();
                },
                sortField: function ($stateParams) {
                    return $stateParams.sortField;
                },
                order: function ($stateParams) {
                    return $stateParams.order;
                },
                sorting: function (sortField, order, userSettings) {

                    if (userSettings.settings.sortingPreferences !== undefined && userSettings.settings.sortingPreferences.rememberSortingEnabled &&
                        userSettings.settings.sortingPreferences.settings[this.name + '.field'] !== undefined &&
                        userSettings.settings.sortingPreferences.settings[this.name + '.order'] !== undefined) {

                        sortField = userSettings.settings.sortingPreferences.settings[this.name + '.field'];
                        order = userSettings.settings.sortingPreferences.settings[this.name + '.order'];
                    }

                    return {
                        field: sortField,
                        order: order
                    };
                }
            };

            var params = {
                sortField: {
                    squash: true,
                    value: 'updatedDate'
                },
                order: {
                    squash: true,
                    value: 'desc'
                }
            };

            that.$get = function () {
                return that.transformer;
            };

            that.transformer = /*@ngInject*/ function (state) {

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
        });
})();
