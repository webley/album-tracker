(function () {
    'use strict';
    angular.module('psteam.common.stateTransformers.taskStateTransformer', [
        'psteam.common.services.task'
    ]).provider('TaskStateTransformer', function () {

        var that = this;

        var resolves = /* @ngInject */ {
            task: function (taskCode, TaskService) {
                return TaskService.getTask(taskCode.toString());
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
