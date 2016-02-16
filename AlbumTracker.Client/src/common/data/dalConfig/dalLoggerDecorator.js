(function () {
    'use strict';

    angular.module('psteam.common.data.dalConfig.dalLoggerDecorator', ['dal', 'psteam.logger'])

        .config(function ($provide) {
            $provide.decorator('dal', function ($delegate, logger) {
                $delegate = _.extend($delegate, {
                    debug: logger.debug.bind(logger),
                    trace: logger.trace.bind(logger),
                    log: logger.log.bind(logger),
                    info: logger.info.bind(logger),
                    warn: logger.warn.bind(logger),
                    error: logger.error.bind(logger),
                    fatal: logger.fatal.bind(logger)
                });

                return $delegate;
            });
        });

})();
