(function () {

    angular.module('psteam.common.directives.topicList', [])

        .directive('pstTopicListTestContainer', function () {
            return {
                restrict: 'E',
                templateUrl: 'common/directives/topic-list/topic-list.tpl.html'
            };
        })


        .directive('pstTopicListMD', function () {
            return {
                restrict: 'E',
                templateUrl: 'common/directives/topic-list/topic-list-mdlist.tpl.html'
            };
        })

        .directive('pstTopicListCards', function () {
            return {
                restrict: 'E',
                templateUrl: 'common/directives/topic-list/topic-list-cards.tpl.html'
            };
        })

        .directive('pstTopicListGrid', function () {
            return {
                restrict: 'E',
                templateUrl: 'common/directives/topic-list/topic-list-grid.tpl.html'
            };
        })

        .directive('pstTopicCardListGrid', function () {
            return {
                restrict: 'E',
                templateUrl: 'common/directives/topic-list/topic-list-card-grid.tpl.html'
            };
        });
})();
