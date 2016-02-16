(function () {
    'use strict';
    angular.module('psteam.common.data.models.taskStatisticModel', ['dal'])

        .config(function (dalProvider) {
            dalProvider.defineModel('TaskStatisticModel',
                {
                    fields: {
                        topicName: {
                            type: dalProvider.fieldTypes.STRING
                        },
                        topicCode: {
                            type: dalProvider.fieldTypes.STRING
                        },

                        open: {
                            type: dalProvider.fieldTypes.INTEGER
                        },
                        unscheduled: {
                            type: dalProvider.fieldTypes.INTEGER
                        },
                        workInProgress: {
                            type: dalProvider.fieldTypes.INTEGER
                        },
                        scheduled: {
                            type: dalProvider.fieldTypes.INTEGER
                        },
                        completed: {
                            type: dalProvider.fieldTypes.INTEGER
                        },
                        review: {
                            type: dalProvider.fieldTypes.INTEGER
                        },
                        overdue: {
                            type: dalProvider.fieldTypes.INTEGER
                        }
                    }
                }
            );
        });

})();
