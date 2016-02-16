(function () {

    angular.module('psteam.common.directives.topicListEditor', [
        'psteam.common.autocomplete.topic.directive',
        'psteam.common.repositories.projects'
    ])
        .directive('pstTopicListEditor', function (TopicsService, TopicsDataAccessService, ProjectsRepositoryService, $state, TaskCodeFactory) {
            return {
                restrict: 'E',
                templateUrl: 'common/directives/topic-list-editor/topic-list-editor.tpl.html',
                controller: function ($state, logger) {
                    logger.trace("directive('pstTopicListEditor'):controller");
                    var that = this;
                    this.selectedItem = null;
                    var searchFn = this.topicType == 'project' ? ProjectsRepositoryService.autocompleteProjects : TopicsDataAccessService.autocompleteTopics;
                    

                    //remove duplicates from autocomplete
                    this.searchQuery = function (searchTerm) {
                        return searchFn(searchTerm, that.topicType).then(function (data) {
                            var result = [];
                            var codeList = [];

                            for(var i in that.topics) {
                              codeList[that.topics[i].code] = true;
                            }

                            for (var i = 0; i < data.length; i++) {
                                var item = data[i];
                                var code = that.topicType == 'project' ? item.taskCode : item.code;
                                if (!codeList[code]) {
                                    if (that.topicType == 'project') {
                                        result.push({
                                            code: item.taskCode,
                                            name: item.title
                                        });
                                    }
                                    else result.push(item);
                                }
                            }

                            return result;
                        });
                    };

                    if(that.topics == undefined) {
                      that.topics = [];
                    }


                    this.topicTypes = TopicsService.getTopicTypes();
                    var cancelEdit = function () {
                        cancelAdded();
                        if(that.editTopic) {
                          that.editTopic.edit = false;
                          that.editTopic = undefined;
                        }
                    }
                    var cancelAdded = function () {
                        if (!that.topicAdded) return;
                        that.topics.splice(0, 1);
                        that.topicAdded = false;
                    }
                    this.edit = function(topic) {
                        cancelEdit();
                        topic.edit = true;
                        that.editTopic = topic;
                    };
                    this.cancel = function(topic) {
                        topic.edit = false;
                        cancelAdded();
                    };
                    this.add = function() {
                        cancelEdit();
                        that.topicAdded = true;
                        that.topics.splice(0, 0, {edit: true});
                    };
                    this.delete = function (topic) {
                        cancelEdit();
                        var index = that.topics.indexOf(topic);
                        that.topics.splice(index, 1);
                        that.submit();
                    }
                    this.save = function(topic) {
                        topic.name = topic.selectedItem.name;
                        topic.code = topic.selectedItem.code;
                        if (that.topicType == 'project') {

                            var taskCode = TaskCodeFactory.fromString(topic.selectedItem.code);
                            topic.topicCode = taskCode.topicCode;
                            topic.id = taskCode.taskId;
                        }
                        topic.edit = false;
                        that.topicAdded = false;
                        that.submit();
                    };
                    this.getHRef = function(item)
                    {
                        if (that.topicType != 'project') {
                            return $state.href("topic", {topicCode:item.code}, {inherit:false});
                        }
                        var href = $state.href("task_update", {
                            topicCode: item.topicCode,
                            id: item.id
                        }, { inherit: false });
                        return href;
                    }
                },
                scope: {
                    topicType: "=",
                    topics: "=",
                    submit: "&"
                },
                controllerAs: 'ctrl',
                bindToController: true
            };
        });
})();
