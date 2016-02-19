(function () {
    'use strict';
    angular.module('app.fileInputDirective', [])
        .directive('wblFileInput', function () {
                return {
                    restrict: 'A',
                    scope: {
                        callback: '&onSelected',
                        multiple: '='
                    },
                    transclude: false,
                    link: function (scope, element, attrs) {
                        var filesSelectedCallback = scope.callback();
                        var input = angular.element('<input type="file" style="display:none"/>');
                        ($(element[0].parentElement)).prepend(input);

                        var onClick = function (event) {
                            input.click();
                            return true;
                        };

                        // Set the click event for the given element.
                        element.click(onClick);

                        if (scope.multiple) {
                            input.attr('multiple', 'multiple');
                        }

                        input.on('change', function (e) {
                            e.preventDefault();

                            if (angular.isDefined(filesSelectedCallback) &&
                                angular.isFunction(filesSelectedCallback)) {
                                filesSelectedCallback(e.target.files);
                            }

                            input.val('');

                            return true;
                        });

                        scope.$on('$destroy', function () {
                            input.off();
                            element.off();
                        });
                    }
                };
            }
        );
})();
