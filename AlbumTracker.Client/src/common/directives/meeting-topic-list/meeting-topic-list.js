(function () {

    angular.module('psteam.common.directives.meetingTopicList', [])

        .directive('pstMeetingTopicList', function () {
            return {
                restrict: 'E',
                templateUrl: 'common/directives/meeting-topic-list/meeting-topic-list.tpl.html'
            };
        })
})();
