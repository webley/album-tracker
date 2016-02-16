angular.module('psteam.common.factories.taskInit',
    [
        'psteam.common.dalValidationMessages',
        'psteam.common.tasks.taskReply',
        'psteam.common.repositories.tasks',
        'psteam.common.services.task',
        'psteam.common.markdown-link.service'
    ])
    .factory('TaskInitFactory',
        function (logger,
                  $q,
                  $state,
                  TaskReplyFactory,
                  TaskCodeFactory,
                  TaskService,
                  toastService,
                  gettextCatalog,
                  $animate,
                  dal,
                  markdownLinkService) {

            logger.trace('TaskInitFactory');

            function setTaskReply(that, newTaskReply) {

                logger.trace('TaskInitFactory.setTaskReply', newTaskReply);

                $q.when(newTaskReply).then(function (res) {

                    logger.trace('TaskInitFactory.setTaskReply:$q.when', res);

                    res.addedAttachedFiles = [];

                    // FIXME: bullshit version of dal integration (just to make validation work so guys could continue their work)
                    // it's not right to do that! do not copy this code!
                    dal.newModelFromServerObject('TaskReplyModel', res).then(function (model) {

                        model.$model = res;

                        that.taskReplyDalModel = model;
                        that.taskReply = model.$model;
                        that.taskReply.uploadSessions = [];

                        that.resetViewModel();
                    });
                });
            }

            function setTaskReplyFromTask(that, task, setTaskReplyCallback) {

                logger.trace('TaskInitFactory.setTaskReplyFromTask', task);

                if (setTaskReplyCallback === undefined) {
                    setTaskReply(that, new TaskReplyFactory(task).promise);
                } else {
                    setTaskReplyCallback(new TaskReplyFactory(task).promise);
                }
            }

            function setTaskHistory(that, newTaskHistory) {

                logger.trace('TaskInitFactory.setTaskHistory', newTaskHistory);

                $q.when(newTaskHistory).then(function (res) {

                    logger.trace('TaskInitFactory.setTaskHistory:$q.when', res);

                    res.reverse = that.reverse;

                    that.taskHistory = res;

                    if (that.loaded) {
                        $animate.enabled(true);
                    }

                    that.loaded = true;
                });
            }

            // setTaskReplyCallback - crutch to be compatible with code of folder.js
            function saveTask(that, taskReply, markdown, setTaskReplyCallback) {

                logger.trace('TaskInitFactory.saveTask');

                return that.taskReply.promise.then(function () {

                    var taskCode = that.taskReply.taskCode;

                    var reply = that.taskReply.getReply();

                    reply.replyTextIsMarkdown = markdown;

                    markdownLinkService.replace(reply, that.viewModel.documents.fileAttachments);

                    return TaskService
                        .saveTasks([
                            reply
                        ])
                        .then(function (res) {

                            logger.trace('TaskInitFactory.saveTask:TaskService.saveTasks.onSuccess', res);

                            if (res.submittedTasks.length > 0) {

                                taskReply.taskCode = new TaskCodeFactory(res.submittedTasks[0].taskCode.topicCode, res.submittedTasks[0].taskCode.taskID);

                                taskCode = taskReply.taskCode.toString();

                                $state.params.id = taskReply.taskCode.taskId;

                                $state.transitionTo($state.current, $state.params, {
                                    inherit: true,
                                    notify: true
                                });

                                setTaskReplyFromTask(that, TaskService.getTask(taskCode), setTaskReplyCallback);

                                setTaskHistory(that, TaskService.getTaskHistory(taskCode));
                            }

                            toastService.success(gettextCatalog.getString('Your task reply has been saved.'));

                        }, function (error) {

                            logger.error('TaskInitFactory.saveTask:TaskService.saveTasks.onError', error);

                            toastService.error(gettextCatalog.getString('Your task reply could not be saved.'));
                        });
                });
            }

            function callbackQueue(that, notification) {
                logger.trace('TaskInitFactory.callbackQueue.registerCallback', notification);

                var incomingTaskCode = new TaskCodeFactory(
                    notification.taskCode.TopicCode,
                    notification.taskCode.ID
                );

                if (incomingTaskCode.equals(that.taskReply.taskCode)) {
                    toastService.warning(gettextCatalog.getString('This task has been updated by someone else'));
                    TaskService.getTask(incomingTaskCode.toString()).then(function (taskData) {
                        that.taskReply.updateReply(taskData);
                    });

                    setTaskHistory(
                        that,
                        TaskService.getTaskHistory(
                            incomingTaskCode.toString())
                    );
                }
            }

            return {
                setTaskReply: setTaskReply,
                setTaskHistory: setTaskHistory,
                saveTask: saveTask,
                callbackQueue: callbackQueue
            };
        }
    );
