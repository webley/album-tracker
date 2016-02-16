(function () {
    'use strict';
    angular.module('psteam.common.repositories.authorisation', [
        'psteam.common.data-access.authorisation',
        'psteam.common.tasks.authorisation'
    ])
        .service('AuthorisationRepositoryService',
        function (AuthorisationDataAccessService,
                  AuthorisationFactory,
                  logger) {
            logger.trace("AuthorisationRepositoryService");
            this.getTaskAuthorisation = function (taskCode) {
                logger.trace("AuthorisationRepositoryService.getTaskAuthorisation(taskCode = '%s')", taskCode);
                return AuthorisationFactory(
                    AuthorisationDataAccessService.getTaskAuthorisation(
                        taskCode.toString()));
            };

            this.getTaskCreateAuthorisation = function (topicCode) {
                logger.trace("AuthorisationRepositoryService.getTaskCreateAuthorisation(topicCode = '%s')", topicCode);
                return AuthorisationFactory(
                    AuthorisationDataAccessService.getTaskCreateAuthorisation(topicCode));
            };
        }
    );
})();
