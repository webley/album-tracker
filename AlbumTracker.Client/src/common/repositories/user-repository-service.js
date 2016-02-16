(function () {
    'use strict';
    angular.module('psteam.common.repositories.users', [
        'psteam.common.data-access.users',
        'psteam.logger'
    ])
        .service('UsersRepositoryService',
        function (UsersDataAccessService, logger) {
            logger.trace('UsersRepositoryService');
            this.updateResults = function (person) {
                return UsersDataAccessService.updateResults(person);
            };

            this.getResults = function () {
                logger.trace('UsersRepositoryService.getResults');
                return UsersDataAccessService.getResults();
            };
            this.autocompleteUsers = function (keyword) {
                logger.trace("UsersRepositoryService.autocompleteUsers(keyword = '%s')", keyword);
                return UsersDataAccessService.autocompleteUsers(keyword);
            };
            this.updatePassword = function (oldPassword, newPassword) {
                logger.trace("UsersRepositoryService.updatePassword(oldPassword = ..., newPassword = ...)");
                return UsersDataAccessService.updatePassword(oldPassword, newPassword);
            };
            this.getTopics = function () {
                logger.trace("UsersRepositoryService.getTopics()");
                return UsersDataAccessService.getTopics();
            };
            this.updateTopics = function (modifiedTopics) {
                logger.trace("UsersRepositoryService.updateTopics", modifiedTopics);
                return UsersDataAccessService.updateTopics(modifiedTopics);
            };
            this.getSettings = function () {
                logger.trace("UsersRepositoryService.getSettings");
                return UsersDataAccessService.getSettings().then(function(settings) {
                    settings.settings = (settings.settings != undefined && settings.settings.length != 0) ? angular.fromJson(settings.settings) : {};
                    settings.settings.taskReplySortOrder = 'taskReplySortOrder' in settings.settings ? settings.settings.taskReplySortOrder : 'recentFirst';

                    settings.settings.markdownEnabled = 'markdownEnabled' in settings.settings ? settings.settings.markdownEnabled : true;
                    settings.settings.savedSearches = 'savedSearches' in settings.settings ? settings.settings.savedSearches : [];
                    return settings;
                });


            };

            this.updateJsonSettings = function (settings) {
                logger.trace("UsersRepositoryService.updateJsonSettings(settings='%s')", settings);
                var json = !settings ? '' : angular.toJson(settings);

                return UsersDataAccessService.updateJsonSettings({ settings: json});
            };
        }
    );
})();
