(function () {
    'use strict';

    angular.module('psteam.common.directives.pst-file-icon-class-selector', [])

        .directive('pstFileIconClassSelector', function ($timeout, $parse, logger) {
            logger.trace("directive('pstFileIconClassSelector')");
            return {
                restrict: 'A',
                priority: 0,
                link: function (scope, element, attrs) {

                    logger.trace("directive('pstFileIconClassSelector'):compile");

                    var fileName = attrs.pstFileIconClassSelector && attrs.pstFileIconClassSelector.length > 0
                        ? attrs.pstFileIconClassSelector : '.anyfile';
                    var fileNameExtension = fileName.substring(fileName.lastIndexOf('.'));
                    var fileTypeFontAwesomeClass = '';

                    switch (fileNameExtension) {
                        case ".jpg":
                        case ".bmp":
                        case ".png":
                        case ".tiff":
                        case ".gif":
                            fileTypeFontAwesomeClass = "fa-file-image-o";
                            break;
                        case ".wav":
                        case ".mp3":
                        case ".wma":
                        case ".ogg":
                        case ".midi":
                        case ".m4a":
                            fileTypeFontAwesomeClass = "fa-file-sound-o";
                            break;
                        case ".zip":
                        case ".rar":
                        case ".7z":
                            fileTypeFontAwesomeClass = "fa-file-zip-o";
                            break;
                        case ".doc":
                        case ".docx":
                        case ".rtf":
                        case ".odf":
                            fileTypeFontAwesomeClass = "fa-file-word-o";
                            break;
                        case ".xls":
                        case ".xlsx":
                            fileTypeFontAwesomeClass = "fa-file-excel-o";
                            break;
                        case ".ppt":
                        case ".pptx":
                            fileTypeFontAwesomeClass = "fa-file-powerpoint-o";
                            break;
                        case ".txt":
                        case ".log":
                        case ".htm":
                        case ".html":
                            fileTypeFontAwesomeClass = "fa-file-text-o";
                            break;
                        case ".pdf":
                            fileTypeFontAwesomeClass = "fa-file-pdf-o";
                            break;
                        case ".cs":
                        case ".h":
                        case ".cpp":
                        case ".c":
                        case ".js":
                        case ".vb":
                            fileTypeFontAwesomeClass = "fa-file-code-o";
                            break;
                        case ".mp4":
                        case ".avi":
                        case ".divx":
                        case ".mpeg":
                            fileTypeFontAwesomeClass = "fa-file-video-o";
                            break;

                        default:
                            fileTypeFontAwesomeClass = "fa-file-o";
                            break;
                    }

                    element.addClass('md-font');
                    element.addClass(fileTypeFontAwesomeClass);
                }
            };
        });
})();
