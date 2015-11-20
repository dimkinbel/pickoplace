/*global define*/
define([
    'jquery',
    'assert'
], ($, assert) => {

    const DATA_ATTRIBUTE_NAME = 'data-page-initial-data';

    return {
        data: null,

        /**
         * return customizable part of PageInitialData
         */
        getData(key) {
            assert.string(key);

            return this.get('data')[key];
        },

        get(key) {
            assert.string(key);

            if (this.data === null) {
                this.data = $.parseJSON($('body').attr(DATA_ATTRIBUTE_NAME));
            }

            return this.data[key];
        }
    };
});
