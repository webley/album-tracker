angular.module('psteam.common.services.meeting', [])
    .service('meetingService', function (TaskService, LoginService, logger) {
        logger.trace("meetingService");
        this.getMeetingTasksForCurrentUser = function (start, end, page, pageSize) {
            logger.trace("meetingService.getMeetingTasksForCurrentUse", start, end);
            var userLogin = LoginService.currentUser.login;
            var query = 'select from tasks where topictype = \'meeting\' and assignees = \'' + userLogin + '\' and status != 3';

            if (start && end) {
                if (start instanceof Date) {
                    start = start.toJSON().replace(/\.\d+Z/, '');
                }
                if (end instanceof Date) {
                    end = end.toJSON().replace(/\.\d+Z/, '');
                }

                query += ' and duedate >= \'' + start + '\' and startdate <= \'' + end + '\'';
            }
            
            return TaskService.searchTasks(query, pageSize, page).then(function (data) {
                logger.trace("meetingService.getMeetingTasksForCurrentUse:TaskService.searchTasks.then.success", data);
                var tasks = data.taskSearchResults;
                var meetings = [];
                for (var i = 0; i < tasks.length; i++) {
                    var task = tasks[i].task;
                    var meeting = {
                        id: i,
                        taskCode: task.taskCode,
                        title: task.title,
                        assignees: task.assignees,
                        start: task.startDate,
                        end: task.dueDate,
                        topicType: 'meeting',
                        priority: task.priority
                    };
                    meetings.push(meeting);
                }

                return {
                    total: data.totalHits,
                    meetings: meetings
                }
            });
        };
        this.getMeetingTasksForTopic = function (code, start, end) {
            logger.trace("meetingService.getMeetingTasksForTopic", start, end);
            var query = 'select from tasks where topiccode=\'' + code + '\' and status != 3';

            if (start && end) {
                if (start instanceof Date) {
                    start = start.toJSON().replace(/\.\d+Z/, '');
                }
                if (end instanceof Date) {
                    end = end.toJSON().replace(/\.\d+Z/, '');
                }

                query += ' and duedate >= \'' + start + '\' and startdate <= \'' + end + '\'';
            }

            return TaskService.searchTasks(query).then(function (data) {
                logger.trace("meetingService.getMeetingTasksForTopic:TaskService.searchTasks.then.success", data);
                var tasks = data.taskSearchResults;
                var meetings = [];
                for (var i = 0; i < tasks.length; i++) {
                    var task = tasks[i].task;
                    var meeting = {
                        id: i,
                        taskCode: task.taskCode,
                        title: task.title,
                        assignees: task.assignees,
                        start: task.startDate,
                        end: task.dueDate,
                        topicType: 'meeting'
                    };
                    meetings.push(meeting);
                }

                return meetings;
            });
        };
    });
