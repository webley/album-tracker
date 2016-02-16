(function () {
    'use strict';
    angular.module('psteam.common.directives.pageSizeSelect', [
        'ui.router'
    ])

        .directive('pstPageSizeSelect', function (logger, $state) {
            logger.trace("directive('pstPageSizeSelect')");
            return {
                restrict: 'E',
                templateUrl: 'common/directives/page-size-select/page-size-select.tpl.html',
                scope: {
                    pageSize: '=pstPageSize',
                    change: '=?pstChange'
                },
                controller: function ($state) {
                    var that = this;
                    that.onChange = function (newPageSize) {
                        if (angular.isDefined(that.change)) {
                            that.change(newPageSize);
                        }

                        $state.go('.', {
                            pageSize: newPageSize
                        });
                    };
                },
                bindToController: true,
                controllerAs: 'ctrl'
            };
        });

})();
