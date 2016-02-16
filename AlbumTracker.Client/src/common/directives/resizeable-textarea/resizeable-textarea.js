(function () {
    'use strict';
    angular.module('psteam.common.directives.resizeable-textarea', [])

        .directive('pstResizeableTextarea', function (logger, $mdUtil) {
            logger.trace('pstResizeableTextarea');
            function link(scope, textArea, attrs, ngModel) {
                logger.trace('pstResizeableTextarea:link');
                var maxHeightString = textArea.css('max-height');
                var maxHeight = parseInt(maxHeightString.replace('px', ''));
                var heightAdjust = scope.adjust || 0;

                var createMirror = function () {
                    logger.trace('pstResizeableTextarea:link:createMirror');
                    textArea.before('<div class="autogrow-textarea-mirror"></div>');
                    return textArea.prev('.autogrow-textarea-mirror');
                };

                // Create a mirror
                var mirror = createMirror();
                var previousMirrorHeight;
                var previousStyleValues = [];

                var copyStyleToMirror = function (style) {
                    logger.trace('pstResizeableTextarea:link:copyStyleToMirror');
                    var styleValue = textArea.css(style);
                    if (previousStyleValues[style] !== styleValue) {
                        mirror.css(style, styleValue);
                        previousStyleValues[style] = styleValue;
                    }
                };

                var resizeTextArea = function () {
                    logger.trace('pstResizeableTextarea:link:resizeTextArea');
                    if (!scope.shown()) {
                        return;
                    }
                    mirror.width(textArea.width());
                    copyStyleToMirror('font-family');
                    copyStyleToMirror('font-weight');
                    copyStyleToMirror('font-size');
                    copyStyleToMirror('font-style');
                    copyStyleToMirror('font-variant');
                    copyStyleToMirror('letter-spacing');
                    copyStyleToMirror('word-spacing');
                    copyStyleToMirror('line-height');

                    var mirrorHeight = mirror.height() + heightAdjust;
                    if (mirrorHeight !== previousMirrorHeight) {
                        if (mirrorHeight >= maxHeight) {
                            textArea.css('overflow-y', 'visible');
                            mirrorHeight = maxHeight;
                        } else {
                            textArea.css('overflow-y', 'hidden');
                        }
                    }
                    previousMirrorHeight = mirrorHeight;

                    if (textArea.height() !== mirrorHeight) {
                        textArea.height(mirrorHeight);
                    }
                };


                var growTextarea = function () {
                    logger.trace('pstResizeableTextarea:link:growTextarea');
                    if (!scope.shown()) {
                        return;
                    }
                    var text = textArea.val();
                    if (text === '') {
                        mirror[0].innerHTML = '</br>';
                    } else {
                        mirror[0].innerHTML = text
                                .replace(/&/g, '&amp;')
                                .replace(/"/g, '&quot;')
                                .replace(/'/g, '&#39;')
                                .replace(/</g, '&lt;')
                                .replace(/>/g, '&gt;')
                                .replace(/ /g, '&nbsp;')
                                .replace(/\n/g, '<br />') + '</br>';
                    }
                    resizeTextArea();
                };


                mirror.width(textArea.width());
                mirror.css('word-wrap', 'break-word');
                mirror.css('white-space', 'normal');
                mirror.css('display', 'none');


                textArea.css('overflow-y', 'hidden');
                var debouncedRes = $mdUtil.debounce(resizeTextArea, 5);
                $(window).resize(debouncedRes);
                scope.$watch(scope.shown, debouncedRes);


                var debouncedGrow = $mdUtil.debounce(growTextarea, 50);

                scope.$watch(function () {
                    logger.trace('pstResizeableTextarea:link:scope.$watch');
                    return ngModel.$modelValue;
                }, debouncedGrow);

                scope.$on('$destroy', function () {
                    logger.trace("pstResizeableTextarea:link:scope.$on('$destroy'");
                    $(window).off('resize', resizeTextArea);
                    textArea.unbind('input propertychange', debouncedGrow);
                });

                growTextarea();
            }

            return {
                restrict: 'A',
                require: 'ngModel',
                scope: {
                    shown: '&ngShow',
                    adjust: '=pstAdjust'
                },
                link: link
            };
        }
    );
})();
