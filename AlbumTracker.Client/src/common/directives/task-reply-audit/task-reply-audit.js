(function () {
    'use strict';
    angular.module('psteam.task.directives.taskReplyAudit', [
        'ngAnimate',
        'psteam-percent-complete-filter',
        'psteam.common.filters.duration',
        'psteam.common.filters.worktime',
        'psteam.common.filters.emptyChecker',
        'psteam.common.filters.taskStatus',
        'psteam.common.filters.documentStatus',
        'psteam.common.services.task-audit-template-cache',
        'psteam.common.services.relations'
    ]).directive('pstTaskReplyAudit', function ($compile,
        $filter,
        $state,
        $sanitize,
        $showdown,
        plaintextToHtml,
        gettextCatalog,
        relationTypeService,
        logger) {
        var syntaxHighlightLanguages = hljs.listLanguages();
        logger.trace(".directive('pstTaskReplyAudit'");


        var workTimeFilter = $filter('worktime');
        var statusFilter = $filter('taskStatus');
        var documentStatusFilter = $filter('documentStatus');
        var dateFilter = $filter('date');
        var percentCompleteFilter = $filter('percentComplete');
        var fileDownloadUrlFilter = $filter('fileDownloadUrl');
        var timezoneFilter = $filter('timezone');
        var emptyCheckerFilter = $filter('emptyChecker');
        var timeToStringFilter = function (date) {
            return dateFilter(timezoneFilter(date), 'short');
        };
        var dateToStringFilter = function (date) {
            return dateFilter(date, 'mediumDate');
        };
        var taskToLinkFilter = function (relatedTask) {
            if(!relatedTask) {
              return '';
            }
            var stateName;
            switch (relatedTask.taskType) {
                case 'meeting':
                    stateName = 'meeting_update';
                    break;
                case 'task':
                case 'project':
                case 'supplyChain':
                    stateName = 'task_update';
                    break;
                case 'document':
                    stateName = 'document_update';
                    break;
                case 'folder':
                    stateName = 'folders';
                    break;
                default:
                    stateName = 'task_redirect';
                    break;
            }
            var url = $state.href(stateName, {
                topicCode: relatedTask.topicCode,
                id: relatedTask.id
            });
            return '<a href=' + url + '>' + relatedTask.topicCode + '#' + relatedTask.id + ' - ' + relatedTask.title + '</a>';
        };

        function layoutFieldChange(string) {
            if (angular.isUndefined(string) || string === null || string === '') return '';
            return '<div class="edited-field">' + string + '</div>';
        }

        function generatePseudoReplyRelationChange(pseudoReplyChange, translate) {
            var template = '';

            var relation = pseudoReplyChange.task;


            var context = {
                task: taskToLinkFilter(relation),
                user: pseudoReplyChange.user.name,
                date: timeToStringFilter(pseudoReplyChange.date)
            };

            template += layoutFieldChange(translate(context));

            return template;
        }

        function generateFieldTemplate(userNameString, createDateString, field, transateWithOldValue, transateWithoutOldValue, filter) {
            if (angular.isUndefined(field)) {
                return '';
            }

            var context = {
                user: userNameString,
                date: createDateString
            };

            var filterSet = angular.isDefined(filter) && filter !== null;

            if (field.oldValue == null) {
                context.value = (filterSet ? filter(field.newValue) : field.newValue);
            } else {
                context.value = (filterSet ? filter(field.newValue) : field.newValue);
                context.oldValue = (filterSet ? filter(field.oldValue) : field.oldValue);
            }

            if (angular.isDefined(context.oldValue)) {
                return layoutFieldChange(transateWithOldValue(context));
            } else {
                return layoutFieldChange(transateWithoutOldValue(context));
            }
        }

        function generateUserCollection(userNameString, createDateString, currentContributor, field, translateWhenContributorSame, translateWhenContributorDiffernt) {

            if (angular.isUndefined(field)) {
                return '';
            }
            var users = field.value;

            var template = '';
            for (var userIndex = 0; userIndex < users.length; userIndex++) {

                var user = users[userIndex];
                var translationInterpelationObject = {
                    name: user.name,
                    user: userNameString,
                    date: createDateString
                };
                var translationString;
                if (user.loginName === currentContributor.loginName) {
                    translationString = translateWhenContributorSame(translationInterpelationObject);
                } else {

                    translationString = translateWhenContributorDiffernt(translationInterpelationObject);
                }

                template += layoutFieldChange(translationString);
            }
            return template;
        }

        function generateAttachmentCollection(userNameString, createDateString, field, translate) {
            if (angular.isUndefined(field)) {
                return '';
            }
            var attachments = field.value;

            var template = '';
            for (var attachmentIndex = 0; attachmentIndex < attachments.length; attachmentIndex++) {

                var attachment = attachments[attachmentIndex];

                var context = {
                    attachment: '<a target="_blank" href="' + fileDownloadUrlFilter(attachment.id) + '">' + attachment.fileName + '</a>',
                    version: attachment.version,
                    user: userNameString,
                    date: createDateString
                };
                template += layoutFieldChange(translate(context));
            }
            return template;

        }

        function generateRelationCollection(userNameString, createDateString, field, translate) {

            if (angular.isUndefined(field)) {
                return '';
            }
            var relations = field.value;

            var template = '';
            for (var relationIndex = 0; relationIndex < relations.length; relationIndex++) {

                var relation = relations[relationIndex];

                var context = {
                    task: taskToLinkFilter(relation),
                    user: userNameString,
                    date: createDateString
                };
                template += layoutFieldChange(translate(context));
            }
            return template;
        }

        function createTranslationFunctions() {
            return {
                statusChanged: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> changed the status from <b>{{oldValue}}</b> to <b>{{value}}</b> at {{date}}.', context);
                },

                statusSet: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> set the status to <b>{{value}}</b> at {{date}}.', context);
                },

                titleChanged: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> changed the title from <b>{{oldValue}}</b> to <b>{{value}}</b> at {{date}}.', context);
                },
                titleSet: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> set the title to <b>{{value}}</b> at {{date}}.', context);
                },

                priorityChanged: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> changed the priority from <b>{{oldValue}}</b> to <b>{{value}}</b> at {{date}}.', context);
                },
                prioritySet: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> set the priority to <b>{{value}}</b> at {{date}}.', context);
                },
                startDateChanged: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> changed the start date from <b>{{oldValue}}</b> to <b>{{value}}</b> at {{date}}.', context);
                },
                startDateSet: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> set the start date to <b>{{value}}</b> at {{date}}.', context);
                },

                dueDateChanged: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> changed the due date from <b>{{oldValue}}</b> to <b>{{value}}</b> at {{date}}.', context);
                },
                dueDateSet: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> set the due date to <b>{{value}}</b> at {{date}}.', context);
                },

                meetingStartTimeChanged: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> changed the start time from <b>{{oldValue}}</b> to <b>{{value}}</b> at {{date}}.', context);
                },
                meetingStartTimeSet: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> set the start time to <b>{{value}}</b> at {{date}}.', context);
                },

                meetingEndTimeChanged: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> changed the end time from <b>{{oldValue}}</b> to <b>{{value}}</b> at {{date}}.', context);
                },
                meetingEndTimeSet: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> set the end time to <b>{{value}}</b> at {{date}}.', context);
                },

                completeChanged: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> changed the percent complete from <b>{{oldValue}}</b> to <b>{{value}}</b> at {{date}}.', context);
                },
                completeSet: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> set percent complete to <b>{{value}}</b> at {{date}}.', context);
                },
                workTimeChanged: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> changed the total work time from <b>{{oldValue}}</b> to <b>{{value}}</b> at {{date}}.', context);
                },
                workTimeSet: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> set the total work time to <b>{{value}}</b> at {{date}}.', context);
                },

                actualWorkTimeChanged: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> changed the actual work time from <b>{{oldValue}}</b> to <b>{{value}}</b> at {{date}}.', context);
                },
                actualWorkTimeSet: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> set the actual work time to <b>{{value}}</b> at {{date}}.', context);
                },

                costChanged: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> changed the total cost from <b>{{oldValue}}</b> to <b>{{value}}</b> at {{date}}.', context);
                },
                costSet: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> set the total cost to <b>{{value}}</b> at {{date}}.', context);
                },

                actualCostChanged: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> changed the actual cost from <b>{{oldValue}}</b> to <b>{{value}}</b> at {{date}}.', context);
                },
                actualCostSet: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> set the actual cost to <b>{{value}}</b> at {{date}}.', context);
                },

                rollupSet: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> set roll up to <b>{{value}}</b> at {{date}}.', context);
                },

                baseStartDateChanged: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> changed the baseline start date from <b>{{oldValue}}</b> to <b>{{value}}</b> at {{date}}.', context);
                },
                baseStartDateSet: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> set the baseline start date to <b>{{value}}</b> at {{date}}.', context);
                },

                baseDueDateChanged: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> changed the baseline due date from <b>{{oldValue}}</b> to <b>{{value}}</b> at {{date}}.', context);
                },
                baseDueDateSet: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> set the baseline due date to <b>{{value}}</b> at {{date}}.', context);
                },
                baseCostChanged: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> changed the baseline cost from <b>{{oldValue}}</b> to <b>{{value}}</b> at {{date}}.', context);
                },
                baseCostSet: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> set the baseline cost to <b>{{value}}</b> at {{date}}.', context);
                },


                baseWorkTimeChanged: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> changed the baseline work time from <b>{{oldValue}}</b> to <b>{{value}}</b> at {{date}}.', context);
                },
                baseWorkTimeSet: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> set the baseline work time to <b>{{value}}</b> at {{date}}.', context);
                },

                documentStatusChanged: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> changed the document status from <b>{{oldValue}}</b> to <b>{{value}}</b> at {{date}}.', context);
                },
                documentStatusSet: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> set the document status to <b>{{value}}</b> at {{date}}.', context);
                },

                documenStartDateChanged: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> changed the document start date from <b>{{oldValue}}</b> to <b>{{value}}</b> at {{date}}.', context);
                },
                documenStartDateSet: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> set the document start date to <b>{{value}}</b> at {{date}}.', context);
                },

                documenDueDateChanged: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> changed the document due date from <b>{{oldValue}}</b> to <b>{{value}}</b> at {{date}}.', context);
                },
                documenDueDateSet: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> set the document due date to <b>{{value}}</b> at {{date}}.', context);
                },

                parentFolderChanged: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> moved this document from {{oldValue}} to {{value}} at {{date}}.', context);
                },
                parentFolderSet: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> moved this document to {{value}} at {{date}}.', context);
                },

                addedAssigneesSameUser: function (context) {
                    return gettextCatalog.getString('<b>{{user}}</b> self assigned this at {{date}}.', context);
                },

                addedAssigneesOtherUser: function (context) {
                    return gettextCatalog.getString('<b>{{user}}</b> assigned <b>{{name}}</b> at {{date}}.', context);
                },

                removedAssigneesSameUser: function (context) {
                    return gettextCatalog.getString('<b>{{user}}</b> removed their assignment at {{date}}.', context);
                },

                removedAssigneesOtherUser: function (context) {
                    return gettextCatalog.getString('<b>{{user}}</b> unassigned <b>{{name}}</b> at {{date}}.', context);
                },



                addedAttendeesSameUser: function (context) {
                    return gettextCatalog.getString('<b>{{user}}</b> has added themselves as an attendee at {{date}}', context);
                },

                addedAttendeesOtherUser: function (context) {
                    return gettextCatalog.getString('<b>{{user}}</b> has added <b>{{name}}</b> as an attendee at {{date}}', context);
                },

                removedAttendeesSameUser: function (context) {
                    return gettextCatalog.getString('<b>{{user}}</b> has removed themselves as an attendee at {{date}}', context);
                },

                removedAttendeesOtherUser: function (context) {
                    return gettextCatalog.getString('<b>{{user}}</b> has removed <b>{{name}}</b> as an attendee at {{date}}', context);
                },



                addedListenersSameUser: function (context) {
                    return gettextCatalog.getString('<b>{{user}}</b> started listening to this task at {{date}}.', context);
                },

                addedListenersOtherUser: function (context) {
                    return gettextCatalog.getString('<b>{{user}}</b> made <b>{{name}}</b> a listener at {{date}}.', context);
                },

                removedListenersSameUser: function (context) {
                    return gettextCatalog.getString('<b>{{user}}</b> stopped listening to this task at {{date}}.', context);
                },

                removedListenersOtherUser: function (context) {
                    return gettextCatalog.getString('<b>{{user}}</b> removed <b>{{name}}</b> as a listener at {{date}}.', context);
                },

                oneTimeListenerSameUser: function (context) {
                    return gettextCatalog.getString('<b>{{user}}</b> added themselves as a one time listener at {{date}}.', context);
                },

                oneTimeListenerOtherUser: function (context) {
                    return gettextCatalog.getString('<b>{{user}}</b> added <b>{{name}}</b> as a one time listener at {{date}}.', context);
                },


                addedAttachedFiles: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> attached the file {{attachment}} as version <b>{{version}}</b> at {{date}}.', context);
                },

                addedAttachedDocuments: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> attached document {{task}} at {{date}}.', context);
                },

                removedAttachedDocuments: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> unattached document {{task}} at {{date}}.', context);
                },

                addedChildFolders: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> added the folder {{task}} to this folder at {{date}}.', context);
                },

                removedChildFolders: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> removed the folder {{task}} from this folder at {{date}}.', context);
                },

                addedChildDocuments: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> added the document {{task}} to this folder at {{date}}.', context);
                },

                addedParentShares: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> created a shortcut to this document in the folder {{task}} at {{date}}.', context);
                },

                removedParentShares: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> removed a shortcut to this document from the folder {{task}} at {{date}}.', context);
                },

                addedChildShares: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> created a shortcut to {{task}} in this folder at {{date}}.', context);
                },

                removedChildShares: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> deleted a shortcut to {{task}} from this folder at {{date}}.', context);
                },

                addedAssociates: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> associated this with {{task}} at {{date}}.', context);
                },

                removedAssociates: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> removed the association with {{task}} at {{date}}.', context);
                },

                addedParentTasks: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> added this to the {{task}} project at {{date}}.', context);
                },

                removedParentTasks: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> removed this from the {{task}} project at {{date}}.', context);
                },

                addedChildTasks: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> added the subtask {{task}} at {{date}}.', context);
                },

                removedChildTasks: function (context) {
                    return gettextCatalog.getString(
                        '<b>{{user}}</b> removed the subtask {{task}} at {{date}}.', context);
                }
            };
        }

        var translationFunctions = createTranslationFunctions();

        return {
            restrict: 'E',
            terminal: true,
            compile: function compile(tElement, tAttrs, tTransclude) {
                logger.trace(".directive('pstTaskReplyAudit':compile");

                return function (scope, element, attrs, ctrl) {
                    logger.trace(".directive('pstTaskReplyAudit':compile return");
                    var reply = ctrl.reply();

                    var isMeeting = ctrl.mode() === 'meeting';

                    var replyUserName;
                    var auditUserName;

                    var userFullName = reply.contributor.name;
                    if (angular.isUndefined(userFullName) || userFullName === null || userFullName === '') {
                        replyUserName = reply.contributor.loginName;
                        auditUserName = replyUserName;
                    } else {
                        replyUserName = userFullName + ' (' + reply.contributor.loginName + ')';
                        auditUserName = userFullName;
                    }

                    var createdDateString = timeToStringFilter(reply.created);

                    var template = '';
                    var tf = translationFunctions;

                    if (reply.isPseudoReply) {
                        var pseudoReplyChanges = reply.pseudoReplyChanges;
                        var transFunc;
                        for (var i = 0; i < pseudoReplyChanges.length; i++) {
                            var change = pseudoReplyChanges[i];
                            switch (change.relationType) {
                                case 'associateTask':
                                    transFunc = change.added ? tf.addedAssociates : tf.removedAssociates;
                                    break;
                                case 'parentTask':
                                    transFunc = change.added ? tf.addedParentTasks : tf.removedParentTasks;
                                    break;
                                case 'childTask':
                                    transFunc = change.added ? tf.addedChildTasks : tf.removedChildTasks;
                                    break;
                                case 'attachedDocumentTask':
                                    transFunc = change.added ? tf.addedAttachedDocumentTasks : tf.removedAttachedDocuments;
                                    break;
                                case 'parentFolder':
                                    transFunc = tf.parentFolderSet;
                                    break;
                                case 'childDocument':
                                    transFunc = change.added ? tf.addedChildDocuments : tf.removedChildDocuments;
                                    break;
                                case 'childFolder':
                                    transFunc = change.added ? tf.addedChildFolders : tf.removedChildFolders;
                                    break;
                                case 'parentDocumentShare':
                                    transFunc = change.added ? tf.addedParentShares : tf.removedParentShares;
                                    break;
                                case 'childDocumentShare':
                                    transFunc = change.added ? tf.addedChildShares : tf.removedChildShares;
                                    break;
                            }

                            template += generatePseudoReplyRelationChange(change, transFunc);
                        }
                    } else {
                        if (angular.isDefined(reply.text) && reply.text !== null && reply.text !== '') {
                            template = '<md-card>' +
                                '<md-card-content class="reply-body">' +
                                '<div class="originator reply-header">' +
                                '<span class="reply-number">' + reply.id + '</span>' +
                                '<span class="reply-contributor">' + replyUserName + '</span>' +
                                '<span class="date-stamp">' + createdDateString + '</span>' +
                                '</div>' +
                                '<div class="' + (reply.isMarkdown ? 'reply-text-markdown' : 'reply-text-plain') + '">' +
                                (reply.isMarkdown
                                    ? $sanitize($showdown.makeHtml(reply.text))
                                    : '<p>' + plaintextToHtml.makeHtml(emptyCheckerFilter(reply.text))) + '</p>' +
                                '</div>' +
                                '</md-cardcontent->' +
                                '</md-card>';
                        }

                        // Fields
                        if (reply.id !== 1) {
                            template += generateFieldTemplate(auditUserName, createdDateString, reply.title, tf.titleChanged, tf.titleSet);
                            template += generateFieldTemplate(auditUserName, createdDateString, reply.rolledUp, tf.rollupSet, tf.rollupSet);
                        }

                        template += generateFieldTemplate(auditUserName, createdDateString, reply.status, tf.statusChanged, tf.statusSet, statusFilter);
                        template += generateFieldTemplate(auditUserName, createdDateString, reply.priority, tf.priorityChanged, tf.prioritySet);

                        if (isMeeting) {
                            template += generateFieldTemplate(auditUserName, createdDateString, reply.startDate, tf.meetingStartTimeChanged, tf.meetingStartTimeSet, timeToStringFilter);
                            template += generateFieldTemplate(auditUserName, createdDateString, reply.dueDate, tf.meetingEndTimeChanged, tf.meetingEndTimeSet, timeToStringFilter);
                        } else {
                            template += generateFieldTemplate(auditUserName, createdDateString, reply.startDate, tf.startDateChanged, tf.startDateSet, dateToStringFilter);
                            template += generateFieldTemplate(auditUserName, createdDateString, reply.dueDate, tf.dueDateChanged, tf.dueDateSet, dateToStringFilter);
                        }

                        template += generateFieldTemplate(auditUserName, createdDateString, reply.complete, tf.completeChanged, tf.completeSet, percentCompleteFilter);
                        template += generateFieldTemplate(auditUserName, createdDateString, reply.workTime, tf.workTimeChanged, tf.workTimeSet, workTimeFilter);
                        template += generateFieldTemplate(auditUserName, createdDateString, reply.actualWorktime, tf.actualWorkTimeChanged, tf.actualWorkTimeSet, workTimeFilter);
                        template += generateFieldTemplate(auditUserName, createdDateString, reply.cost, tf.costChanged, tf.costSet);
                        template += generateFieldTemplate(auditUserName, createdDateString, reply.actualCost, tf.actualCostChanged, tf.actualCostSet);
                        template += generateFieldTemplate(auditUserName, createdDateString, reply.baseStartDate, tf.baseStartDateChanged, tf.baseStartDateSet, timeToStringFilter);
                        template += generateFieldTemplate(auditUserName, createdDateString, reply.baseDueDate, tf.baseDueDateChanged, tf.baseDueDateSet, timeToStringFilter);
                        template += generateFieldTemplate(auditUserName, createdDateString, reply.baseCost, tf.baseCostChanged, tf.baseCostSet);
                        template += generateFieldTemplate(auditUserName, createdDateString, reply.baseWorkTime, tf.baseWorkTimeChanged, tf.baseWorkTimeSet);
                        template += generateFieldTemplate(auditUserName, createdDateString, reply.documentStatus, tf.documentStatusChanged, tf.documentStatusSet, documentStatusFilter);
                        template += generateFieldTemplate(auditUserName, createdDateString, reply.documentStartDate, tf.documenStartDateChanged, tf.documentStatusSet, timeToStringFilter);
                        template += generateFieldTemplate(auditUserName, createdDateString, reply.documentDueDate, tf.documenDueDateChanged, tf.documenDueDateSet, timeToStringFilter);
                        template += generateFieldTemplate(auditUserName, createdDateString, reply.parentFolder, tf.parentFolderChanged, tf.parentFolderSet, taskToLinkFilter);

                        // Users
                        if (isMeeting) {
                            template += generateUserCollection(auditUserName, createdDateString, reply.contributor, reply.addedAssignees, tf.addedAttendeesSameUser, tf.addedAttendeesOtherUser);
                            template += generateUserCollection(auditUserName, createdDateString, reply.contributor, reply.removedAssignees, tf.removedAttendeesSameUser, tf.removedAttendeesOtherUser);
                        } else {
                            template += generateUserCollection(auditUserName, createdDateString, reply.contributor, reply.addedAssignees, tf.addedAssigneesSameUser, tf.addedAssigneesOtherUser);
                            template += generateUserCollection(auditUserName, createdDateString, reply.contributor, reply.removedAssignees, tf.removedAssigneesSameUser, tf.removedAssigneesOtherUser);
                        }

                        template += generateUserCollection(auditUserName, createdDateString, reply.contributor, reply.addedListeners, tf.addedListenersSameUser, tf.addedListenersOtherUser);
                        template += generateUserCollection(auditUserName, createdDateString, reply.contributor, reply.removedListeners, tf.removedListenersSameUser, tf.removedListenersOtherUser);
                        template += generateUserCollection(auditUserName, createdDateString, reply.contributor, reply.oneTimeListeners, tf.oneTimeListenerSameUser, tf.oneTimeListenerOtherUser);

                        // Attachements
                        template += generateAttachmentCollection(auditUserName, createdDateString, reply.addedAttachedFiles, tf.addedAttachedFiles);
                        template += generateRelationCollection(auditUserName, createdDateString, reply.addedAttachedDocuments, tf.addedAttachedDocuments);
                        template += generateRelationCollection(auditUserName, createdDateString, reply.removedAttachedDocuments, tf.removedAttachedDocuments);

                        // Relations
                        template += generateRelationCollection(auditUserName, createdDateString, reply.addedChildFolders, tf.addedChildFolders);
                        template += generateRelationCollection(auditUserName, createdDateString, reply.removedChildFolders, tf.removedChildFolders);
                        template += generateRelationCollection(auditUserName, createdDateString, reply.addedChildDocuments, tf.addedChildDocuments);
                        template += generateRelationCollection(auditUserName, createdDateString, reply.addedParentShares, tf.addedParentShares);
                        template += generateRelationCollection(auditUserName, createdDateString, reply.removedParentShares, tf.removedParentShares);
                        template += generateRelationCollection(auditUserName, createdDateString, reply.addedChildShares, tf.addedChildShares);
                        template += generateRelationCollection(auditUserName, createdDateString, reply.removedChildShares, tf.removedChildShares);
                        template += generateRelationCollection(auditUserName, createdDateString, reply.addedAssociates, tf.addedAssociates);
                        template += generateRelationCollection(auditUserName, createdDateString, reply.removedAssociates, tf.removedAssociates);
                        template += generateRelationCollection(auditUserName, createdDateString, reply.addedParentTasks, tf.addedParentTasks);
                        template += generateRelationCollection(auditUserName, createdDateString, reply.removedParentTasks, tf.removedParentTasks);
                        template += generateRelationCollection(auditUserName, createdDateString, reply.addedChildTasks, tf.addedChildTasks);
                        template += generateRelationCollection(auditUserName, createdDateString, reply.removedChildTasks, tf.removedChildTasks);
                    }

                    template += '</div>';
                    element[0].innerHTML = template;
                    element.find('pre code').each(function (i, block) {
                        var pre = block.parentElement;
                        var classes = block.className.split(' ');
                        var language = '';
                        var langClasses = classes.filter(function (value, index) {
                            // Essentially, value.startsWith()
                            if (value.lastIndexOf('language-', 0) === 0) {
                                language = value.substr(9);
                                return true;
                            }

                            return false;
                        });
                        if (langClasses && langClasses.length > 0) {
                            pre.classList.add(langClasses[0]);
                        }

                        if (language === '') {
                            pre.classList.add('language-unspecified');
                            var message = document.createAttribute('message');
                            message.value = gettextCatalog.getString('Unspecified language');
                            pre.attributes.setNamedItem(message);
                            block.classList.add('hljs');
                        } else if (syntaxHighlightLanguages.indexOf(language) === -1) {
                            pre.classList.add('language-unsupported');
                            var message = document.createAttribute('message');
                            message.value = gettextCatalog.getString('Unsupported language');
                            pre.attributes.setNamedItem(message);
                            block.classList.add('hljs');
                        }

                        hljs.highlightBlock(block);
                    });
                }
            },
            controller: function ($element, $attrs, $transclude) {
                logger.trace(".directive('pstTaskReplyAudit':controller");
            },
            controllerAs: 'ctrl',
            bindToController: true,
            transclude: false,
            scope: {
                reply: '&',
                mode: '&'
            }
        };
    });
})();
