/*global define*/
define([
    'assert',
    'backbone',
    'backbone.marionette'
], (assert, backbone) => {
    const LANGUAGE_COOKIE_NAME = 'pickoplace.language';

    function languageToIsoCode(language) {
        switch (language) {
            case 'ENGLISH':
                return 'us';

            case 'RUSSIAN':
                return 'ru';

            case 'HEBREW':
                return 'il';

            default:
                throw new Error(`unknown language '${language}'`);
        }
    }

    return backbone.Marionette.View.extend({

        ui: {
            currentLangugage: '.js_currentLanguage'
        },

        events: {
            'click .js_languageVariant': '_changeLanguageHandler'
        },

        initialize(options) {
            assert.object(options);
            assert.object(options.el);
            assert.string(options.data);

            this.bindUIElements();

            const currentLanguage = options.data;

            this.ui.currentLangugage
                .text(languageToIsoCode(currentLanguage).toUpperCase())
                .addClass('flag-icon flag-icon-' + languageToIsoCode(currentLanguage));
        },

        _changeLanguageHandler(e) {
            e.preventDefault();

            const selectedLanguage = backbone.$(e.currentTarget).data('language');
            document.cookie = `${LANGUAGE_COOKIE_NAME} = ${selectedLanguage}`;
            window.location.reload();
        }
    });
});
