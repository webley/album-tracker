(function () {
    'use strict';
    angular.module('psteam.common.data.models.taskModel', ['dal'])

        .config(function (dalProvider, FieldValidationTemplates) {
            dalProvider.defineModel('TaskModel',
                {
                    extend: 'IdModel',
                    fields: {

                        createdDate: {
                            type: dalProvider.fieldTypes.DATE
                        },
                        updatedDate: {
                            type: dalProvider.fieldTypes.DATE
                        },

                        topicCode: {
                            type: dalProvider.fieldTypes.STRING
                        },
                        taskCode: { // {topicCode: string, taskId: number}
                            type: dalProvider.fieldTypes.OBJECT
                        },

                        title: {
                            type: dalProvider.fieldTypes.STRING
                        },
                        originator: {
                            type: dalProvider.fieldTypes.OBJECT
                        },
                        assignees: { // {type: string, loginName: string, name: string}[]
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },
                        listeners: { // {type: string, loginName: string, name: string}[]
                            type: dalProvider.fieldTypes.ARRAY
                        },

                        priority: {
                            type: dalProvider.fieldTypes.INTEGER
                        },
                        status: {
                            type: dalProvider.fieldTypes.STRING
                        },
                        complete: {
                            type: dalProvider.fieldTypes.FLOAT,
                            validators: [
                                FieldValidationTemplates.floatValidator(),
                                FieldValidationTemplates.isPositiveOrZero()
                            ]
                        },
                        workTime: {
                            type: dalProvider.fieldTypes.INTEGER
                        },
                        actualWorkTime: {
                            type: dalProvider.fieldTypes.INTEGER,
                            defaultValue: 0
                        },
                        baseWorkTime: {
                            type: dalProvider.fieldTypes.INTEGER,
                            defaultValue: 0
                        },
                        cost: {
                            type: dalProvider.fieldTypes.FLOAT,
                            validators: [
                                FieldValidationTemplates.floatValidator(),
                                FieldValidationTemplates.isPositiveOrZero(),
                                [
                                    function (val, fieldDefinition, serviceInjector) {
                                        if (_.isNull(val) || _.isUndefined(val)) {
                                            return true;
                                        }
                                        if (val < this.$model.actualCost) {
                                            return false;
                                        }
                                        return true;
                                    },
                                    gettext('Should be greater than or equal to Actual Cost')
                                ]
                            ],
                            defaultValue: 0
                        },
                        actualCost: {
                            type: dalProvider.fieldTypes.FLOAT,
                            validators: [
                                FieldValidationTemplates.floatValidator(),
                                FieldValidationTemplates.isPositiveOrZero(),
                                [
                                    function (val, fieldDefinition, serviceInjector) {
                                        if (_.isNull(val) || _.isUndefined(val)) {
                                            return true;
                                        }
                                        if (val > this.$model.cost) {
                                            return false;
                                        }
                                        return true;
                                    },
                                    gettext('Should be less than or equal to Total Cost')
                                ]
                            ],
                            defaultValue: 0
                        },
                        baseCost: {
                            type: dalProvider.fieldTypes.FLOAT,
                            validators: [
                                FieldValidationTemplates.floatValidator(),
                                FieldValidationTemplates.isPositiveOrZero()
                            ],
                            defaultValue: 0
                        },
                        rolledUp: {
                            type: dalProvider.fieldTypes.BOOLEAN
                        },

                        startDate: {
                            type: dalProvider.fieldTypes.DATE
                        },
                        baseStartDate: {
                            type: dalProvider.fieldTypes.DATE
                        },
                        dueDate: {
                            type: dalProvider.fieldTypes.DATE
                        },
                        baseDueDate: {
                            type: dalProvider.fieldTypes.DATE
                        },

                        taskType: {
                            type: dalProvider.fieldTypes.STRING
                        },

                        attachedDocumentTasks: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },
                        attachedDocumentFolders: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        associates: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        childTasks: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },
                        childDocuments: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },
                        childSharedDocuments: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },
                        childFolders: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },
                        childSharedFolders: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        parentFolder: {
                            type: dalProvider.fieldTypes.OBJECT // todo check type
                        },
                        parentTasks: {
                            type: dalProvider.fieldTypes.ARRAY
                        },
                        parentShares: {
                            type: dalProvider.fieldTypes.ARRAY
                        },

                        fileAttachments: {
                            type: dalProvider.fieldTypes.ARRAY
                        },
                        fastViewAttachments: {
                            type: dalProvider.fieldTypes.ARRAY
                        }
                    }
                }
            );
        });

})();
