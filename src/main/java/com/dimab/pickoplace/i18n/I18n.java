package com.dimab.pickoplace.i18n;

import com.dimab.pickoplace.guice.GuiceUtils;

public final class I18n {

    private I18n() {
    }

    public static String get(String key) {
        return GuiceUtils.getInstance(I18nService.class).getMessage(key);
    }
}
