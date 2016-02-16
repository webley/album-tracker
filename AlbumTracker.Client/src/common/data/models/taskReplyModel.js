(function () {
    'use strict';
    angular.module('psteam.common.data.models.taskReplyModel', ['dal'])

        .config(function (dalProvider, FieldValidationTemplates) {
            dalProvider.defineModel('TaskReplyModel',
                {
                    extend: 'IdModel',
                    fields: {

                        /**
                         * Date of the task's creation.
                         */
                        createdDate: {
                            type: dalProvider.fieldTypes.DATE
                        },

                        /**
                         * Date at which the task was updated last time.
                         */
                        updatedDate: {
                            type: dalProvider.fieldTypes.DATE
                        },

                        /**
                         * Originator of the action on the task. Differs from author in case of actioning on behalf.
                         */
                        originator: {
                            type: dalProvider.fieldTypes.OBJECT
                        },

                        taskCode: {
                            type: dalProvider.fieldTypes.STRING
                        },

                        /**
                         * Task code identifying the task in PS-Team. I.e.: Exampletopic#1.
                         */
                        topicCode: {
                            type: dalProvider.fieldTypes.STRING
                        },

                        // region lists

                        /**
                         * Task assignees
                         */
                        assignees: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        /**
                         * Assignees to be added to a task.
                         */
                        addedAssignees: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        /**
                         * Assignees to be removed from the task's assignees list.
                         */
                        removedAssignees: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        /**
                         * Task's associate relations (tasks linked to the task as associates).
                         */
                        associates: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        /**
                         * Tasks to be added as associates to a task.
                         */
                        addedAssociates: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        /**
                         * Task type task linked as associates and to be removed.
                         */
                        removedAssociates: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        /**
                         * Document type tasks linked to a task a child documents.
                         */
                        childDocuments: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        /**
                         * Document task to be added as children.
                         */
                        addedChildDocuments: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        /**
                         * Document type tasks linked as child tasks and to be removed.
                         */
                        removedChildDocuments: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        /**
                         * Document type tasks linked to a task a child documents.
                         */
                        childSharedDocuments: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        /**
                         * Document task to be added as children.
                         */
                        addedChildSharedDocuments: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        /**
                         * Document type tasks linked as child tasks and to be removed.
                         */
                        removedChildSharedDocuments: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        /**
                         * Document type tasks linked to a task a child documents.
                         */
                        childFolders: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        /**
                         * Document task to be added as children.
                         */
                        addedChildFolders: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        /**
                         * Document type tasks linked as child tasks and to be removed.
                         */
                        removedChildFolders: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        /**
                         * Document type tasks linked to a task a child documents.
                         */
                        childSharedFolders: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        /**
                         * Document task to be added as children.
                         */
                        addedChildSharedFolders: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        /**
                         * Document type tasks linked as child tasks and to be removed.
                         */
                        removedChildSharedFolders: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        /**
                         * Task type tasks linked to a task as a child tasks.
                         */
                        childTasks: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        /**
                         * Task type tasks to be added as children.
                         */
                        addedChildTasks: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        /**
                         * Task type tasks linked as child tasks and to be removed.
                         */
                        removedChildTasks: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        /**
                         * Task's child shares. In other words, all document type tasks linked to the task as a child shares.
                         */
                        childShares: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        /**
                         * Document type tasks to be added as a children shares to another document type folder task.
                         */
                        addedChildShares: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        /**
                         * Document type tasks linked as child shares and to be removed.
                         */
                        removedChildShares: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        /**
                         * Task's listeners.
                         */
                        listeners: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        /**
                         * Task listeners to be added to a task.
                         */
                        addedListeners: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        /**
                         * Task listeners to be removed.
                         */
                        removedListeners: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        /**
                         * Task type tasks linked as a parents.
                         */
                        parentTasks: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        /**
                         * Task type tasks to be added as parents to a task.
                         */
                        addedParentTasks: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        /**
                         * Task type tasks linked as parent tasks and to be removed.
                         */
                        removedParentTasks: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        /**
                         * Task's parent shares. In other words, all document type tasks linked to the task as a parent shares.
                         */
                        parentShares: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        /**
                         * Document type tasks parent shares to be added to a folder type task.
                         */
                        addedParentShares: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        /**
                         * Document type tasks linked as parent shares and to be removed.
                         */
                        removedParentShares: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        /**
                         * Attached document type tasks (document type tasks that were linked via 'document attach' relation type).
                         */
                        attachedDocumentTasks: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        /**
                         * Document type tasks added to be attached to a task.
                         */
                        addedAttachedDocumentTasks: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        /**
                         * Document type tasks linked as attached document tasks and to be removed.
                         */
                        removedAttachedDocumentTasks: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        attachedDocumentFolders: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        /**
                         * Folder type tasks added to be attached to a task.
                         */
                        addedAttachedDocumentFolders: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        /**
                         * Folder type tasks linked as attached document tasks and to be removed.
                         */
                        removedAttachedDocumentFolders: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        /**
                         * List of tasks to which this document type task is attached (linked via 'document attach' type of relation).
                         */
                        tasksThisDocumentIsAttachedTo: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        /**
                         * Read-only field of the tasks that have this document task attached to them. Replies only
                         */
                        addedTasksThisDocumentIsAttachedTo: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        /**
                         * Read-only field of the tasks that have this document task attached to them. Replies only
                         */
                        removedTasksThisDocumentIsAttachedTo: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        // endregion


                        /**
                         * Fast-view files to be attached to a document.
                         */
                        addedFastViewFiles: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        /**
                         * Files attached to a task.
                         */
                        attachedFiles: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        /**
                         * FastView Files attached to a task (document type task).
                         */
                        attachedFastViewFiles: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        /**
                         * Author of the action over task (different from the originator in case of actioning on behalf).
                         */
                        author: {
                            type: dalProvider.fieldTypes.STRING
                        },

                        /**
                         * Task's base due date.
                         */
                        baseDueDate: {
                            type: dalProvider.fieldTypes.DATE,
                            validators: [
                                function (val, fieldDefinition, serviceInjector) {
                                    if (_.isNull(val) || _.isUndefined(val) || _.isNull(this.$model.baseStartDate) || _.isUndefined(this.$model.baseStartDate)) {
                                        return true;
                                    }
                                    if (val < this.$model.baseStartDate) {
                                        return false;
                                    }
                                    return true;
                                },
                                gettext('Due date should be greater than Start date'),
                                function (val) {
                                    if ((_.isNull(val) || _.isUndefined(val)) && !(_.isNull(this.$model.baseStartDate) || _.isUndefined(this.$model.baseStartDate))) {
                                        return false;
                                    }
                                    return true;
                                },
                                gettext('Please provide both dates')
                            ]
                        },

                        /**
                         * Task's base duration.
                         */
                        baseDuration: {
                            type: dalProvider.fieldTypes.INTEGER
                        },

                        /**
                         * Task's base start date.
                         */
                        baseStartDate: {
                            type: dalProvider.fieldTypes.DATE,
                            validators: [
                                function (val, fieldDefinition, serviceInjector) {
                                    if (_.isNull(val) || _.isUndefined(val) || _.isNull(this.$model.baseDueDate) || _.isUndefined(this.$model.baseDueDate)) {
                                        return true;
                                    }
                                    if (val > this.$model.baseDueDate) {
                                        return false;
                                    }
                                    return true;
                                },
                                gettext('Due date should be greater than Start date'),
                                function (val) {
                                    if ((_.isNull(val) || _.isUndefined(val)) && !(_.isNull(this.$model.baseDueDate) || _.isUndefined(this.$model.baseDueDate))) {
                                        return false;
                                    }
                                    return true;
                                },
                                gettext('Please provide both dates')
                            ]
                        },


                        /**
                         * User who last checked-in the version of the document type task.
                         */
                        checkedIn: {
                            type: dalProvider.fieldTypes.STRING
                        },

                        /**
                         * Task's completion percentage.
                         */
                        complete: {
                            type: dalProvider.fieldTypes.FLOAT,
                            validators: [
                                FieldValidationTemplates.floatValidator(),
                                FieldValidationTemplates.isPositiveOrZero(),
                                function (val) {
                                    if (_.isNull(val) || _.isUndefined(val)) {
                                        return true;
                                    }
                                    if (val > 100) {
                                        return false;
                                    }
                                    return true;
                                },
                                gettext('Completion should not be higher than 100')
                            ]
                        },

                        /**
                         * Task's base cost.
                         */
                        baseCost: {
                            type: dalProvider.fieldTypes.FLOAT,
                            validators: [
                                FieldValidationTemplates.floatValidator(),
                                FieldValidationTemplates.isPositiveOrZero()
                            ]
                        },

                        /**
                         * Task's cost value.
                         */
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

                        /**
                         * Task's actual cost.
                         */
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

                        /**
                         * Docment's due date. Means the date until which the document's version is checked-out for editing.
                         */
                        documentDueDate: {
                            type: dalProvider.fieldTypes.DATE
                        },

                        /**
                         * Document's start date. Means the date from which the document's version is checked out for editing.
                         */
                        documentStartDate: {
                            type: dalProvider.fieldTypes.DATE
                        },

                        /**
                         * Document type task's status regarding the document behaviour. Checked-in or checked-out.
                         */
                        documentStatus: {
                            type: dalProvider.fieldTypes.DYNAMIC
                        },

                        /**
                         * Document type task's type. I.e. document or folder.
                         */
                        documentType: {
                            type: dalProvider.fieldTypes.DYNAMIC
                        },

                        /**
                         * Version of the document type task that is approved. Should contain integer describing version
                         * number that is approved. Can not contain number representing non existing version of the document.
                         */
                        documentApprovedVersion: {
                            type: dalProvider.fieldTypes.INTEGER
                        },

                        /**
                         * Versions of the document type task that approved. Should contain array of integers describing version
                         * numbers that approved. Can not contain number representing non existing version of the document.
                         */
                        documentVersionsApproved: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        /**
                         * Versions of the document type task that not approved. Should contain array of integers describing version
                         * numbers that not approved. Can not contain number representing non existing version of the document.
                         */
                        documentVersionsUnApproved: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        /**
                         * Task's due date value.
                         */
                        dueDate: {
                            type: dalProvider.fieldTypes.DATE,
                            validators: [
                                function (val, fieldDefinition, serviceInjector) {
                                    if (_.isNull(val) || _.isUndefined(val) || _.isNull(this.$model.startDate) || _.isUndefined(this.$model.startDate)) {
                                        return true;
                                    }
                                    if (val < this.$model.startDate) {
                                        return false;
                                    }
                                    return true;
                                },
                                gettext('Due date should be greater than Start date'),
                                function (val) {
                                    if ((_.isNull(val) || _.isUndefined(val)) && !(_.isNull(this.$model.startDate) || _.isUndefined(this.$model.startDate))) {
                                        return false;
                                    }
                                    return true;
                                },
                                gettext('Please provide both dates')
                            ]
                        },

                        /**
                         * Task's non-listeners.
                         */
                        nonListeners: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        /**
                         * One-time-listeners of the task. Equal to CC'ing. Means that users listed will be notified once about the
                         * corresponding changes submitted along with this field.
                         */
                        oneTimeListeners: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        /**
                         * Task's parent folders. In other words, folder type tasks linked as a parents.
                         */
                        parentFolder: {
                            type: dalProvider.fieldTypes.STRING
                        },

                        /**
                         * Task's priority value.
                         */
                        priority: {
                            type: dalProvider.fieldTypes.INTEGER
                        },

                        /**
                         * Task's remaining cost value.
                         */
                        remainingCost: {
                            type: dalProvider.fieldTypes.INTEGER
                        },

                        /**
                         * Task's remaining duration value.
                         */
                        remainingDuration: {
                            type: dalProvider.fieldTypes.INTEGER
                        },

                        /**
                         * Task's reply text.
                         */
                        replyText: {
                            type: dalProvider.fieldTypes.STRING
                        },

                        /**
                         * Roll-up flag for the task.
                         */
                        rolledUp: {
                            type: dalProvider.fieldTypes.BOOLEAN
                        },

                        /**
                         * Task's start date value.
                         */
                        startDate: {
                            type: dalProvider.fieldTypes.DATE,
                            validators: [
                                function (val, fieldDefinition, serviceInjector) {
                                    if (_.isNull(val) || _.isUndefined(val) || _.isNull(this.$model.dueDate) || _.isUndefined(this.$model.dueDate)) {
                                        return true;
                                    }
                                    if (val > this.$model.dueDate) {
                                        return false;
                                    }
                                    return true;
                                },
                                gettext('Start date should be less than Due date'),
                                function (val) {
                                    if ((_.isNull(val) || _.isUndefined(val)) && !(_.isNull(this.$model.dueDate) || _.isUndefined(this.$model.dueDate))) {
                                        return false;
                                    }
                                    return true;
                                },
                                gettext('Please provide both dates')
                            ]
                        },

                        /**
                         * Task's status.
                         */
                        status: {
                            type: dalProvider.fieldTypes.DYNAMIC
                        },

                        /**
                         * Task's title.
                         */
                        title: {
                            type: dalProvider.fieldTypes.STRING,
                            validators: [
                              function(val) {
                                if (_.isNull(val) || _.isUndefined(val) || val.length == 0) {
                                  return false;
                                }
                                return true;
                              }
                            ]
                        },

                        /**
                         * File attachment uploaded to the server to be submitted and attached to a task, but now are to be declined and
                         * not submitted.
                         */
                        unwantedAttachmentFiles: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        /**
                         * Task's work time value.
                         */
                        workTime: {
                            type: dalProvider.fieldTypes.INTEGER,
                            validators: [
                                FieldValidationTemplates.integerValidator(),
                                FieldValidationTemplates.isPositiveOrZero(),
                                [
                                    function (val, fieldDefinition, serviceInjector) {
                                        if (_.isNull(val) || _.isUndefined(val)) {
                                            return true;
                                        }
                                        if (val < this.$model.actualWorkTime) {
                                            return false;
                                        }
                                        return true;
                                    },
                                    gettext('Should be greater than or equal to Actual Work Time')
                                ]
                            ],
                            defaultValue: 0
                        },
                        /**
                         * Tasks's actual work time.
                         */
                        actualWorkTime: {
                            type: dalProvider.fieldTypes.INTEGER,
                            validators: [
                                FieldValidationTemplates.integerValidator(),
                                FieldValidationTemplates.isPositiveOrZero(),
                                [
                                    function (val, fieldDefinition, serviceInjector) {
                                        if (_.isNull(val) || _.isUndefined(val)) {
                                            return true;
                                        }
                                        if (val > this.$model.workTime) {
                                            return false;
                                        }
                                        return true;
                                    },
                                    gettext('Should be less than or equal to Total Work Time')
                                ]
                            ],
                            defaultValue: 0
                        },
                        /**
                         * Task's base work time.
                         */
                        baseWorkTime: {
                            type: dalProvider.fieldTypes.INTEGER,
                            validators: [
                                FieldValidationTemplates.integerValidator(),
                                FieldValidationTemplates.isPositiveOrZero()
                            ],
                            defaultValue: 0
                        },
                        /**
                         * Task's remaining worktime value.
                         */
                        remainingWorkTime: {
                            type: dalProvider.fieldTypes.INTEGER
                        },

                        /**
                         * Task Duration as DueDate - StartDate.
                         */
                        duration: {
                            type: dalProvider.fieldTypes.INTEGER
                        },

                        /**
                         * Files to be attached to a task.
                         */
                        addedAttachedFiles: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        },

                        fileAttachments: {
                            type: dalProvider.fieldTypes.ARRAY,
                            defaultValue: []
                        }

                    }
                }
            );
        });

})();
