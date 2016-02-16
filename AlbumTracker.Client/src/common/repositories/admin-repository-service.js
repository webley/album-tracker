(function () {
    'use strict';
    angular.module('psteam.common.repositories.admin', [
        'psteam.common.data-access.admin'
    ])
        .service('AdminRepositoryService',
        function (AdminDataAccessService, logger) {
            logger.trace('AdminRepositoryService');

            this.isUserAdmin = function () {
                logger.trace('AdminRepositoryService.isUserAdmin()');
                return AdminDataAccessService
                    .isUserAdmin();
            };

            this.getSystemStatistics = function () {
                logger.trace('AdminRepositoryService.getSystemStatistics()');
                return AdminDataAccessService
                    .getSystemStatistics();
            };

            this.getMemoryUsage = function () {
                logger.trace('AdminRepositoryService.getMemoryUsage()');
                return AdminDataAccessService
                    .getMemoryUsage();
            };

            this.getCpuUsage = function () {
                logger.trace('AdminRepositoryService.getCpuUsage()');
                return AdminDataAccessService
                    .getCpuUsage();
            };
        }
    );
})();
