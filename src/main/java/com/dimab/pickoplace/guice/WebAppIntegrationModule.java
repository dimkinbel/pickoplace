package com.dimab.pickoplace.guice;

import com.google.inject.AbstractModule;
import com.google.inject.Module;

final class WebAppIntegrationModule extends AbstractModule {

    public final static Module INSTANCE = new WebAppIntegrationModule();

    @Override
    protected void configure() {
        // modules
        install(WebModule.INSTANCE);
    }
}
