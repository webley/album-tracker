(function () {
    'use strict';
    angular.module('psteam.common.autocomplete.user.directive', ['psteam.common.userTypeIcon.filter'])

        .directive('pstUserAutocomplete', function (logger) {
            logger.trace(".directive('pstUserAutocomplete'");
            return {
                restrict: 'E',
                templateUrl: 'common/directives/user-autocomplete/user-autocomplete.tpl.html',
                priority: 1000,
                scope: {
                    searchQuery: '&',
                    label: '@',
                    users: '=usersCollection',
                    requireMatch: '=?',
                    disabled: '=?ngDisabled'
                },
                compile: function (tElem, tAttrs) {
                    logger.trace(".directive('pstUserAutocomplete':compile");
                    var mdChips = tElem.find('md-chips')[0];
                    var matchAttr = document.createAttribute('md-require-match');
                    matchAttr.value = 'true';
                    var appendAttr = document.createAttribute('md-on-append');
                    appendAttr.value = 'appendUser($chip)';
                    mdChips.attributes.setNamedItem(matchAttr);
                    mdChips.attributes.setNamedItem(appendAttr);

                    // This returned function gets used for post-link.
                    return function (scope, element, attrs) {
                        logger.trace(".directive('pstUserAutocomplete':compile returns");
                        var searchFn = scope.searchQuery();
                        var requireMatch = attrs.requireMatch !== 'false';
                        var userDict = {};

                        // Add any already-bound objects to the dictionary, to prevent adding duplicates.
                        for (var i = 0; i < scope.users.length; i++) {
                            var user = scope.users[i];
                            userDict[user.loginName] = user;
                        }

                        scope.searchQuery = function (searchTerm) {
                            logger.trace(".directive('pstUserAutocomplete':scope.searchQuery(searchTerm:'%s' ", searchTerm);
                            return searchFn(searchTerm).then(function (data) {
                                logger.trace(".directive('pstUserAutocomplete':scope.searchQuery:return searchFn.success' ", data);
                                if (!requireMatch) {
                                    // If no data came back, or the first thing in the list is not an exact loginName match, add the pseudo
                                    // user.
                                    if (searchTerm.indexOf(' ') === -1 && (data.length === 0 || data[0].loginName.toUpperCase() !== searchTerm.toUpperCase())) {
                                        data.unshift({loginName: searchTerm, type: 'pseudo'});
                                    }
                                }

                                for (var i = 0; i < data.length; i++) {
                                    var user = data[i];
                                    if (userDict[user.loginName] !== undefined) {
                                        data[i] = userDict[user.loginName];
                                    }
                                }

                                return data;
                            });
                        };

                        scope.appendUser = function (userChip) {
                            logger.trace(".directive('pstUserAutocomplete':scope.appendUser(' ", userChip);
                            userDict[userChip.loginName] = userChip;
                            return userChip;
                        };

                        // Depending on how Angular Material are feeling, they variously alter chips autocompletes to require
                        // these properties to be set, or not.
                        //scope.searchText = '';
                        //scope.selectedItem = {};
                    }
                }
            };
        }
    );
})();
