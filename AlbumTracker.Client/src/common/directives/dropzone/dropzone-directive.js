(function () {
    'use strict';

    function getLink($compile, logger) {
        logger.log(".directive('pstFileDragAndDropArea').getLink");
        return function (scope, element) {
            logger.log(".directive('pstFileDragAndDropArea').link");

            var dropzoneElement;
            function dragover(event) {
                event.preventDefault();
                event.stopPropagation();

                var isFileType = false;
                for (var typeIndex in event.originalEvent.dataTransfer.types) {
                    var type = event.originalEvent.dataTransfer.types[typeIndex].toUpperCase();
                    if (type === 'FILES') {
                        isFileType = true;
                        break;
                    }
                }
                if (!isFileType) {
                    event.originalEvent.dataTransfer.dropEffect = 'none';
                    return;
                }

                event.originalEvent.dataTransfer.dropEffect = 'copy';

                if (!dropzoneElement) {
                    // Find out how big our viewport wants to be.
                    var rect = element[0].getBoundingClientRect();
                    var offset = element.offset();
                    dropzoneElement = $compile('<pst-dropzone-splash pst-on-drop="onDrop" pst-on-leave="onLeave"/>')(scope);
                    dropzoneElement.css('position', 'fixed');
                    dropzoneElement.css('z-index', 5000);
                    dropzoneElement.css('height', rect.height);
                    dropzoneElement.css('width', rect.width);
                    dropzoneElement.css('left', offset.left);
                    dropzoneElement.css('top', offset.top);
                    angular.element('body').prepend(dropzoneElement);

                    // Disable the outer element's drag handling, since dropzoneElement will now be handling events.
                    element.off();
                }
            };

            scope.onLeave = function(e) {
                if (dropzoneElement) {
                    dropzoneElement.off();
                    dropzoneElement.remove();
                    dropzoneElement = null;
                }

                // Turn main element dragover event back on.
                element.on('dragover', dragover);
            };

            //Since onDrop is passed using '&', we need to dereference it.
            var dropCallback = scope.onDrop();
            scope.onDrop = function(e) {
                scope.onLeave(e);
                dropCallback(e);
            };

            element.on('dragover', dragover);
            element.on('drop', scope.onDrop);
            scope.$on('$destroy', function () {
                logger.log(".directive('pstFileDragAndDropArea'):scope.$on('$destroy')");
                element.off();
            });
        };
    }

    angular.module('psteam.common.dropzone.directive', ['psteam.logger', 'psteam.common.dropzone-splash.directive'])

        .config(function (loggerProvider) {
            loggerProvider.log("angular.module('psteam.common.fileDragAndDropArea.directive').config()");
            angular.element(window)
                .on('dragover', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.originalEvent.dataTransfer.dropEffect =
                        'none';
                })
                .on('dragleave', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                });
        })
        .directive('pstDropzone', function ($compile, logger) {
            return {
                restrict: 'EA',
                scope: {
                    onDrop: '&pstOnDrop'
                },
                controllerAs: 'ctrl',
                link: getLink($compile, logger)
            };
        });
})();
