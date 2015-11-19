/*global define*/
define([
    'assert',
    'backbone',
    'cookieUtils',
    'backbone.marionette'
], (assert, backbone, cookieUtils) => {
    const LANGUAGE_COOKIE_NAME = 'pickoplace.language';
    const DEFAULT_LANGUAGE = 'ENGLISH';

    function getCurrentLanguage() {
        return cookieUtils.getCookieByName(LANGUAGE_COOKIE_NAME);
    }

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
            assert.object(options.data);

            this.bindUIElements();

            const currentLanguage = getCurrentLanguage() || DEFAULT_LANGUAGE;

            this.ui.currentLangugage
                .text('')
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
