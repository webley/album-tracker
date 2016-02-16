(function () {
    'use strict';
    angular.module('psteam.common.repositories.projects', [
        'psteam.common.data-access.projects',
        'psteam.common.tasks.taskTransformers'
    ])
        .service('ProjectsRepositoryService',
        function (ProjectsDataAccessService, TaskTransformersService, logger) {
            logger.trace('ProjectsRepositoryService');

            this.autocompleteProjects = function (keyword) {
                logger.trace("ProjectsRepositoryService.autocompleteProjects(keyword = '%s')", keyword);
                return ProjectsDataAccessService
                    .autocompleteProjects(keyword)
                    .then(function (tasks) {

                        tasks.forEach(
                            TaskTransformersService.transformTaskCodeString
                        );

                        return tasks;
                    });
            };
        })
})();
