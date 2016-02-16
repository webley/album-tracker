/* global angular */
(function () {
    'use strict';
    angular.module('psteam.common.repositories.topics', [
        'psteam.common.data-access.topics'
    ])
        .service('TopicsRepositoryService', function (TopicsDataAccessService,
                                                      logger) {
            logger.trace('TopicsRepositoryService');

            this.getTopicList = function (type) {
                logger.trace('TopicsRepositoryService.getTopicList', {
                    "type": type
                });
                return TopicsDataAccessService
                    .getTopicList(type)
                    .then(function (topics) {
                        logger.trace('TopicsRepositoryService.getTopicList:TopicsDataAccessService.getTopicList.then', topics);
                        //tasks.forEach(
                        //    TaskTransformersService.transformTaskCodeString
                        //);

                        return topics;
                    });
            };

            this.getTopicDefinitions = function (topicCodeList) {
                logger.trace('TopicsRepositoryService.getTopicDefinitions', topicCodeList);
                return TopicsDataAccessService
                    .getTopicDefinitions(topicCodeList)
                    .then(function (definiftions) {
                        logger.trace('TopicsRepositoryService.getTopicDefinitions:TopicsDataAccessService.getTopicDefinitions.then', definiftions);
                        //tasks.forEach(
                        //    TaskTransformersService.transformTaskCodeString
                        //);

                        return definiftions;
                    });
            };

            this.getTopics = function (topicCodeList) {
                logger.trace('TopicsRepositoryService.getTopics', topicCodeList);
                return TopicsDataAccessService
                    .getTopics(topicCodeList)
                    .then(function (topics) {
                        logger.trace('TopicsRepositoryService.getTopicDefinitions:TopicsDataAccessService.getTopics.then', topics);
                        //tasks.forEach(
                        //    TaskTransformersService.transformTaskCodeString
                        //);

                        return topics;
                    });
            };

            this.getTopicStatistics = function (topicCodeList) {
                logger.trace('TopicsRepositoryService.getTopicStatistics', topicCodeList);
                return TopicsDataAccessService
                    .getTopicStatistics(topicCodeList)
                    .then(function (stat) {
                        logger.trace('TopicsRepositoryService.getTopicDefinitions:TopicsDataAccessService.getTopicStatistics.then', stat);
                        return stat;
                    });
            };
        }
    );
})();
