(function () {
    'use strict';
    angular.module('psteam.common.meeting-users.directive', [])
        .directive('pstMeetingUsers', function ($timeout, $q, logger) {
            logger.trace(".directive('pstMeetingUsers')");
            return {
                require: 'ngModel',
                restrict: 'A',
                link: function (scope, element, attrs, ngModel, transcludeFn) {
                    logger.trace(".directive('pstMeetingUsers'):link");
                    var inProgress = false;

                    var optionAttr = document.createAttribute('ng-model-options');
                    optionAttr.value = "{ allowInvalid: true }";
                    element[0].children[0].attributes.setNamedItem(optionAttr);

                    var validateUser = function (user, start, end) {
                        var query = getMeetings(user);
                        var deferred = $q.defer();
                        query.then(function (data) {
                            for (var k in data) {
                                var meeting = data[k].task;
                                var startTime = new Date(meeting.startDate);
                                var endTime = new Date(meeting.dueDate);
                                var notSameTask = (scope.$eval(attrs.taskCode).topicCode !== meeting.topicCode)
                                    || (scope.$eval(attrs.taskCode).taskId !== meeting.taskId);
                                var meetingsOverlap = ((start >= startTime) && (start < endTime))
                                    || ((end <= endTime) && (end > startTime))
                                    || ((start <= startTime) && (end >= endTime));
                                if ((notSameTask) && (meetingsOverlap)) {
                                    deferred.resolve(user.name);
                                }
                            }
                            deferred.resolve(true);
                        });
                        return deferred.promise;
                    };

                    var runValidation = function (newCol) {
                        checkValidity(newCol).
                            then(function () {
                                ngModel.$setValidity('pstOverlap', true);
                            })
                            .catch(function () {
                                if (attrs.disabled !== true) {
                                  ngModel.$setValidity('pstOverlap', false);
                                }
                            });
                    };

                    scope.$watch(attrs.taskStatus, function (newStatus, oldStatus) {
                        if (newStatus !== undefined && newStatus != oldStatus) {
                            runValidation(scope.$eval(attrs.ngModel));
                        }
                    });

                    scope.$watchCollection(attrs.ngModel, function (newCol, oldCol) {
                        runValidation(newCol);
                    });

                    scope.$watch(attrs.taskStart, function (newStart, oldStatus) {
                        if (newStart !== undefined) {
                            runValidation(scope.$eval(attrs.ngModel));
                        }
                    });

                    scope.$watch(attrs.taskEnd, function (newEnd, oldStatus) {
                        if (newEnd !== undefined) {
                            runValidation(scope.$eval(attrs.ngModel));
                        }
                    });

                    var getMeetings = function (user) {
                        var searchFn = scope.$parent.$eval(attrs.meetingQuery);
                        var query = "select from tasks where (topictype = 'meeting') and (status != '3') and (status != '5') and (assignees = '" + user.loginName + "')";
                        return searchFn(query).then(function (data) {
                            return data.taskSearchResults;
                        });
                    };

                    var checkValidity = function (val) {
                        var meetingStart = scope.$eval(attrs.taskStart);
                        var meetingEnd = scope.$eval(attrs.taskEnd);

                        if (angular.isUndefined(val) ||
                            val === null ||
                            (typeof (val) === 'number' && isNaN(val))) {
                            return $q.resolve();
                        }

                        var status = scope.$eval(attrs.taskStatus);
                        var isMeetingOver = (status == "completed" || status == "deleted");

                        if (!isMeetingOver) {
                            var results = [];
                            for (var k in val) {
                                var user = val[k];
                                results.push(validateUser(user, meetingStart, meetingEnd));
                            }
                        }
                        return $q.all(results).then(function (arr) {
                            var usersList = [];
                            for (var i = 0; i < arr.length; i++) {
                                if (arr[i] !== true) {
                                    usersList.push(arr[i]);
                                }
                            }
                            if (usersList.length > 0) {
                                if (usersList.length > 1) {
                                    ngModel.errorMessage = usersList.join(', ') + " already have meetings at this time.";
                                } else {
                                    ngModel.errorMessage = usersList[0] + " already has a meeting at this time.";
                                }
                                return $q.reject();
                            }
                            return $q.resolve();
                        });
                    }
                }
            };
        });
})();
