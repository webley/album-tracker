(function () {
    'use strict';
    var classes = {
        user: 'fa-user',
        userGroup: 'fa-users',
        pseudo: 'fa-user-secret'
    };

    angular.module('psteam.common.userTypeIcon.filter', [])

        .filter('pstUserTypeIcon', function () {
            return function (userType) {
                return classes[userType];
            }
        });
})();
