(function () {
    'use strict';
    angular.module('psteam.common.stateTransformers.taskCodeStateTransformer', [
        'psteam.common.tasks.taskCode'
    ]).provider('TaskCodeStateTransformer', function () {

        var that = this;

        var url = ':topicCode/{id}/';

        var resolves = /* @ngInject */ {
            taskCode: function (TaskCodeFactory, $stateParams) {
                return new TaskCodeFactory($stateParams.topicCode, $stateParams.id);
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

            var queryParamIndex = state.url.indexOf('?');
            if(queryParamIndex > -1){
                state.url =
                    state.url.slice(0, queryParamIndex)
                    + '/'
                    + url
                    + state.url.slice(queryParamIndex);
            }else{
                if (state.url.indexOf('/', state.url.length - 1) !== -1) {
                    state.url += url;
                } else {
                    state.url += '/' + url;
                }
            }


            angular.extend(state.resolve, resolves);

            return state;

        };
    });


})();
