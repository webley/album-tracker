(function () {
    'use strict';
    angular.module('psteam.common.services.documents',
        ['psteam.common.repositories.documents'])
        .service('DocumentsService', function (DocumentsRepositoryService, logger) {
            logger.trace("DocumentsService");
            this.getRootFolders = function (type) {
                logger.trace("DocumentsService.getRootFolders", {
                    "type": type
                });
                return DocumentsRepositoryService
                    .getRootFolders(type)
                    .then(function (data) {
                        logger.trace("DocumentsService.getRootFolders:DocumentsRepositoryService.getRootFolders.then", data);
                        //tasks.forEach(
                        //    TaskTransformersService.transformTaskCodeString
                        //);
                        return data;
                    });
            };

            this.getDocument = function (taskCode) {
                logger.trace("DocumentsService.getDocument", {
                    "taskCode": taskCode
                });
                return DocumentsRepositoryService
                    .getDocument(taskCode)
                    .then(function (data) {
                        logger.trace("DocumentsService.getRootFolders:DocumentsRepositoryService.getRootFolders.then", data);
                        //tasks.forEach(
                        //    TaskTransformersService.transformTaskCodeString
                        //);
                        return data;
                    });
            };
        });
})();
