(function () {
    'use strict';
    angular.module('psteam.task.controllers.history', [
        'psteam.common.repositories.files'
    ])

        .controller('TaskHistoryController', function ($timeout, $anchorScroll, $scope, FilesRepositoryService, logger) {
            logger.trace('TaskHistoryController');
            this.getFileUrl = function (file) {
                logger.trace('TaskHistoryController.getFileUrl', file);
                return FilesRepositoryService.getFileUrl(file.Id);
            };

            var scrollToReply = function (replyId) {
                
                //if we have no reply id we need to scroll to the latest reply 
                if (!replyId && $scope.history && $scope.history.taskReplies) {
                    replyId = $scope.history.taskReplies.length;
                }

                if (replyId) {
                    $anchorScroll("anchor" + replyId);
                }
            };

            //handle event of new reply submission to position on the new reply
            //when user's setting configured to show newest reply at the bottom
            //of task history
            var repliesWatch = $scope.$watch(
                function () { return $scope.history.taskReplies.length; },
                function (newValue, oldValue) {

                    if (newValue === oldValue && $scope.replyId) {

                        //we have the reply id passed in from scope (inferred from url parameter)
                        //and about to show the histories for the first time (not as a refresh after reply submission)
                        $timeout(function () { scrollToReply($scope.replyId); });

                    } else if (newValue !== oldValue || !$scope.reverse) {

                        //Scroll to the latest reply if it's not the reversed list
                        //of replies shown for the first time as the desired reply already visible
                        $timeout(function () { scrollToReply(); });

                    }
                });

            $scope.$on('$destroy', function () {
                repliesWatch();
            });

        });
})();
