(function () {
    'use strict';
    angular.module('psteam.common.services.stateBuilder', [])
        .provider('StateBuilder', function ($injector) {

            var that = this;

            that.createStateConfig = function (context, transformers) {
                if (angular.isUndefined(transformers)) {
                    transformers = context;
                    context = that;
                }
                return transformers.reduce(function (acc, transformer) {
                    if (angular.isFunction(transformer) || angular.isArray(transformer)) {
                        return $injector.invoke(transformer, context, {
                            state: acc
                        });
                    }

                    if (angular.isObject(transformer)) {
                        return transformer;
                    }

                    if (angular.isString(transformer)) {
                        var transformerProvider = $injector.get(transformer);
                        return transformerProvider.$get().call(that, acc);
                    }


                    return acc;
                }, {});
            };

            that.$get = function () {
                return that;
            };

        });


})();
