(function () {
    'use strict';

    angular.module('psteam.common.directives.documentList', [])

        .directive('pstDocumentList', function () {
            return {
                restrict: 'E',
                templateUrl: 'common/directives/document-list/document-list.tpl.html',
                scope: {
                    data: '=pstListData',
                    onSort: '=pstOnSort',
                    order: '=pstOrder',
                    sortField: '=pstSortField',
                    sortByItems: '=pstSortByItems'
                },
                controllerAs: 'ctrl',
                bindToController: true,
                controller: function () {
                    this.showOptions = false;
                }

            }
        });
})();
