(function () {
    'use strict';
    angular.module('psteam.common.data.models.idModel', ['dal'])

        .config(function (dalProvider, FieldValidationTemplates) {
            dalProvider.defineModel('IdModel',
                {
                    fields: {
                        id: {
                            type: dalProvider.fieldTypes.INTEGER
                        },
                        validators: [
                            FieldValidationTemplates.notEmpty()
                        ]
                    }
                }
            );
        });

})();
