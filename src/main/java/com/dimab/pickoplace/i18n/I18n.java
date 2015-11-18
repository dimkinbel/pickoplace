package com.dimab.pickoplace.i18n;

public final class I18n {

    private I18n() {
    }

    public String get(String key) {
        return I18nService.INSTANCE.getMessage(key);
    }
}
