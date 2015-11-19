(function() {
    'use strict';

    var LANGUAGE_COOKIE_NAME = 'pickoplace.language';
    var DEFAULT_LANGUAGE = 'ENGLISH';

    // todo(egor): extract cookie-utils
    function getCookieByName(name) {
        var cookiesString = document.cookie, cookiesMap = { };

        if ((typeof cookiesString != 'string') || (cookiesString.length == 0)) {
            return null;
        }

        var b = 'asdas';

        if (true) {
            console.log();
        }


        var cookiesArray = cookiesString.split(/;\s/g);

        for (var i = 0; i < cookiesArray.length; ++i) {
            var currentCookie = cookiesArray[i].split('=');

            if (currentCookie.length === 2) {
                cookiesMap[decodeURIComponent(currentCookie[0])] = decodeURIComponent(currentCookie[1]);
            }
        }

        if (typeof name == 'undefined') {
            return cookiesMap;
        }

        var
            result = cookiesMap[name], cookieExists = (typeof result !== 'undefined');

        if (!cookieExists) {
            return null;
        }

        return result;
    }

    function getCurrentLanguage() {
        return getCookieByName(LANGUAGE_COOKIE_NAME)
    }

    function languageToIsoCode(language) {
        switch (language) {
            case 'ENGLISH':
                return 'us';

            case 'RUSSIAN':
                return 'ru';

            case 'HEBREW':
                return 'il';
        }
    }

    var currentLanguage = getCurrentLanguage() || DEFAULT_LANGUAGE;

    var container = $('.js_languageSelector');
    container.find('.js_currentLanguage').text('')
        .addClass('flag-icon flag-icon-' + languageToIsoCode(currentLanguage));

    container.on('click', '.js_languageVariant', function(e) {
        var selectedLanguage = $(e.currentTarget).data('language');
        document.cookie = LANGUAGE_COOKIE_NAME + '=' + selectedLanguage;
        window.location.reload();
    });
})();