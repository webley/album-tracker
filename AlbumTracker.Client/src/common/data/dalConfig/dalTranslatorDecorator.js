(function () {
    'use strict';

    angular.module('psteam.common.data.dalConfig.dalTranlatorDecorator', ['dal', 'gettext'])

        .config(function ($provide) {
            $provide.decorator('dalTranslator', function ($delegate, gettextCatalog) {
                $delegate = _.extend($delegate, {
                    getString: gettextCatalog.getString.bind(gettextCatalog) // delegating to gettextCatalog
                });

                return $delegate;
            });
        });

})();
