(function () {
    'use strict';
    angular.module('psteam.common.data-access.folders', [])
        .service('FoldersDataAccessService',
        function ($http, logger) {
            logger.trace('FoldersDataAccessService');
            this.autocompleteFolders = function (keyword) {
                logger.trace("FoldersDataAccessService.autocompleteFolders(keyword = '%s')", keyword);
                return $http
                    .post('api/folders/autocomplete', {keyword: keyword})
                    .then(function (response) {
                        logger.trace("autocompleteFolders.autocompleteFolders:$http.post('api/folders/autocomplete'", response);
                        return response.data;
                    });
            };
        });
})();
