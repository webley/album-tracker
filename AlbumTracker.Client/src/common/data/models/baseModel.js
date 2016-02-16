(function () {
    'use strict';
    angular.module('psteam.common.data.models.baseModel', ['dal'])

        .config(function (dalProvider) {
            dalProvider.defineModel('BaseModel',
                {
                    extend: ['IdModel'],
                    fields: {
                        created: {
                            type: dalProvider.fieldTypes.DATE
                        },
                        updated: {
                            type: dalProvider.fieldTypes.DATE
                        },
                        version: {
                            type: dalProvider.fieldTypes.INTEGER
                        }
                    }
                }
            );
        });

})();
