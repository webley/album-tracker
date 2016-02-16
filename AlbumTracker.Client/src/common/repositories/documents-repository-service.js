/* global angular */
(function () {
    'use strict';
    angular.module('psteam.common.repositories.documents', [
        'psteam.common.data-access.documents',
        'psteam.common.tasks.taskTransformers'
    ])
        .service('DocumentsRepositoryService',
        function (DocumentsDataAccessService,
                  TaskTransformersService,
                  logger) {
            logger.trace("DocumentsRepositoryService");
            this.autocompleteDocuments = function (keyword) {
                logger.trace("DocumentsRepositoryService.autocompleteDocuments(keyword = '%s')", keyword);
                return DocumentsDataAccessService
                    .autocompleteDocuments(keyword)
                    .then(function (tasks) {
                        logger.trace("DocumentsRepositoryService.autocompleteDocuments:DocumentsDataAccessService.autocompleteDocuments.then", tasks);
                        tasks.forEach(
                            TaskTransformersService.transformTaskCodeString
                        );

                        return tasks;
                    });
            };
            this.getRootFolders = function (topicCode) {
                logger.trace("DocumentsRepositoryService.getRootFolders(topicCode = '%s')", topicCode);
                return DocumentsDataAccessService
                    .getRootFolders(topicCode)
                    .then(function (data) {
                        logger.trace("DocumentsRepositoryService.autocompleteDocuments:DocumentsDataAccessService.getRootFoldersd.then", data);
                        //tasks.forEach(
                        //    TaskTransformersService.transformTaskCodeString
                        //);

                        return data;
                    });
            };

            this.getDocument = function (taskCode) {
                logger.trace("DocumentsRepositoryService.getDocument(taskCode = '%s')", taskCode);
                return DocumentsDataAccessService
                    .getDocument(taskCode)
                    .then(function (document) {
                        TaskTransformersService
                            .transformTaskCode(document);

                        TaskTransformersService
                            .transformDateFields(document);

                        TaskTransformersService
                            .transformTaskRelationFields(document);

                        return document;
                    });
            };

            this.getDocumentHistory = function (taskCode) {
                logger.trace("DocumentsRepositoryService.getDocumentHistory(taskCode = '%s')", taskCode);
                return DocumentsDataAccessService.getDocumentHistory(taskCode.toString())
                    .then(function (data) {
                        logger.trace('DocumentsRepositoryService.getDocumentHistory:DocumentsDataAccessService.getDocumentHistory.then.success', data);
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
        }
    );
})();
