/*global define*/
define(['underscore'], (_) => {
    return {
        notUndefined(value) {
            if (_.isUndefined(value)) {
                throw new Error('value must be defined!');
            }

            return value;
        },

        number(value) {
            this.notUndefined(value);

            if (!_.isNumber(value)) {
                throw new Error('`' + value + '` must be number');
            }

            return value;
        },

        func(value) {
            this.notUndefined(value);

            if (!_.isFunction(value)) {
                throw new Error('`' + value + '` must be function');
            }

            return value;
        },

        funcWithArgs(value, argumentsCount) {
            this.func(value);
            this.number(argumentsCount);

            if (value.length !== argumentsCount) {
                throw new Error(`'${value}' must be function with ${argumentsCount} arguments`);
            }

            return value;
        },

        funcWithOneArg(value) {
            return this.funcWithArgs(value, 1);
        },

        funcWithoutArgs(value) {
            return this.funcWithArgs(value, 0);
        },

        bool(value) {
            this.notUndefined(value);

            if (!_.isBoolean(value)) {
                throw new Error('`' + value + '` must be boolean');
            }

            return value;
        },

        object(value) {
            this.notUndefined(value);

            if (!_.isObject(value)) {
                throw new Error('`' + value + '` must be object');
            }

            return value;
        },


        string(value) {
            this.notUndefined(value);

            if (!_.isString(value)) {
                throw new Error('`' + value + '` must be string');
            }

            return value;
        },


        valueOfEnum(value, enumObject) {
            this.string(value);
            this.object(enumObject);

            if (!_.contains(_.keys(enumObject), value)) {
                throw new Error('`' + value + '` must be value of enum ' + _.keys(enumObject));
            }

            return value;
        },

        /**
         * Ensures the truth of an expression involving one or more parameters to the calling method.
         * @throws Error if {@code expression} is false
         */
        checkArgument(expression, errorMessage) {
            if (!expression) {
                throw new Error(errorMessage ? errorMessage : 'wrong state');
            }
        },

        /**
         * Ensures the truth of an expression
         * @throws Error if {@code expression} is false
         */
        checkState(expression, errorMessage) {
            if (!expression) {
                throw new Error(errorMessage ? errorMessage : 'wrong state');
            }
        },

        array(value) {
            this.notUndefined(value);

            if (!_.isArray(value)) {
                throw new Error('`' + value + '` must be array');
            }

            return value;
        }

/*
        jQueryOne : function(value) {
            internalAssert(function() {
                assert.jQuery(value);
                expect(value.length).to.be(1);
            }, value, condition);
        },

        jQueryAny : function(value) {
            internalAssert(function() {
                assert.jQuery(value);
                expect(value.length).to.be.greaterThan(0);
            }, value, condition);
        },

        jQuery(value) {
            internalAssert(function() {
                expect(value).to.be.a(jQuery);
            }, value, condition);
        }
*/
    };

});
