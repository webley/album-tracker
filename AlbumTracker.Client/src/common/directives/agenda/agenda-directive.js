(function () {
    'use strict';
    angular.module('psteam.common.agenda.directive', [
        'psteam.common.filters.escape',
        'psteam.common.agenda.controller',
        'psteam.common.directives.pager',
    ]).directive('pstAgenda', function ($window, $mdMedia, logger) {
        logger.trace("directive('pstAgenda')");
        return {
            restrict: 'E',
            templateUrl: 'common/directives/agenda/agenda.tpl.html',
            scope: {
                data: '=',
            },
            controller: 'AgendaController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    });
})();
