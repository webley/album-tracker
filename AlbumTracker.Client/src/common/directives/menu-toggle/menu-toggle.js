(function () {
    'use strict';

    angular.module('psteam.common.directives.pstMenuToggle', [])

        .directive('pstMenuToggle', function ($timeout) {
            return {
                restrict: 'E',
                templateUrl: 'common/directives/menu-toggle/menu-toggle.tpl.html',
                scope: {
                    section: '=',
                    callback: '=',
                    childCallback: '='
                },
                link: function($scope, $element) {
                  var controller = $element.parent().controller();

                  $scope.isOpen = function() {
                    return $scope.section.open;
                  };
                  $scope.toggle = function() {
                    $scope.callback($scope.section);
                    if(!$scope.section.open) {
                      $scope.section.open = true;
                    } else {
                      $scope.section.open = false;
                    }
                  };
                  $scope.$watch(
                      function () {
                        return $scope.section.open;
                      },
                      function (open) {
                        var $list = $element.find('md-list');
                        var targetHeight = open ? getTargetHeight() : 0;
                        $timeout(function () {
                          $list.css({ height: targetHeight + 'px' });
                        }, 0, false);

                        function getTargetHeight () {
                          var targetHeight;
                          $list.addClass('no-transition');
                          $list.css('height', '');
                          targetHeight = $list.prop('clientHeight');
                          $list.css('height', 0);
                          $list.removeClass('no-transition');
                          return targetHeight;
                        }
                      }
                  );
                }
            };
        }
    );

})();
