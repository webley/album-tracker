(function () {
    'use strict';
    angular.module('psteam.common.autocomplete.topic.directive', ['psteam.common.topicTypeIcon.filter'])

        .directive('pstTopicAutocomplete', function (logger) {
            logger.trace(".directive('pstTopicAutocomplete'");
            return {
                restrict: 'E',
                templateUrl: 'common/directives/topic-autocomplete/topic-autocomplete.tpl.html',
                transclude: true,
                scope: {
                    searchQuery: '&',
                    label: '@',
                    topics: '=topicsCollection',
                    disabled: '=?ngDisabled'
                },
                compile: function (tElem, tAttrs) {
                    logger.trace(".directive('pstTopicAutocomplete':compile");
                    var mdChips = tElem.find('md-chips')[0];
                    var appendAttr = document.createAttribute('md-on-append');
                    appendAttr.value = 'appendTopic($chip)';
                    mdChips.attributes.setNamedItem(appendAttr);

                    // Returned function is post-link.
                    return function (scope, element, attrs) {
                        logger.trace(".directive('pstTopicAutocomplete':compile return");
                        var searchFn = scope.searchQuery();
                        var topicDict = {};

                        // Add any already-bound objects to the dictionary, to prevent adding duplicates.
                        for (var i = 0; i < scope.topics.length; i++) {
                            var topic = scope.topics[i];
                            topicDict[topic.code] = topic;
                        }

                        scope.searchQuery = function (searchTerm) {
                            logger.trace(".directive('pstTopicAutocomplete':scope.searchQuery searchTerm = '%s'", searchTerm);
                            return searchFn(searchTerm).then(function (data) {
                                for (var i = 0; i < data.length; i++) {
                                    var topic = data[i];
                                    if (topicDict[topic.code] !== undefined) {
                                        data[i] = topicDict[topic.code];
                                    }
                                }

                                return data;
                            });
                        };

                        scope.appendTopic = function (topicChip) {
                            logger.trace(".directive('pstTopicAutocomplete':scope.appendTopic", topicChip);
                            topicDict[topicChip.code] = topicChip;
                            return topicChip;
                        }
                    }
                }
            };
        }
    );

})();
