package com.dimab.pickoplace.i18n;

public final class I18nContext {

    private final static ThreadLocal<Language> CURRENT_LANGUAGE = new ThreadLocal<>();

    public static Language getCurrentLanguage() {
        Language currentLanguage = CURRENT_LANGUAGE.get();

        if (currentLanguage == null) {
            return Language.DEFAULT_LANGUAGE;
        }

        return currentLanguage;
    }

    public static void runWith(Language language, Runnable work) {
        Language originalLanguage = CURRENT_LANGUAGE.get();

        try {
            CURRENT_LANGUAGE.set(language);
            work.run();
        } finally {
            CURRENT_LANGUAGE.set(originalLanguage);
        }
    }
}
