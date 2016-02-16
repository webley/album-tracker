(function() {
    'use strict';

    var suits = [
        {longName: 'Clubs', shortName: 'c'},
        {longName: 'Diamonds', shortName: 'd'},
        {longName: 'Spades', shortName: 's'},
        {longName: 'Hearts', shortName: 'h'}
    ];

    var cardValueConversions = {
        2: '2',
        3: '3',
        4: '4',
        5: '5',
        6: '6',
        7: '7',
        8: '8',
        9: '9',
        10: 'T',
        11: 'J',
        12: 'Q',
        13: 'K',
        14: 'A'
    };

    angular.module('app.cardService', [])
        .service('cardService', function() {
            var svc = this;

            var cards = [];

            function generateCards() {
                for (var i = 0; i <= 3; i++) {
                    var suit = suits[i];

                    for (var j = 2; j <= 14; j++) {
                        var cardValue = cardValueConversions[j];

                        var card = {
                            value: cardValue,
                            suit: suit.longName,
                            shortName: cardValue + suit.shortName
                        };

                        cards.push(card);
                    }
                }
            }

            generateCards();

            svc.getCards = function() {
                return angular.copy(cards);
            }
        })
})();