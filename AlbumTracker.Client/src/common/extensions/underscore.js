(function () {
    // Underscore extensions

    /**
     * Shortcuts to access Underscore.String functions.
     */
    _.str = _.string = _.s = s;

    _.mixin({

        /**
         * Remove all object members (without creating another object)
         *
         * @static
         * @memberOf _
         * @category Objects
         * @param {*} obj object
         * @returns {*} empty object from arguments
         */
        clearObject: function (obj) {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    delete obj[prop];
                }
            }
            return obj;
        },

        /**
         * Object resetting. Clears object from first argument(removing all properties), and copy all properties from second argument to
         * first one
         *
         * @static
         * @memberOf _
         * @category Objects
         * @param {*} targetObj object to reset. Will be cleared and extended from second argument, and then returned
         * @param {*} sourceObj source object. Will not change
         * @returns {*} first argument, cleared and refilled
         */
        resetObject: function (targetObj, sourceObj) {
            return _.extend(_.clearObject(targetObj), sourceObj);
        },

        /**
         * Checks if `value` is a promise.
         *
         * @static
         * @memberOf _
         * @category Objects
         * @param {*} [value] The value to check.
         * @returns {boolean} Returns `true` if the `value` is a promise, else `false`.
         * @example
         *
         * _.isPromise($q.when(something));
         * // => true
         */
        isPromise: function (value) {
            return !!value && _.isFunction(value.then);
        },

        // Gets the value at any depth in a nested object based on the
        // path described by the keys given. Keys may be given as an array
        // or as a dot-separated string.
        getPath: function getPath(obj, ks) {
            ks = typeof ks == 'string' ? keysFromPath(ks) : ks;

            var i = -1, length = ks.length;

            // If the obj is null or undefined we have to break as
            // a TypeError will result trying to access any property
            // Otherwise keep incrementally access the next property in
            // ks until complete
            while (++i < length && obj != null) {
                obj = obj[ks[i]];
            }
            return i === length ? obj : void 0;
        },

        // Returns a boolean indicating whether there is a property
        // at the path described by the keys given
        hasPath: function hasPath(obj, ks) {
            ks = typeof ks == 'string' ? keysFromPath(ks) : ks;

            var i = -1, length = ks.length;
            while (++i < length && _.isObject(obj)) {
                if (ks[i] in obj) {
                    obj = obj[ks[i]];
                } else {
                    return false;
                }
            }
            return i === length;
        },

        // Deep pluck version
        pluck: function pluck(arr, key) {
            return _.map(arr, function (o) {
                return _.getPath(o, key);
            });
        }
    });

    // Will take a path like 'element[0][1].subElement["Hey!.What?"]["[hey]"]'
    // and return ["element", "0", "1", "subElement", "Hey!.What?", "[hey]"]
    function keysFromPath(path) {
        // from http://codereview.stackexchange.com/a/63010/8176
        /**
         * Repeatedly capture either:
         * - a bracketed expression, discarding optional matching quotes inside, or
         * - an unbracketed expression, delimited by a dot or a bracket.
         */
        var re = /\[("|')(.+)\1\]|([^.\[\]]+)/g;

        var elements = [];
        var result;
        while ((result = re.exec(path)) !== null) {
            elements.push(result[2] || result[3]);
        }
        return elements;
    }

})();
