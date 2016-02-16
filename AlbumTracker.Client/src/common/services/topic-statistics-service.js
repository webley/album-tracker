(function () {
    'use strict';
    angular.module('psteam.common.services.topicstatistics', ['psteam.common.services.topics'])
        .service('TopicStatisticsService', function (TopicsService) {
            //this is a service to cache statistics for topics of various types
            var topicStatistics = {};
            this.getTopicStatistics = function (type) {
              if(!topicStatistics.$$state || !topicStatistics.$$state.status) {
                var topics = TopicsService.getTopicList(type).then(function(data) {
                  var topicList = [];
                  for (var k in data.topicList) {
                    topicList.push(data.topicList[k].code);
                  }

                  return TopicsService.getTopicStatistics(topicList);
                });

                topicStatistics[type] = topics;
              }
              return topicStatistics[type];
            };
        });
})();
