/* global angular */
(function () {
    'use strict';
    angular.module('psteam.common.repositories.folders', [
        'psteam.common.data-access.folders',
        'psteam.common.tasks.taskTransformers'
    ])
        .service('FoldersRepositoryService',
        function (FoldersDataAccessService,
                  TaskTransformersService,
                  logger) {
            logger.trace("FoldersRepositoryService");
            this.autocompleteFolders = function (keyword) {
                logger.trace("FoldersRepositoryService.autocompleteFolders(keyword = '%s')", keyword);
                return FoldersDataAccessService
                    .autocompleteFolders(keyword)
                    .then(function (tasks) {
                        logger.trace("FoldersRepositoryService.autocompleteFolders:FoldersDataAccessService.autocompleteFolders.then", tasks);
                        tasks.forEach(
                            TaskTransformersService.transformTaskCodeString
                        );

                        return tasks;
                    });
            };
        }
    );
})();
