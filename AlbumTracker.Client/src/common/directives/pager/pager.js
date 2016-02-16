(function () {
    'use strict';
    angular.module('psteam.common.directives.pager', [])

        .directive('pstPager', function (logger) {
            logger.trace("directive('pstPager')");
            return {
                restrict: 'E',
                templateUrl: 'common/directives/pager/pager.tpl.html',
                scope: {
                    page: '=pstPage',
                    lastPage: '=pstLastPage'
                },
                controller: function ($state) {
                    logger.trace("directive('pstPager'):controller");
                    var that = this;

                    function getPageUrl (page) {
                        return $state.href(
                            '.', {
                                page: page
                            }
                        );
                    }

                    that.getNextPageUrl = function () {
                        return getPageUrl(that.page + 1);
                    };

                    that.getPrevPageUrl = function () {
                        return getPageUrl(that.page - 1);
                    };

                    that.getFirstPageUrl = function () {
                        return getPageUrl(1);
                    };

                    that.getLastPageUrl = function () {
                        return getPageUrl(that.lastPage);
                    };

                },
                controllerAs: 'ctrl',
                bindToController: true
            };
        });
})();

