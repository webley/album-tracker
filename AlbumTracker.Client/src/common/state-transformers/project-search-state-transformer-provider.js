(function () {
    'use strict';
    angular.module('psteam.common.stateTransformers.projectSearchStateTransformer', [])
        .provider('ProjectSearchStateTransformer', function () {

            var that = this;

            var resolves = /* @ngInject */ {
                childrenQuery: function (taskCode) {
                    return "select from tasks where projectparent='"
                        + taskCode.toString() + "' and status <> 3 and status <> 5";
                },
                childrenSearchResults: function (childrenQuery, page, pageSize, sortField, order, TaskService) {
                    var sort = [{
                        field: sortField,
                        descending: order === 'desc'
                    }];
                    return TaskService
                        .searchTasks(childrenQuery, pageSize, page - 1, sort);
                },
                childrenCount: function (childrenSearchResults) {
                    return childrenSearchResults.totalHits;
                },
                children: function (childrenSearchResults) {
                    return childrenSearchResults.taskSearchResults;
                }
            };

            that.$get = function () {
                return that.transformer;
            };

            that.transformer = /*@ngInject*/ function (state) {
                if (!angular.isObject(state.resolve)) {
                    state.resolve = {};
                }

                angular.extend(state.resolve, resolves);

                return state;

            };
        });
})();
