(function () {
    'use strict';
    angular.module('psteam.task.directives.plaintextToHtml', [])
        .provider('plaintextToHtml', function plaintextToHtmlProvider() {
            var filters = [];
            this.loadExtension = function (def) {

                var inst = def();
                angular.forEach(inst, function (value, key) {
                    filters.push(value.filter);
                });
            };

            this.$get = function () {
                return {
                    makeHtml: function (text) {
                        angular.forEach(filters, function (value, key) {
                            text = value(text);
                        });
                        return text;
                    }
                }
            };

        }).directive('pstPlaintextToHtml', function ($sanitize, $sce, plaintextToHtml) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    scope.$watch('model', function (newValue) {
                        var HTML;
                        if (typeof newValue === 'string') {
                            HTML = plaintextToHtml.makeHtml(newValue);
                            scope.angularCheckedHtml = HTML;
                        } else {
                            scope.angularCheckedHtml = typeof newValue;
                        }
                    });

                },
                scope: {
                    model: '=pstPlaintextToHtml'
                },
                template: '<div ng-bind-html="angularCheckedHtml"></div>'
            };
        })
    ;
})();
