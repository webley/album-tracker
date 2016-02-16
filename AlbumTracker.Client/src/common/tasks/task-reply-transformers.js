/* global angular */
(function () {
    'use strict';

    var TASK_CODE = 'taskCode';
    var LOGIN_NAME = 'loginName';
    var SESSION_ID = 'sessionIdObject';

    var listFieldsMap = {
        addedAssignees: LOGIN_NAME,
        removedAssignees: LOGIN_NAME,
        addedListeners: LOGIN_NAME,
        removedListeners: LOGIN_NAME,

        addedAssociates: TASK_CODE,
        removedAssociates: TASK_CODE,
        addedChildTasks: TASK_CODE,
        removedChildTasks: TASK_CODE,
        addedParentTasks: TASK_CODE,
        removedParentTasks: TASK_CODE,
        addedAttachedDocumentTasks: TASK_CODE,
        removedAttachedDocumentTasks: TASK_CODE,
        addedAttachedDocumentFolders: TASK_CODE,
        removedAttachedDocumentFolders: TASK_CODE,

        addedChildDocuments: TASK_CODE,
        removedChildDocuments: TASK_CODE,
        addedChildSharedDocuments: TASK_CODE,
        removedChildSharedDocuments: TASK_CODE,
        addedChildFolders: TASK_CODE,
        removedChildFolders: TASK_CODE,
        addedChildSharedFolders: TASK_CODE,
        removedChildSharedFolders: TASK_CODE,

        addedAttachedFiles: SESSION_ID
    };

    angular.module('psteam.common.tasks.taskReplyTransformers', [])
        .service('TaskReplyTransformersService', [
            function () {

                function propertyFilter(obj, field) {
                    return obj.hasOwnProperty(field);
                }

                this.transformLists = function (taskReply) {
                    var taskReplyCopy = angular.extend({}, taskReply);

                    return Object.keys(listFieldsMap)
                        .filter(propertyFilter.bind(this, taskReplyCopy))
                        .reduce(function (transformed, field) {
                            transformed[field] =
                                transformed[field].map(function (one) {
                                    return one[listFieldsMap[field]];
                                });

                            return transformed;
                        }, taskReplyCopy);
                };

            }
        ]);

})();
