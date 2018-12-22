package com.dimab.pickoplace.guice;

import com.google.inject.Guice;
import com.google.inject.Injector;
import com.google.inject.Module;

public class GuiceUtils {

    /**
     * not be used without the need - it`s hack for `getInstance`
     */
    private static Injector globalInjector;

    private GuiceUtils() {
    }

    public static Injector getInjector() {
        Injector injector = globalInjector;

        if (injector == null) {
            throw new RuntimeException("can`t find Injector");
        }

        return injector;
    }

    public static void initializeInjector(Injector injector) {
        globalInjector = injector;
    }

    public static <T> T getInstance(Class<T> aClass) {
        return (T) getInjector().getInstance(aClass);
    }

    public static Injector initializeGlobalInjector(Module integrationModule) {
        Injector injector = Guice.createInjector(integrationModule);

        globalInjector = injector;

        return injector;
    }
}
