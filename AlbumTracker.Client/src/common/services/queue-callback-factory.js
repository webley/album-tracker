angular.module('psteam.common.factories.callback-queue', [])
    .factory('CallbackQueueFactory',
    function (logger) {
        logger.trace('CallbackQueueFactory');
        var callbackQueue = function () {
            logger.trace('CallbackQueueFactory:callbackQueue');
            var callbacks = [];
            var queue = [];

            var that = this;

            function callCallbacks(thing) {
                logger.trace('CallbackQueueFactory:callCallbacks',
                    {
                        'thing': thing
                    });
                for (var i = 0; i < callbacks.length; i++) {
                    var cb = callbacks[i];
                    cb(thing);
                }
            }

            function callbackEntireQueue() {
                logger.trace('CallbackQueueFactory:callCallbacks');

                while (queue.length > 0) {
                    var thing = queue.unshift();
                    callCallbacks(thing);
                }
            }

            that.push = function (thing) {
                logger.trace('CallbackQueueFactory:push',
                    {
                        'thing': thing
                    });
                if (callbacks.length === 0) {
                    queue.push(thing);
                } else {
                    callCallbacks(thing);
                }
            };

            that.registerCallback = function (callback) {
                logger.trace('CallbackQueueFactory:callCallbacks', callback);
                callbacks.push(callback);
                if (callbacks.length === 1) {
                    // This is the first callback registered, call it immediately with anything that has been enqueued.
                    callbackEntireQueue();
                }
            }
        };

        return callbackQueue;
    }
);
