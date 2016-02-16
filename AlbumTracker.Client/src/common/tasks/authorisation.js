/* global angular */
(function () {
    'use strict';

    angular.module('psteam.common.tasks.authorisation', [])
        .factory('AuthorisationFactory', function ($q) {
            return function (authorisation) {

                return $q.when(authorisation).then(function (auth) {
                    var mapping = {
                        assignees: auth.assign,
                        listeners: auth.assign,
                        oneTimeListeners: auth.assign,
                        actualCost: auth.assign,
                        actualWorkTime: auth.assign,
                        complete: auth.assign,
                        documentDueDate: auth.assign,
                        documentStartDate: auth.assign,
                        documentStatus: auth.assign,
                        dueDate: auth.assign,
                        originator: auth.assign,
                        priority: auth.assign,
                        remainingCost: auth.assign,
                        remainingDuration: auth.assign,
                        remainingWorktime: auth.assign,
                        rolledUp: auth.assign,
                        startDate: auth.assign,
                        status: auth.assign,
                        cost: auth.assign,
                        workTime: auth.assign,
                        documentApprovedVersion: auth.assign,
                        documentVersionsApproved: auth.assign,
                        documentVersionsUnApproved: auth.assign
                    };

                    mapping = angular.extend(mapping, {
                        attachedDocumentTasks: auth.attachments,
                        attachedFiles: auth.attachments,
                        fastViewFiles: auth.attachments
                    });

                    mapping = angular.extend(mapping, {
                        baseCost: auth.manager,
                        baseDueDate: auth.manager,
                        baseDuration: auth.manager,
                        baseStartDate: auth.manager,
                        baseWorkTime: auth.manager
                    });

                    mapping = angular.extend(mapping, {
                        parentFolder: auth.relations,
                        parentTasks: auth.relations,
                        childTasks: auth.relations,
                        childDocuments: auth.relations,
                        parentShares: auth.relations,
                        childShares: auth.relations,
                        associates: auth.relations
                    });

                    mapping = angular.extend(mapping, {
                        title: auth.title,
                        edit: auth.edit
                    });

                    mapping = angular.extend(mapping, {
                        submit: auth.title || auth.edit || auth.relations || auth.manager || !auth.attachments || auth.assign
                    });

                    return mapping;
                });
            };
        });
})();
