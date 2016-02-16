/* global angular */
(function () {
    'use strict';

    var TASK_FIELD_TYPES = {
        READ_ONLY: 0,
        WRITABLE: 1,
        LIST: 2
    };

    angular.module('psteam.common.tasks.taskFields', [])

        .constant('TaskFieldTypes', TASK_FIELD_TYPES)

        .factory('TaskFields', function (TaskFieldTypes) {
            return {
                // read only
                id: {
                    type: TaskFieldTypes.READ_ONLY
                },

                // <summary>
                // Date of the task's creation.
                // </summary>
                createdDate: {
                    type: TaskFieldTypes.READ_ONLY
                },

                // <summary>
                // Originator of the action on the task. Differs from author in case of actioning on behalf.
                // </summary>
                originator: {
                    type: TaskFieldTypes.READ_ONLY
                },

                // <summary>
                // Task code identifying the task in PS-Team. I.e.: Exampletopic#1.
                // </summary>
                taskCode: {
                    type: TaskFieldTypes.READ_ONLY
                },

                topicCode: {
                    type: TaskFieldTypes.READ_ONLY
                },
                // <summary>
                // Date at which the task was updated last time.
                // </summary>

                updatedDate: {
                    type: TaskFieldTypes.READ_ONLY
                },

                // lists

                // <summary>
                // Task assignees.
                // </summary>
                assignees: {
                    type: TaskFieldTypes.LIST,
                    list: {
                        added: 'addedAssignees',
                        removed: 'removedAssignees'
                    }

                },
                // <summary>
                // Assignees to be added to a task.
                // </summary>
                addedAssignees: {
                    type: TaskFieldTypes.WRITABLE,
                    defaultValue: []
                },
                // <summary>
                // Assignees to be removed from the task's assignees list.
                // </summary>
                removedAssignees: {
                    type: TaskFieldTypes.WRITABLE,
                    defaultValue: []
                },

                // <summary>
                // Task's associate relations (tasks linked to the task as associates).
                // </summary>
                associates: {
                    type: TaskFieldTypes.LIST,
                    list: {
                        added: 'addedAssociates',
                        removed: 'removedAssociates'
                    }
                },
                // <summary>
                // Tasks to be added as associates to a task.
                // </summary>
                addedAssociates: {
                    type: TaskFieldTypes.WRITABLE,
                    defaultValue: []
                },
                // <summary>
                // Task type task linked as associates and to be removed.
                // </summary>
                removedAssociates: {
                    type: TaskFieldTypes.WRITABLE,
                    defaultValue: []
                },

                // <summary>
                // Document type tasks linked to a task a child documents.
                // </summary>
                childDocuments: {
                    type: TaskFieldTypes.LIST,
                    list: {
                        added: 'addedChildDocuments',
                        removed: 'removedChildDocuments'
                    }
                },
                // <summary>
                // Document task to be added as children.
                // </summary>
                addedChildDocuments: {
                    type: TaskFieldTypes.WRITABLE,
                    defaultValue: []
                },
                // <summary>
                // Document type tasks linked as child tasks and to be removed.
                // </summary>
                removedChildDocuments: {
                    type: TaskFieldTypes.WRITABLE,
                    defaultValue: []
                },


                // <summary>
                // Document type tasks linked to a task a child documents.
                // </summary>
                childSharedDocuments: {
                    type: TaskFieldTypes.LIST,
                    list: {
                        added: 'addedChildSharedDocuments',
                        removed: 'removedChildSharedDocuments'
                    }
                },
                // <summary>
                // Document task to be added as children.
                // </summary>
                addedChildSharedDocuments: {
                    type: TaskFieldTypes.WRITABLE,
                    defaultValue: []
                },
                // <summary>
                // Document type tasks linked as child tasks and to be removed.
                // </summary>
                removedChildSharedDocuments: {
                    type: TaskFieldTypes.WRITABLE,
                    defaultValue: []
                },


                // <summary>
                // Document type tasks linked to a task a child documents.
                // </summary>
                childFolders: {
                    type: TaskFieldTypes.LIST,
                    list: {
                        added: 'addedChildFolders',
                        removed: 'removedChildFolders'
                    }
                },
                // <summary>
                // Document task to be added as children.
                // </summary>
                addedChildFolders: {
                    type: TaskFieldTypes.WRITABLE,
                    defaultValue: []
                },
                // <summary>
                // Document type tasks linked as child tasks and to be removed.
                // </summary>
                removedChildFolders: {
                    type: TaskFieldTypes.WRITABLE,
                    defaultValue: []
                },

                // <summary>
                // Document type tasks linked to a task a child documents.
                // </summary>
                childSharedFolders: {
                    type: TaskFieldTypes.LIST,
                    list: {
                        added: 'addedChildSharedFolders',
                        removed: 'removedChildSharedFolders'
                    }
                },
                // <summary>
                // Document task to be added as children.
                // </summary>
                addedChildSharedFolders: {
                    type: TaskFieldTypes.WRITABLE,
                    defaultValue: []
                },
                // <summary>
                // Document type tasks linked as child tasks and to be removed.
                // </summary>
                removedChildSharedFolders: {
                    type: TaskFieldTypes.WRITABLE,
                    defaultValue: []
                },

                // <summary>
                // Task type tasks linked to a task as a child tasks.
                // </summary>
                childTasks: {
                    type: TaskFieldTypes.LIST,
                    list: {
                        added: 'addedChildTasks',
                        removed: 'removedChildTasks'
                    }
                },
                // <summary>
                // Task type tasks to be added as children.
                // </summary>
                addedChildTasks: {
                    type: TaskFieldTypes.WRITABLE,
                    defaultValue: []
                },
                // <summary>
                // Task type tasks linked as child tasks and to be removed.
                // </summary>
                removedChildTasks: {
                    type: TaskFieldTypes.WRITABLE,
                    defaultValue: []
                },

                // <summary>
                // Task's child shares. In other words, all document type tasks linked to the task as a child shares.
                // </summary>
                childShares: {
                    type: TaskFieldTypes.LIST,
                    list: {
                        added: 'addedChildShares',
                        removed: 'removedChildShares'
                    }
                },
                // <summary>
                // Document type tasks to be added as a children shares to another document type folder task.
                // </summary>
                addedChildShares: {
                    type: TaskFieldTypes.WRITABLE,
                    defaultValue: []
                },
                // <summary>
                // Document type tasks linked as child shares and to be removed.
                // </summary>
                removedChildShares: {
                    type: TaskFieldTypes.WRITABLE,
                    defaultValue: []
                },

                // <summary>
                // Task's listeners.
                // </summary>
                listeners: {
                    type: TaskFieldTypes.LIST,
                    list: {
                        added: 'addedListeners',
                        removed: 'removedListeners'
                    }

                },
                // <summary>
                // Task listeners to be added to a task.
                // </summary>
                addedListeners: {
                    type: TaskFieldTypes.WRITABLE,
                    defaultValue: []
                },
                // <summary>
                // Task listeners to be removed.
                // </summary>
                removedListeners: {
                    type: TaskFieldTypes.WRITABLE,
                    defaultValue: []
                },

                // <summary>
                // Task type tasks linked as a parents.
                // </summary>
                parentTasks: {
                    type: TaskFieldTypes.LIST,
                    list: {
                        added: 'addedParentTasks',
                        removed: 'removedParentTasks'
                    }
                },
                // <summary>
                // Task type tasks to be added as parents to a task.
                // </summary>
                addedParentTasks: {
                    type: TaskFieldTypes.WRITABLE,
                    defaultValue: []
                },
                // <summary>
                // Task type tasks linked as parent tasks and to be removed.
                // </summary>
                removedParentTasks: {
                    type: TaskFieldTypes.WRITABLE,
                    defaultValue: []
                },

                // <summary>
                // Task's parent shares. In other words, all document type tasks linked to the task as a parent shares.
                // </summary>
                parentShares: {
                    type: TaskFieldTypes.LIST,
                    list: {
                        added: 'addedParentShares',
                        removed: 'removedParentShares'
                    }
                },
                // <summary>
                // Document type tasks parent shares to be added to a folder type task.
                // </summary>
                addedParentShares: {
                    type: TaskFieldTypes.WRITABLE,
                    defaultValue: []
                },
                // <summary>
                // Document type tasks linked as parent shares and to be removed.
                // </summary>
                removedParentShares: {
                    type: TaskFieldTypes.WRITABLE,
                    defaultValue: []
                },

                // <summary>
                // Attached document type tasks (document type tasks that were linked via 'document attach' relation type).
                // </summary>
                attachedDocumentTasks: {
                    type: TaskFieldTypes.LIST,
                    list: {
                        added: 'addedAttachedDocumentTasks',
                        removed: 'removedAttachedDocumentTasks'
                    }

                },
                // <summary>
                // Document type tasks added to be attached to a task.
                // </summary>
                addedAttachedDocumentTasks: {
                    type: TaskFieldTypes.WRITABLE,
                    defaultValue: []
                },
                // <summary>
                // Document type tasks linked as attached document tasks and to be removed.
                // </summary>
                removedAttachedDocumentTasks: {
                    type: TaskFieldTypes.WRITABLE,
                    defaultValue: []
                },

                attachedDocumentFolders: {
                    type: TaskFieldTypes.LIST,
                    list: {
                        added: 'addedAttachedDocumentFolders',
                        removed: 'removedAttachedDocumentFolders'
                    }

                },
                // <summary>
                // Folder type tasks added to be attached to a task.
                // </summary>
                addedAttachedDocumentFolders: {
                    type: TaskFieldTypes.WRITABLE,
                    defaultValue: []
                },
                // <summary>
                // Folder type tasks linked as attached document tasks and to be removed.
                // </summary>
                removedAttachedDocumentFolders: {
                    type: TaskFieldTypes.WRITABLE,
                    defaultValue: []
                },

                // <summary>
                // List of tasks to which this document type task is attached (linked via 'document attach' type of relation).
                // </summary>
                tasksThisDocumentIsAttachedTo: {
                    type: TaskFieldTypes.LIST,
                    list: {
                        added: 'addedTasksThisDocumentIsAttachedTo',
                        removed: 'removedTasksThisDocumentIsAttachedTo'
                    }
                },
                // <summary>
                // Read-only field of the tasks that have this document task attached to them. Replies only
                // </summary>
                addedTasksThisDocumentIsAttachedTo: {
                    type: TaskFieldTypes.WRITABLE,
                    defaultValue: []
                },
                // <summary>
                // Read-only field of the tasks that have this document task attached to them. Replies only
                // </summary>
                removedTasksThisDocumentIsAttachedTo: {
                    type: TaskFieldTypes.WRITABLE,
                    defaultValue: []
                },

                // <summary>
                // Task's actual cost.
                // </summary>
                actualCost: {
                    type: TaskFieldTypes.WRITABLE,
                    rollup: true
                },

                // <summary>
                // Tasks's actual work time.
                // </summary>
                actualWorkTime: {
                    type: TaskFieldTypes.WRITABLE,
                    rollup: true
                },

                // <summary>
                // Fast-view files to be attached to a document.
                // </summary>
                addedFastViewFiles: {
                    type: TaskFieldTypes.WRITABLE
                },

                // <summary>
                // Files attached to a task.
                // </summary>
                attachedFiles: {
                    type: TaskFieldTypes.WRITABLE
                },

                // <summary>
                // FastView Files attached to a task (document type task).
                // </summary>
                attachedFastViewFiles: {
                    type: TaskFieldTypes.WRITABLE
                },

                // <summary>
                // Author of the action over task (different from the originator in case of actioning on behalf).
                // </summary>
                author: {
                    type: TaskFieldTypes.WRITABLE
                },

                // <summary>
                // Task's base cost.
                // </summary>
                baseCost: {
                    type: TaskFieldTypes.WRITABLE
                },

                // <summary>
                // Task's base due date.
                // </summary>
                baseDueDate: {
                    type: TaskFieldTypes.WRITABLE
                },

                // <summary>
                // Task's base duration.
                // </summary>
                baseDuration: {
                    type: TaskFieldTypes.WRITABLE
                },

                // <summary>
                // Task's base start date.
                // </summary>
                baseStartDate: {
                    type: TaskFieldTypes.WRITABLE
                },

                // <summary>
                // Task's base work time.
                // </summary>
                baseWorkTime: {
                    type: TaskFieldTypes.WRITABLE
                },

                // <summary>
                // User who last checked-in the version of the document type task.
                // </summary>
                checkedIn: {
                    type: TaskFieldTypes.WRITABLE
                },

                // <summary>
                // Task's completion percentage.
                // </summary>
                complete: {
                    type: TaskFieldTypes.WRITABLE
                },

                // <summary>
                // Task's cost value.
                // </summary>
                cost: {
                    type: TaskFieldTypes.WRITABLE,
                    rollup: true
                },

                // <summary>
                // Docment's due date. Means the date until which the document's version is checked-out for editing.
                // </summary>
                documentDueDate: {
                    type: TaskFieldTypes.WRITABLE
                },

                // <summary>
                // Document's start date. Means the date from which the document's version is checked out for editing.
                // </summary>
                documentStartDate: {
                    type: TaskFieldTypes.WRITABLE
                },

                // <summary>
                // Document type task's status regarding the document behaviour. Checked-in or checked-out.
                // </summary>
                documentStatus: {
                    type: TaskFieldTypes.WRITABLE
                },

                // <summary>
                // Document type task's type. I.e. document or folder.
                // </summary>
                documentType: {
                    type: TaskFieldTypes.WRITABLE
                },

                // <summary>
                // Version of the document type task that is approved. Should contain integer describing version
                // number that is approved. Can not contain number representing non existing version of the document.
                // </summary>
                documentApprovedVersion: {
                    type: TaskFieldTypes.WRITABLE
                },

                // <summary>
                // Versions of the document type task that approved. Should contain array of integers describing version
                // numbers that approved. Can not contain number representing non existing version of the document.
                // </summary>
                documentVersionsApproved: {
                    type: TaskFieldTypes.WRITABLE
                },

                // <summary>
                // Versions of the document type task that not approved. Should contain array of integers describing version
                // numbers that not approved. Can not contain number representing non existing version of the document.
                // </summary>
                documentVersionsUnApproved: {
                    type: TaskFieldTypes.WRITABLE
                },

                // <summary>
                // Task's due date value.
                // </summary>
                dueDate: {
                    type: TaskFieldTypes.WRITABLE,
                    rollup: true
                },

                // <summary>
                // Task's non-listeners.
                // </summary>
                nonListeners: {
                    type: TaskFieldTypes.WRITABLE,
                    rollup: true
                },

                // <summary>
                // One-time-listeners of the task. Equal to CC'ing. Means that users listed will be notified once about the
                // corresponding changes submitted along with this field.
                // </summary>
                oneTimeListeners: {
                    type: TaskFieldTypes.WRITABLE
                },

                // <summary>
                // Task's parent folders. In other words, folder type tasks linked as a parents.
                // </summary>
                parentFolder: {
                    type: TaskFieldTypes.WRITABLE
                },

                // <summary>
                // Task's priority value.
                // </summary>
                priority: {
                    type: TaskFieldTypes.WRITABLE
                },

                // <summary>
                // Task's remaining cost value.
                // </summary>
                remainingCost: {
                    type: TaskFieldTypes.READ_ONLY
                },

                // <summary>
                // Task's remaining duration value.
                // </summary>
                remainingDuration: {
                    type: TaskFieldTypes.READ_ONLY
                },

                // <summary>
                // Task's remaining worktime value.
                // </summary>
                remainingWorkTime: {
                    type: TaskFieldTypes.READ_ONLY
                },

                // <summary>
                // Task's reply text.
                // </summary>
                replyText: {
                    type: TaskFieldTypes.WRITABLE
                },

                // <summary>
                // Roll-up flag for the task.
                // </summary>
                rolledUp: {
                    type: TaskFieldTypes.WRITABLE
                },

                // <summary>
                // Task's start date value.
                // </summary>
                startDate: {
                    type: TaskFieldTypes.WRITABLE,
                    rollup: true
                },

                // <summary>
                // Task's status.
                // </summary>
                status: {
                    type: TaskFieldTypes.WRITABLE
                },

                // <summary>
                // Task's title.
                // </summary>
                title: {
                    type: TaskFieldTypes.WRITABLE
                },

                // <summary>
                // File attachment uploaded to the server to be submitted and attached to a task, but now are to be declined and
                // not submitted.
                // </summary>
                unwantedAttachmentFiles: {
                    type: TaskFieldTypes.WRITABLE
                },

                // <summary>
                // Task's work time value.
                // </summary>
                workTime: {
                    type: TaskFieldTypes.WRITABLE,
                    rollup: true
                },

                // <summary>
                // Task Duration as DueDate - StartDate.
                // </summary>
                duration: {
                    type: TaskFieldTypes.WRITABLE
                },

                // <summary>
                // Files to be attached to a task.
                // </summary>
                addedAttachedFiles: {
                    type: TaskFieldTypes.WRITABLE,
                    defaultValue: []
                },

                fileAttachments: {
                    type: TaskFieldTypes.READ_ONLY
                }

            };
        });

})();
