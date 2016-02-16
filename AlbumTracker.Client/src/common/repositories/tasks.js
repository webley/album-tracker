(function () {
    'use strict';
    angular.module('psteam.common.repositories.tasks', [
        'psteam.common.data-access.tasks',
        'psteam.common.tasks.taskTransformers',
        'psteam.common.tasks.taskReplyTransformers'
    ])
        .service('TasksRepositoryService',
        function (TasksDataAccessService, TaskTransformersService, TaskReplyTransformersService, logger) {
            logger.trace('TasksRepositoryService');

            this.getTask = function (taskCode) {
                logger.trace("TasksRepositoryService.getTask(taskCode = '%s')", taskCode);
                return TasksDataAccessService
                    .getTask(taskCode.toString())
                    .then(function (task) {
                        TaskTransformersService
                            .transformTaskCode(task);

                        TaskTransformersService
                            .transformDateFields(task);

                        TaskTransformersService
                            .transformTaskRelationFields(task);

                        return task;
                    });
            };

            this.getTasksByCodes = function (request) {
                logger.trace("TasksRepositoryService.getTasksByCodes", request);
                return TasksDataAccessService
                    .getTasksByCodes(request);
            };

            // May need to get the task type from somewhere.
            this.getEmptyTask = function (topicCode, taskType) {
                logger.trace("TasksRepositoryService.getEmptyTask", {
                    'topicCode': topicCode,
                    'taskType': taskType
                });
                var task = {
                    actualCost: 0,
                    actualWorkTime: 0,
                    assignees: [],
                    associates: [],
                    attachedDocumentTasks: [],
                    attachedDocumentFolders: [],
                    baseCost: 0,
                    baseDueDate: null,
                    baseStartDate: null,
                    baseWorkTime: 0,
                    childDocuments: [],
                    childShares: [],
                    childTasks: [],
                    complete: 0,
                    cost: 0,
                    createdDate: null,
                    dueDate: null,
                    fastViewAttachments: [],
                    fileAttachments: [],
                    id: -1,
                    listeners: [],
                    originator: {},
                    parentFolder: [],
                    parentShares: [],
                    parentTasks: [],
                    priority: 3,
                    rolledUp: false,
                    startDate: null,
                    status: 'unscheduled',
                    taskCode: topicCode + '#-1',
                    taskType: 'task',
                    title: '',
                    topicCode: topicCode,
                    updatedDate: '',
                    workTime: 0
                };

                TaskTransformersService
                    .transformTaskCode(task);

                TaskTransformersService
                    .transformDateFields(task);

                TaskTransformersService
                    .transformTaskRelationFields(task);

                return task;
            };

            var fields = [
                'status',
                'title',
                'priority',
                'startDate',
                'dueDate',
                'duration',
                'complete',
                'workTime',
                'actualWorktime',
                'cost',
                'actualCost',
                'rolledUp',
                'baseStartDate',
                'baseDueDate',
                'baseDuration',
                'baseWorkTime',
                'baseCost',
                'remainingWorktime',
                'remainingCost',
                'documentStatus',
                'documentStartDate',
                'documentDueDate'
            ];

            var collections = [
                'addedAssignees',
                'removedAssignees',
                'addedListeners',
                'removedListeners',
                'oneTimeListeners',
                'nonListeners',
                'addedAttachedFiles'
            ];

            var relations = [
                'addedAttachedDocuments',
                'removedAttachedDocuments',
                'addedParentFolders',
                'addedChildFolders',
                'addedChildDocuments',
                'addedParentShares',
                'addedChildShares',
                'removedChildShares',
                'addedAssociates',
                'removedAssociates',
                'addedParentTasks',
                'removedParentTasks',
                'addedChildTasks',
                'removedChildTasks'
            ];

            this.getTaskHistory = function (taskCode) {
                logger.trace("TasksRepositoryService.getTaskHistory(taskCode = '%s')", taskCode);
                return TasksDataAccessService.getTaskHistory(taskCode.toString())
                    .then(function (data) {
                        logger.trace('TasksRepositoryService.getTaskHistory:TasksDataAccessService.getTaskHistory.then.success', data);
                        var previousTaskStatus = {
                            priority: 3,
                            status: 'unscheduled'
                        };
                        for (var i = 0; i < data.taskReplies.length; i++) {
                            var reply = data.taskReplies[i];
                            for (var j = 0; j < fields.length; j++) {
                                var fieldName = fields[j];
                                var editedField = reply[fieldName];
                                if (editedField === undefined) {
                                    continue;
                                }

                                var temp = {
                                    newValue: editedField
                                };

                                if (i === 0) {
                                    temp.oldValue = null;
                                } else {
                                    var previousValue = previousTaskStatus[fieldName];
                                    if (previousValue != undefined) {
                                        temp.oldValue = previousValue;
                                    }
                                }

                                if (fieldName !== 'Title' || i > 0) {
                                    reply[fieldName] = temp;
                                }
                                previousTaskStatus[fieldName] = editedField;
                            }

                            for (var k = 0; k < collections.length; k++) {
                                var collectionName = collections[k];
                                var editedCollection = reply[collectionName];
                                if (editedCollection === undefined) {
                                    continue;
                                }

                                reply[collectionName] = {value: editedCollection};
                            }

                            for (var l = 0; l < relations.length; l++) {
                                var relationName = relations[l];
                                var editedRelation = reply[relationName];
                                if (editedRelation === undefined) {
                                    continue;
                                }
                                reply[relationName] = {value: editedRelation};
                            }

                            var pseudoReplyChanges = [];
                            for (var m = 0; m < reply.pseudoReplyChanges.length; m++) {
                                var pseudoReplyChange = reply.pseudoReplyChanges[m];

                                pseudoReplyChanges.push(
                                    {
                                        added: pseudoReplyChange.added,
                                        relationType: pseudoReplyChange.relationType,
                                        task: pseudoReplyChange.task,
                                        user: pseudoReplyChange.contributor,
                                        date: pseudoReplyChange.created
                                    });
                            }

                            reply.pseudoReplyChanges = pseudoReplyChanges;
                        }
                        return data;
                    });
            };

            this.saveTasks = function (replyArray, sendEmailNotifications) {
                logger.trace('TasksRepositoryService.saveTasks', {
                    'replyArray': replyArray,
                    'sendEmailNotifications': sendEmailNotifications
                });
                replyArray =
                    replyArray.map(TaskReplyTransformersService.transformLists);

                var reply = {
                    replies: replyArray,
                    sendEmailNotifications: sendEmailNotifications ||
                    true
                };

                return TasksDataAccessService.saveTasks(reply);
            };

            this.autocompleteTasks = function (keyword, taskTypes) {
                logger.trace("TasksRepositoryService.autocompleteTasks(keyword = '%s', taskTypes = '%s')", keyword, taskTypes);
                return TasksDataAccessService
                    .autocompleteTasks(keyword, taskTypes)
                    .then(function (tasks) {

                        tasks.forEach(
                            TaskTransformersService.transformTaskCodeString
                        );

                        return tasks;
                    });
            };

            this.calculateRollupFromChildren = function (childTaskCodes) {
                logger.trace("TasksRepositoryService.calculateRollupFromChildren", childTaskCodes);
                return TasksDataAccessService.calculateRollupFromChildren(childTaskCodes);
            };

            this.searchTasks = function (query, pageSize, pageNumber, sortOrder) {
                logger.trace("TasksRepositoryService.searchTasks", {
                    'query': query,
                    'pageSize': pageSize,
                    'pageNumber': pageNumber,
                    'sortOrder': sortOrder
                });
                return TasksDataAccessService.searchTasks(query, pageSize, pageNumber, sortOrder);
            }
        }
    );
})();
