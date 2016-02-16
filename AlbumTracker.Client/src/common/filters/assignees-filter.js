(function () {
    'use strict';
    angular.module('psteam.common.filters.assignees', [])
        .filter('assignees', function ($filter, $sce) {
            return function (assignees, limit) {

                if (typeof (assignees) == 'undefined') {
                    return '';
                }

                var length = assignees.length;

                var formatted = '';
                var enableLimit = angular.isDefined(limit) && limit > 0 && length > limit;
                var count = enableLimit ? limit : length;
                
                for (var i = 0; i < count; i++) {
                    if (i !== 0) {
                        formatted += ' ';
                    }                    
                    formatted += assignees[i].loginName;                    
                }

                if (enableLimit) {                    
                    formatted += ' +' + length - count;
                }
                return formatted;
            };
        });
})();
