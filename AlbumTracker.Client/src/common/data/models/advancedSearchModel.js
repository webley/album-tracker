(function () {
    'use strict';
    angular.module('psteam.common.data.models.advancedSearchModel', ['dal'])

        .config(function (dalProvider, FieldValidationTemplates) {
            dalProvider.defineModel('AdvancedSearchModel',
                {
                    extend: 'IdModel',
                    fields: {
                        type: {
                            type: dalProvider.fieldTypes.STRING,
                            defaultValue: 'all'
                        },
                        assignees: { // {type: string, loginName: string, name: string}[]
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },
                        contributors: { // {type: string, loginName: string, name: string}[]
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },
                        originators: { // {type: string, loginName: string, name: string}[]
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },
                        status: { // {unscheduled: boolean, scheduled: boolean, wip: boolean, review: boolean, complete: boolean}
                            type: dalProvider.fieldTypes.OBJECT,
                            defaultValue: {
                              unscheduled: true,
                              scheduled: true,
                              wip: true,
                              review: true,
                              complete: false
                            }
                        },
                        text: { // {all: string, any: string, exactPhrase: string, none: string}
                            type: dalProvider.fieldTypes.OBJECT,
                            defaultValue: {}
                        },
                        topics: { // {type: string, code: string, name: string}[]
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },
                        searchIn: {
                            type: dalProvider.fieldTypes.STRING,
                            defaultValue: 'titlesAndReplies'
                        },
                        topicCode: {
                            type: dalProvider.fieldTypes.STRING
                        },
                        taskCode: { // {topicCode: string, taskId: number}
                            type: dalProvider.fieldTypes.OBJECT
                        },
                        attachments: {
                            type: dalProvider.fieldTypes.STRING,
                            defaultValue: ''
                        },
                        projects: { // {type: string, code: string, name: string}[]
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },
                        createdDateStart: {
                            type: dalProvider.fieldTypes.DATE,
                            validators: [
                                function (val, fieldDefinition, serviceInjector) {
                                    if (_.isNull(val) || _.isUndefined(val) || _.isNull(this.$model.createdDateEnd) || _.isUndefined(this.$model.createdDateEnd)) {
                                        return true;
                                    }
                                    if (val > this.$model.createdDateEnd) {
                                        return false;
                                    }
                                    return true;
                                },
                                gettext('Start date should be less than end date')
                            ]
                        },
                        createdDateEnd: {
                            type: dalProvider.fieldTypes.DATE,
                            validators: [
                                function (val, fieldDefinition, serviceInjector) {
                                    if (_.isNull(val) || _.isUndefined(val) || _.isNull(this.$model.createdDateStart) || _.isUndefined(this.$model.createdDateStart)) {
                                        return true;
                                    }
                                    if (val < this.$model.createdDateStart) {
                                        return false;
                                    }
                                    return true;
                                },
                                gettext('End date should be greater than start date')
                            ]
                        },
                        updatedDateStart: {
                            type: dalProvider.fieldTypes.DATE,
                            validators: [
                                function (val, fieldDefinition, serviceInjector) {
                                    if (_.isNull(val) || _.isUndefined(val) || _.isNull(this.$model.updatedDateEnd) || _.isUndefined(this.$model.updatedDateEnd)) {
                                        return true;
                                    }
                                    if (val > this.$model.updatedDateEnd) {
                                        return false;
                                    }
                                    return true;
                                },
                                gettext('Start date should be less than end date')
                            ]
                        },
                        updatedDateEnd: {
                            type: dalProvider.fieldTypes.DATE,
                            validators: [
                                function (val, fieldDefinition, serviceInjector) {
                                    if (_.isNull(val) || _.isUndefined(val) || _.isNull(this.$model.updatedDateStart) || _.isUndefined(this.$model.updatedDateStart)) {
                                        return true;
                                    }
                                    if (val < this.$model.updatedDateStart) {
                                        return false;
                                    }
                                    return true;
                                },
                                gettext('End date should be greater than start date')
                            ]
                        },
                        startDateStart: {
                            type: dalProvider.fieldTypes.DATE,
                            validators: [
                                function (val, fieldDefinition, serviceInjector) {
                                    if (_.isNull(val) || _.isUndefined(val) || _.isNull(this.$model.startDateEnd) || _.isUndefined(this.$model.startDateEnd)) {
                                        return true;
                                    }
                                    if (val > this.$model.startDateEnd) {
                                        return false;
                                    }
                                    return true;
                                },
                                gettext('Start date should be less than end date')
                            ]
                        },
                        startDateEnd: {
                            type: dalProvider.fieldTypes.DATE,
                            validators: [
                                function (val, fieldDefinition, serviceInjector) {
                                    if (_.isNull(val) || _.isUndefined(val) || _.isNull(this.$model.startDateStart) || _.isUndefined(this.$model.startDateStart)) {
                                        return true;
                                    }
                                    if (val < this.$model.startDateStart) {
                                        return false;
                                    }
                                    return true;
                                },
                                gettext('End date should be greater than start date')
                            ]
                        },
                        dueDateStart: {
                            type: dalProvider.fieldTypes.DATE,
                            validators: [
                                function (val, fieldDefinition, serviceInjector) {
                                    if (_.isNull(val) || _.isUndefined(val) || _.isNull(this.$model.dueDateEnd) || _.isUndefined(this.$model.dueDateEnd)) {
                                        return true;
                                    }
                                    if (val > this.$model.dueDateEnd) {
                                        return false;
                                    }
                                    return true;
                                },
                                gettext('Start date should be less than end date')
                            ]
                        },
                        dueDateEnd: {
                            type: dalProvider.fieldTypes.DATE,
                            validators: [
                                function (val, fieldDefinition, serviceInjector) {
                                    if (_.isNull(val) || _.isUndefined(val) || _.isNull(this.$model.dueDateStart) || _.isUndefined(this.$model.dueDateStart)) {
                                        return true;
                                    }
                                    if (val < this.$model.dueDateStart) {
                                        return false;
                                    }
                                    return true;
                                },
                                gettext('End date should be greater than start date')
                            ]
                        }
                    }
                }
            );
        });

})();
