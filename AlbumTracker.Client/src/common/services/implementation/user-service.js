angular.module('psteam.common.services.user',
    [
        'psteam.common.repositories.users',
        'psteam.logger'
    ])

    .service('UserService', function (UsersRepositoryService, logger) {
        logger.trace("UserService");

        this.saveUserSettings = function (settings) {
            logger.trace("UserService.saveUserSettings", settings);
            taskReplySortOrder = settings.taskReplySortOrder;
            if (taskReplySortOrder !== 'recentFirst' && taskReplySortOrder !== 'recentLast') {
                taskReplySortOrder = 'recentFirst';
            }

            markdownEnabled = settings.markdownEnabled;
            if (markdownEnabled !== true && markdownEnabled !== false) {
                markdownEnabled = true;
            }
            logger.trace("UserService.updateJsonSettings", settings);
            return UsersRepositoryService.updateJsonSettings(settings);
        };

        this.updateResults = function (person) {
            logger.trace("UserService.updateResults", person);
            return UsersRepositoryService.updateResults(person);
        };

        this.autocompleteUsers = function (keyword) {
            logger.trace("UserService.autocompleteUsers(keyword = '%s')", keyword);
            return UsersRepositoryService.autocompleteUsers(keyword);
        };

        this.updatePassword = function (oldPassword, newPassword) {
            logger.trace("UserService.updatePassword(oldPassword = ..., newPassword = ...)");
            return UsersRepositoryService.updatePassword(oldPassword, newPassword);
        };

        // Returns the basic properties of the logged in user.
        this.getResults = function () {
            logger.trace("UserService.getResults");
            return UsersRepositoryService.getResults();
        }; //get


        // Get the topics of the logged in user. Returns either the topics of the user or an error message
        this.getTopics = function () {
            logger.trace("UserService.getTopics");
            return UsersRepositoryService.getTopics();
        };

        // Service to update the topics of a user. Returns the response from the server.
        this.updateTopics = function (modifiedTopics) {
            logger.trace("UserService.updateTopics", modifiedTopics);
            return UsersRepositoryService.updateTopics(modifiedTopics);
        };

        this.getSettings = function () {
            logger.trace("UserService.getSettings");
            return UsersRepositoryService.getSettings();
        };

    });
