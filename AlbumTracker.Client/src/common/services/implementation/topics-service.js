(function () {
    'use strict';
    angular.module('psteam.common.services.topics', ['psteam.common.repositories.topics'])

        .service('TopicsService', function (TopicsRepositoryService, logger, gettext, gettextCatalog) {
            logger.trace('TopicsService');
            this.getTopicList = function (type) {
                logger.trace('TopicsService.getTopicList', {
                    "type": type
                });
                return TopicsRepositoryService
                    .getTopicList(type)
                    .then(function (topics) {
                        logger.trace('TopicsService.getTopicList:TopicsRepositoryService.getTopicList.then', topics);
                        //tasks.forEach(
                        //    TaskTransformersService.transformTaskCodeString
                        //);

                        return topics;
                    });
            };

            this.getTopicDefinitions = function (topicCodeList) {
                logger.trace('TopicsService.getTopicDefinitions', topicCodeList);
                return TopicsRepositoryService
                    .getTopicDefinitions(topicCodeList)
                    .then(function (definiftions) {
                        logger.trace('TopicsService.getTopicDefinitions:TopicsRepositoryService.getTopicDefinitions.then', definiftions);
                        //tasks.forEach(
                        //    TaskTransformersService.transformTaskCodeString
                        //);

                        return definiftions;
                    });
            };

            this.getTopics = function (topicCodeList) {
                logger.trace('TopicsService.getTopics', topicCodeList);
                return TopicsRepositoryService
                    .getTopics(topicCodeList)
                    .then(function (topics) {
                        logger.trace('TopicsService.getTopics:TopicsRepositoryService.getTopics.then', topics);
                        //tasks.forEach(
                        //    TaskTransformersService.transformTaskCodeString
                        //);

                        return topics;
                    });
            };

            this.getTopicStatistics = function (topicCodeList) {
                logger.trace('TopicsService.getTopicStatistics', topicCodeList);
                return TopicsRepositoryService
                    .getTopicStatistics(topicCodeList)
                    .then(function (stat) {
                        return stat;
                    });
            };
            gettext('task');
            gettext('project');
            gettext('meeting');
            gettext('supplyChain');
            gettext('documentFolder');
            this.types = {
                task: gettextCatalog.getString("task"),
                project: gettextCatalog.getString("project"),
                meeting: gettextCatalog.getString("meeting"),
                supplyChanin: gettextCatalog.getString("supplyChain"),
                documentFolder: gettextCatalog.getString("documentFolder")
            };
            this.getTopicTypes = function() {
                return this.types;
            };
    });
})();
