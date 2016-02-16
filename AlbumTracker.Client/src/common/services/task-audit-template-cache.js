/* global angular */
(function () {
    'use strict';

    angular.module('psteam.common.services.task-audit-template-cache', [])

        .factory('TaskAuditTemplateCache',
        function (logger) {
            logger.trace('TaskAuditTemplateCache');
            var cache = {};

            return {
                getTemplate: function (templateName) {
                    logger.trace("TaskAuditTemplateCache:getTemplate(templateName = %s)", templateName);
                    if (templateName === undefined) {
                        return undefined;
                    }

                    return cache[templateName];
                },

                setTemplate: function (templateName, templateValue) {
                    logger.trace("TaskAuditTemplateCache:setTemplate", {
                        'templateName': templateName,
                        'templateValue': templateValue
                    });
                    cache[templateName] = templateValue;
                }
            };
        }
    );
})();
