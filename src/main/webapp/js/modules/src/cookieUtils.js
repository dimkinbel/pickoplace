/*global define*/
define(['assert'], (assert) => {
    return {
        getCookieByName(name) {
            assert.string(name);

            const cookiesString = document.cookie;
            let cookiesMap = {};

            if (typeof cookiesString !== 'string' || cookiesString.length === 0) {
                return null;
            }

            const cookiesArray = cookiesString.split(/;\s/g);

            for (let i = 0; i < cookiesArray.length; ++i) {
                const currentCookie = cookiesArray[i].split('=');

                if (currentCookie.length === 2) {
                    cookiesMap[decodeURIComponent(currentCookie[0])] = decodeURIComponent(currentCookie[1]);
                }
            }

            if (typeof name === 'undefined') {
                return cookiesMap;
            }

            const result = cookiesMap[name];
            const cookieExists = typeof result !== 'undefined';

            if (!cookieExists) {
                return null;
            }

            return result;
        }
    };
});
