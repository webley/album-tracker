(function () {
    'use strict';
    angular.module('psteam.common.fileSelect.directive', [])

        .directive('pstFileSelect', function (logger) {
            logger.trace(".directive('pstFileSelect')");
            return {
                restrict: 'E',
                templateUrl: 'common/directives/file-select/file-select.tpl.html',

                scope: {
                    multiple: '=?pstMultiple',
                    filesSelected: '=?pstFilesSelected'
                },

                link: function (scope, element) {
                    logger.trace(".directive('pstFileSelect'):link");
                    var input = element.find('input[type="file"]');

                    scope.onClick = function (e) {
                        logger.trace(".directive('pstFileSelect'):link:scope.onClick");
                        input.click();

                        var hasOnClickHandler =
                            angular.isDefined(scope.kOptions) &&
                            angular.isDefined(scope.kOptions.click);

                        if (hasOnClickHandler) {
                            return scope.kOptions.click.apply(this, e);
                        }

                        return true;
                    };

                    if (scope.multiple) {
                        input.attr('multiple', 'multiple');
                    }

                    input.on('change', function (e) {
                        logger.trace(".directive('pstFileSelect'):link:input.on('change')");
                        e.preventDefault();
                        element.trigger('filesSelected', {
                            files: e.target.files
                        });

                        input.val('');

                        return true;
                    });

                    if (angular.isDefined(scope.filesSelected) &&
                        angular.isFunction(scope.filesSelected)) {

                        element.on('filesSelected', scope.filesSelected);
                    }

                    scope.$on('$destroy', function () {
                        logger.trace(".directive('pstFileSelect'):link:scope.$on('$destroy')");
                        input.off();
                    });
                }
            };
        }
    );
})();
