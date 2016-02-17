(function() {
    'use strict';
    angular.module('app.handSelector', [
        'app.handRankingService',
        'app.cardService',
        'app.cardDirective'])

        .config(['$stateProvider', function($routeProvider) {
			$stateProvider.state('handSelector', {
				parent: 'app',
				url: '/handSelector',
				onEnter: function (PageTitleService, task) {
					PageTitleService.setPageTitle(task.title);
				},
				controller: 'handSelectorController',
				controllerAs: 'ctrl',
				bindToController: true,
				reloadOnSearch: false,
				templateUrl: 'hand-selector/hand-selector.tpl.html'
			});
        }])

        .controller('handSelectorController', function(handRankingService, cardService) {
            var ctrl = this;
            var card1 = null;
            var card2 = null;
            ctrl.deck = cardService.getCards();
            ctrl.ranking = 0;

            ctrl.isSelected = function(cardShortName) {
                return card1 === cardShortName || card2 === cardShortName;
            };

            var cardToggle = true;

            function handleClick(card) {
                // Deselect card if already selected.
                if (card1 === card) {
                    card1 = null;
                    return;
                }
                if (card2 === card) {
                    card2 = null;
                    return;
                }

                // Set the selected card to the unselected position if one exists.
                if (card1 === null) {
                    card1 = card;
                    return;
                }
                if (card2 === null) {
                    card2 = card;
                    return;
                }

                // Toggle the cards in order if two are already selected.
                // This allows for predictable pair-click behaviour.
                if (cardToggle) {
                    card1 = card;
                } else {
                    card2 = card;
                }
                cardToggle = !cardToggle;
            }

            function calculate() {
                if (card1 && card2) {
                    ctrl.ranking = handRankingService.getHandRanking(card1, card2);
                } else {
                    ctrl.ranking = null;
                }
            }

            ctrl.cardClick = function(cardShortName) {
                handleClick(cardShortName);
                calculate();
            }

        });
})();