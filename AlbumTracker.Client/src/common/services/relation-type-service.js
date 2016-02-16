(function () {
    'use strict';

    // This service converts from enum-style relations (childDocument) to plain language (child document), and
    // also performs gettext translation as well.
    angular.module('psteam.common.services.relations', ['gettext'])

        .factory('relationTypeService', function (clientLogger, gettextCatalog) {
            clientLogger.trace('RelationTypeService');

            return {
                getRelationType: function (relation) {
                    clientLogger.trace('RelationTypeService:getRelationType');

                    switch (relation) {
                        case 'associateTask':
                            return gettextCatalog.getString('associate task');
                            break;
                        case 'parentTask':
                            return gettextCatalog.getString('parent task');
                            break;
                        case 'childTask':
                            return gettextCatalog.getString('child task');
                            break;
                        case 'attachedDocumentTask':
                            return gettextCatalog.getString('attached document task');
                            break;
                        case 'taskThisDocumentIsAttachedTo':
                            return gettextCatalog.getString('task this document is attached to');
                            break;
                        case 'parentFolder':
                            return gettextCatalog.getString('parent folder');
                            break;
                        case 'childFolder':
                            return gettextCatalog.getString('child folder');
                            break;
                        case 'childDocument':
                            return gettextCatalog.getString('child document');
                            break;
                        case 'childDocumentOrFolder':
                            return gettextCatalog.getString('child document or folder');
                            break;
                        case 'parentDocumentShare':
                            return gettextCatalog.getString('parent document share');
                            break;
                        case 'childDocumentShare':
                            return gettextCatalog.getString('child document share');
                            break;
                    }
                }
            };
        }
    );
})();
