(function () {
    'use strict';

    var TIME_STRINGS = ['d', 'h', 'm'];
    var TIME = {
        1: 24 * 60 * 60,
        2: 60 * 60,
        3: 60
    };

    angular.module('psteam.common.filters.worktime', [])
        .filter('worktime', function () {
            return function (worktime) {
                if (isNaN(worktime)) {
                    return '';
                }
                var res = new Array(3);
                for (var i = 0; i < 3; i++) {
                    res[i * 2] = Math.floor(worktime / TIME[i + 1]) + TIME_STRINGS[i];
                    worktime = worktime % TIME[i + 1];
                }
                return res.join(' ');
            };
        });
})();
