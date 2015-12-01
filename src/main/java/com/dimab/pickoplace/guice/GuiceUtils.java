package com.dimab.pickoplace.guice;

import com.google.inject.Injector;

public class GuiceUtils {

    /**
     * not be used without the need - it`s hack for `getInstance`
     */
    private static Injector globalInjector;

    private GuiceUtils() {
    }

    static Injector getInjector() {
        Injector injector = globalInjector;

        if (injector == null) {
            throw new RuntimeException("can`t find Injector");
        }

        return injector;
    }

    public static void initializeInjector(Injector injector) {
        globalInjector = injector;
    }

    public static <T> T getInstance(Class aClass) {
        return (T) getInjector().getInstance(aClass);
    }
}
