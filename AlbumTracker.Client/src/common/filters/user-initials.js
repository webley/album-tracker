(function () {
    'use strict';
    angular.module('psteam.common.filters.user-initials', [])
        .filter('userInitials', function () {
            return function (name) {
                var re = /(\(.*?\)|\[.*?\])/g;
                name = name.replace(re, '').trim().split(' ');
                if (name.length == 0) {
                    name = data.fullName.replace('(', '').replace(')', '').trim().split(' ');
                }
                return (name[0] ? name[0][0] : '') + (name[name.length - 1]
                        ? name[name.length - 1][0]
                        : '');
            };
        });
})();
