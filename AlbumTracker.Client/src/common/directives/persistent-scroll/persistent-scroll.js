(function () {
    'use strict';

    angular.module('psteam.common.persistent-scroll.directive', [])
        .directive('pstPersistentScroll', function ($timeout, $mdUtil) {
            return {
                restrict: 'A',
                scope: {
                  scrollPos: '='
                },
                link: function ($scope, $element, $attrs, $ngModel) {
                  //save the scroll position to scope of the element
                  function updateScrollPosition() {
                    $scope.scrollPos = $element.scrollTop();
                  }
                  var debounceScroll = $mdUtil.debounce(updateScrollPosition, 100)
                  //debounce on element scroll
                  $element.bind("scroll", function() {
                      debounceScroll();
                  });
                  //wait until page loads to scroll on link
                  $timeout(function() {
                    $element.scrollTop($scope.scrollPos);
                  });
                }
            };
        });
})();
