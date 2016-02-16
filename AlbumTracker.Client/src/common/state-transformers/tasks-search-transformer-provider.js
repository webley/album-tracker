(function () {
    'use strict';
    angular.module('psteam.common.stateTransformers.tasksSearchTransformer', [])
        .provider('TasksSearchTransformer', function () {
            var that = this;

            var resolvers = /* @ngInject */ {
                searchResults: function (query, page, pageSize, /*sortField, order,*/ TaskService) {
                    // This is not used further
                    //var sort = [{
                    //    field: sortField,
                    //    descending: order === 'desc'
                    //}];
                    return TaskService
                        .searchTasks(query, pageSize, page - 1/*, sort*/);
                },
                totalHits: function (searchResults) {
                    return searchResults.totalHits;
                },
                data: function (searchResults) {
                    return searchResults.taskSearchResults;
                }
            };

            that.transformer = function (searchQuery) {
                return /*@ngInject*/ function (state) {
                    angular.extend(state.resolve, {
                        query: searchQuery
                    }, resolvers);
                    return state;
                };
            };

            that.$get = function () {
                return that.transformer;
            };
        });


})();
