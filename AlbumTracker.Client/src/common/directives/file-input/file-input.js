(function () {
    'use strict';
    angular.module('psteam.common.fileInput.directive', [])
        .directive('pstFileInput', function (logger, $compile) {
            logger.trace(".directive('pstFileInput')");
            return {
                restrict: 'A',
                scope: {
                    callback: '&pstFileInput',
                    multiple: '='
                },
                transclude: false,
                link: function (scope, element, attrs) {
                    logger.trace(".directive('pstFileInput'):link");
                    var filesSelectedCallback = scope.callback();
                    var input = angular.element('<input type="file" style="display:none"/>');
                    ($(element[0].parentElement)).prepend(input);

                    var onClick = function (event) {
                        logger.trace(".directive('pstFileInput'):link:element.onClick");
                        input.click();
                        return true;
                    };

                    // Set the click event for the given element.
                    element.click(onClick);

                    if (scope.multiple) {
                        input.attr('multiple', 'multiple');
                    }

                    input.on('change', function (e) {
                        logger.trace(".directive('pstFileInput'):link:input.on('change')");
                        e.preventDefault();

                        if (angular.isDefined(filesSelectedCallback) &&
                            angular.isFunction(filesSelectedCallback)) {
                            filesSelectedCallback(e.target.files);
                        }

                        input.val('');

                        return true;
                    });

                    scope.$on('$destroy', function () {
                        logger.trace(".directive('pstFileInput'):link:scope.$on('$destroy')");
                        input.off();
                        element.off();
                    });
                }
            };
        }
    );
})();
