/* global angular */
(function () {
    'use strict';
    var contains = function (array, element) {
        return array.some(function (arrayElement) {
            return angular.equals(arrayElement, element);
        });
    };

    var arrayDiff = function (first, second) {
        return first.filter(function (element) {
            return !contains(second, element);
        });
    };

    function getTaskReplyProperties(that) {
        var getReadOnlyPropertyDef = function (propertyName) {
            var getter = that._getProperty.bind(that, propertyName);

            return {
                enumerable: true,
                get: getter
            };
        };

        var getWritablePropertyDef = function (propertyName) {
            var setter = that._setProperty.bind(that, propertyName);

            return angular.extend(
                getReadOnlyPropertyDef(propertyName), {
                    set: setter
                });
        };

        var getDurationPropertyDef = function (propertyName, startField, dueField) {
            return {
                enumerable: false,
                get: function () {
                    var start = that._getProperty(startField);
                    var due = that._getProperty(dueField);

                    if (angular.isDefined(start) &&
                        angular.isDefined(due) &&
                        typeof (due) !== 'string' &&
                        typeof (start) !== 'string' &&
                        due !== null) {
                        var duePlusOne = new Date(due);
                        duePlusOne.setDate(due.getDate() + 1);
                        return (duePlusOne - start) / 1000;
                    }
                    return undefined;
                }
            };
        };

        var getRemainingPropertyDef = function (propertyName, actualField, totalField) {
            return {
                enumerable: false,
                get: function () {
                    var actual = that._getProperty(actualField);
                    var total = that._getProperty(totalField);
                    if (angular.isDefined(actual) && angular.isDefined(total)) {
                        var remaining = total - actual;
                        //Round to two decimal places (this approach will not add .00 if there is nothing to round)
                        //500.3456 -> 500.34
                        //500 -> 500
                        return Number(Math.round(remaining + 'e' + 2) + 'e-' + 2);
                    }
                    return undefined;
                }
            };
        };

        return {
            id: getWritablePropertyDef('id'),
            originator: getWritablePropertyDef('originator'),
            createdDate: getWritablePropertyDef('createdDate'),
            updatedDate: getWritablePropertyDef('updatedDate'),
            topicCode: getWritablePropertyDef('topicCode'),
            taskCode: getWritablePropertyDef('taskCode'),


            baseCost: getWritablePropertyDef('baseCost'),
            baseDueDate: getWritablePropertyDef('baseDueDate'),
            baseStartDate: getWritablePropertyDef('baseStartDate'),
            baseDuration: getDurationPropertyDef('duration', 'baseStartDate', 'baseDueDate'),
            baseWorkTime: getWritablePropertyDef('baseWorkTime'),
            complete: getWritablePropertyDef('complete'),

            actualWorkTime: getWritablePropertyDef('actualWorkTime', 'workTime'),
            workTime: getWritablePropertyDef('workTime'),
            remainingWorkTime: getRemainingPropertyDef('remainingWorkTime', 'actualWorkTime', 'workTime'),

            actualCost: getWritablePropertyDef('actualCost', 'cost'),
            cost: getWritablePropertyDef('cost'),
            remainingCost: getRemainingPropertyDef('remainingCost', 'actualCost', 'cost'),

            priority: (function () {
                var def = getWritablePropertyDef('priority');
                var setter = def.set;
                def.set = function (val) {
                    var parsedVal = Number(val);
                    setter(parsedVal);
                };
                return def;
            })(),
            rolledUp: getWritablePropertyDef('rolledUp'),
            startDate: getWritablePropertyDef('startDate'),
            dueDate: getWritablePropertyDef('dueDate'),
            duration: getDurationPropertyDef('duration', 'startDate', 'dueDate'),
            status: getWritablePropertyDef('status'),
            title: getWritablePropertyDef('title'),
            documentType: getWritablePropertyDef('documentType'),
            replyText: getWritablePropertyDef('replyText'),
            assignees: getWritablePropertyDef('assignees'),
            listeners: getWritablePropertyDef('listeners'),
            associates: getWritablePropertyDef('associates'),
            childTasks: getWritablePropertyDef('childTasks'),
            parentTasks: getWritablePropertyDef('parentTasks'),
            attachedDocumentTasks: getWritablePropertyDef('attachedDocumentTasks'),
            attachedDocumentFolders: getWritablePropertyDef('attachedDocumentFolders'),

            childDocuments: getWritablePropertyDef('childDocuments'),
            childSharedDocuments: getWritablePropertyDef('childSharedDocuments'),
            parentFolder: getWritablePropertyDef('parentFolder'),
            childFolders: getWritablePropertyDef('childFolders'),
            childSharedFolders: getWritablePropertyDef('childSharedFolders'),

            addedAttachedFiles: getWritablePropertyDef('addedAttachedFiles'),
            fileAttachments: getWritablePropertyDef('fileAttachments')
        };
    }

    angular.module('psteam.common.tasks.taskReply', [
        'psteam.common.tasks.taskFields',
        'psteam.common.services.task'
    ])

        .factory('TaskReplyFactory', function (TaskFieldTypes, TaskFields, $q, TaskService, $log) {
            var isReadOnly = function (field) {
                return TaskFields[field].type === TaskFieldTypes.READ_ONLY;
            };

            var isRollupField = function (field) {
                return TaskFields[field].rollup === true;
            };

            var isWritable = function (field) {
                return TaskFields[field].type === TaskFieldTypes.WRITABLE;
            };

            var isList = function (field) {
                var thing = TaskFields[field];
                if (thing) {
                    return thing.type === TaskFieldTypes.LIST;
                }

                return false;
            };

            var taskDiffAttachments = function (old, updated) {
                var oldAttachments = old['fileAttachments'];
                var newAttachments = updated['fileAttachments'];

                var addedAttachments = arrayDiff(newAttachments, oldAttachments);
                return addedAttachments;
            };

            var taskDiff = function (old, updated) {
                var rolledUp = updated.rolledUp;
                var result = Object.keys(updated)
                    .filter(function (field) {
                        var original = angular.isDefined(old[field]) ?
                                       old[field] : [];
                        var newValue = updated[field];

                        return !angular.equals(original, newValue);
                    })
                    .reduce(function (res, field) {
                        if (isReadOnly(field)) {
                            return res;
                        }

                        if (isWritable(field)) {
                            if (!rolledUp) {
                                res[field] = updated[field];
                            } else if (!isRollupField(field)) {
                                res[field] = updated[field];
                            }
                            return res;
                        }

                        if (isList(field)) {
                            var newValue = updated[field];
                            var original = old[field];
                            var newElements = arrayDiff(newValue, original);
                            var removedElements = arrayDiff(original,
                                newValue);

                            if (newElements.length > 0) {
                                res[TaskFields[field].list.added] = newElements;
                            }

                            if (removedElements.length > 0) {
                                res[TaskFields[field].list.removed] =
                                    removedElements;
                            }

                            return res;
                        }
                    }, {});
                return result;
            };

            var TaskReply = function (task) {
                var that = this;
                var deferred = $q.defer();
                this.promise = deferred.promise;

                this._task = {};
                this.taskReplyValues = {};
                this.properties = getTaskReplyProperties(this);

                Object.defineProperties(this, this.properties);
                that.taskStartDate = task.startDate;
                that.taskDueDate = task.dueDate;
                that.taskCost = task.cost;
                that.taskRemainingCost = task.cost - task.actualCost;
                that.taskWorkTime = task.workTime;
                that.taskRemainingWorkTime = task.workTime - task.actualWorkTime;

                $q.when(task)
                    .then(function (res) {
                        that._task = res;

                        Object.keys(that.properties).reduce(function (res, field) {
                            if (angular.isDefined(that._task[field])) {
                                res[field] = angular.copy(that._task[field]);
                            } else {
                                // set default value
                                if (isList(field)) {
                                    res[field] = [];
                                }
                            }
                            return res;
                        }, that);

                        deferred.resolve(that);
                    }, deferred.reject);

                this.rollupChanged = function () {

                    if (this.rolledUp && that.childTasks.length != 0) {
                        var childTaskCodes = [];
                        for (var i = 0; i < that.childTasks.length; i++) {
                            var child = that.childTasks[i];
                            childTaskCodes.push(child.topicCode + '#' + child.id.toString());
                        }
                        that.taskStartDate = that.startDate;
                        that.taskDueDate = that.dueDate;
                        that.taskCost = that.cost;
                        that.taskRemainingCost = that.cost - that.actualCost;
                        that.taskWorkTime = that.workTime;
                        that.taskRemainingWorkTime = that.workTime - that.actualWorkTime;
                        TaskService.calculateRollupFromChildren(childTaskCodes)
                            .then(function (res) {
                                that.startDate = new Date(res.start);
                                that.dueDate = new Date(res.due);
                                that.cost = res.cost;
                                that.actualCost = res.cost - res.remainingCost;
                                that.workTime = res.work;
                                that.actualWorkTime = res.work - res.remainingWork;

                            }, function (reason) {
                                $log.error(reason);
                            });
                    } else {
                        that.startDate = that.taskStartDate;
                        that.dueDate = that.taskDueDate;
                        that.cost = that.taskCost;
                        that.actualCost = that.taskCost - that.taskRemainingCost;
                        that.workTime = that.taskWorkTime;
                        that.actualWorkTime = that.taskWorkTime - that.taskRemainingWorkTime;
                    }
                };
            };

            TaskReply.prototype = {
                _getProperty: function (property) {
                    if (this.taskReplyValues.hasOwnProperty(property)) {
                        return this.taskReplyValues[property];
                    }

                    return this._task[property];
                },

                _setProperty: function (property, newValue) {
                    this.taskReplyValues[property] = newValue;
                },

                getReply: function () {
                    var taskReplyValues = taskDiff(this._task, this.taskReplyValues);

                    return angular.extend(taskReplyValues, {
                        topicCode: this._task.topicCode,
                        id: this._task.id
                    });

                },

                isUpdated: function () {
                    var oldTaskValues = this._task;
                    var currentTaskValues = this.taskReplyValues;
                    var changes = taskDiff(oldTaskValues, currentTaskValues);
                    if ((changes.replyText !== undefined) && (changes.replyText.length === 0)) {
                        delete changes.replyText;
                    }
                    return (Object.keys(changes).length > 0);
                },

                updateReply: function (incomingReply) {
                    var localChanges = taskDiff(this._task, this.taskReplyValues);
                    var incomingChanges = taskDiff(this._task, incomingReply);
                    var addedAttachments = taskDiffAttachments(this._task, incomingReply);

                    var oldTaskValues = this._task;
                    var currentTaskValues = this.taskReplyValues;

                    if (addedAttachments && addedAttachments.length > 0) {
                        for (var i = 0; i < addedAttachments.length; i++) {
                            oldTaskValues['fileAttachments'].push(addedAttachments[i]);
                            currentTaskValues['fileAttachments'].push(addedAttachments[i]);
                        }
                    }

                    var collectionDict = {
                        addedAssignees: {property: 'assignees', change: 'add'},
                        removedAssignees: {property: 'assignees', change: 'remove'},
                        addedListeners: {property: 'listeners', change: 'add'},
                        removedListeners: {property: 'listeners', change: 'remove'},
                        addedAssociates: {property: 'associates', change: 'add'},
                        removedAssociates: {property: 'associates', change: 'remove'},
                        addedAttachedDocumentTasks: {property: 'attachedDocumentTasks', change: 'add'},
                        removedAttachedDocumentTasks: {property: 'attachedDocumentTasks', change: 'remove'},
                        addedChildTasks: {property: 'childTasks', change: 'add'},
                        removedChildTasks: {property: 'childTasks', change: 'remove'},
                        addedParentTasks: {property: 'parentTasks', change: 'add'},
                        removedParentTasks: {property: 'parentTasks', change: 'remove'},
                        addedChildDocuments: {property: 'childDocuments', change: 'add'},
                        removedChildDocuments: {property: 'childDocuments', change: 'remove'},
                        addedChildSharedDocuments: {property: 'childSharedDocuments', change: 'add'},
                        removedChildSharedDocuments: {property: 'childSharedDocuments', change: 'remove'},
                        addedChildFolders: {property: 'childFolders', change: 'add'},
                        removedChildFolders: {property: 'childFolders', change: 'remove'},
                        addedChildSharedFolders: {property: 'childSharedFolders', change: 'add'},
                        removedChildSharedFolders: {property: 'childSharedFolders', change: 'remove'}
                    };

                    angular.forEach(incomingChanges, function (propertyValue, propertyName, thing3) {
                        if (incomingChanges.hasOwnProperty(propertyName)) {

                            var collectionProperty = collectionDict[propertyName];
                            if (collectionProperty != null) {
                                // This is a collection property so we need to try and add/remove values.
                                var collectionName = collectionProperty.property;
                                var localCollection = localChanges[propertyName];

                                if (collectionProperty.change === 'add') {
                                    angular.forEach(incomingChanges[propertyName], function (val) {
                                        if (!localCollection || !localCollection.some(function (arrayVal) {
                                                return arrayVal.loginName === val.loginName;
                                            })) {
                                            oldTaskValues[collectionName].push(val);
                                            currentTaskValues[collectionName].push(val);
                                        }
                                    });
                                } else {
                                    var removedUsernames = incomingChanges[propertyName].map(function (obj) {
                                        return obj.loginName;
                                    });
                                    var changedOldTaskValues = oldTaskValues[collectionName].filter(function (obj) {
                                        return removedUsernames.indexOf(obj.loginName) === -1;
                                    });
                                    var changedCurrentTaskValues = currentTaskValues[collectionName].filter(function (obj) {
                                        return removedUsernames.indexOf(obj.loginName) === -1;
                                    });
                                    oldTaskValues[collectionName] = changedOldTaskValues;
                                    currentTaskValues[collectionName] = changedCurrentTaskValues;
                                }

                            } else {
                                if (!localChanges.hasOwnProperty(propertyName)) {
                                    // Incoming update has modified a field that the local client has not modified.
                                    // The update can be copied across to the old task and current task as it won't blow away any changes.
                                    oldTaskValues[propertyName] = propertyValue;
                                    currentTaskValues[propertyName] = propertyValue;
                                }
                            }
                        }
                    });
                }
            };

            return TaskReply;
        }
    );
})();
