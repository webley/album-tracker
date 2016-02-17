(function() {
    'use strict';

    angular.module('app.cardDirective', [])
        .directive('wblCard', function() {
            return {
                //require: 'cardValue',
                restrict: 'E',
                scope: {
                    cardValue: '=',
                    selected: '&'
                },
                bindToController: true,
                templateUrl: 'components/card/card-directive.tpl.html',
                controller: function($scope) {
                    //this.cardValue = $scope.cardValue;
                    this.imgLoc = 'assets/cards/' + this.cardValue + '.svg';
                },
                link: function link(scope, element, attrs) {
                    //scope.ctrl.cardValue = scope.cardValue;
                },
                controllerAs: 'ctrl'
            };
        })
})();