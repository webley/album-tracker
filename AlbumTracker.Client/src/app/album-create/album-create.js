(function() {
    'use strict';
    angular.module('app.albumCreate', ['app.fileInputDirective'])
        .config(['$stateProvider', function($stateProvider) {
            $stateProvider.state('albumCreate', {
                parent: 'app',
                url: 'albumCreate',
                //onEnter: function (PageTitleService, task) {
                //	PageTitleService.setPageTitle('Poker hand selector');
                //},
                controller: 'albumCreateController',
                controllerAs: 'ctrl',
                bindToController: true,
                reloadOnSearch: false,
                templateUrl: 'app/album-create/album-create.tpl.html'
            });
        }])

        .controller('albumCreateController', function(handRankingService, cardService) {
            var ctrl = this;

            ctrl.albumArt = null;

            ctrl.click = function() {
                var art = ctrl.albumArt;
            };

            ctrl.filesSelected = function(files, dunno, whatever) {
                console.log(files.length);
            };
        });
})();
