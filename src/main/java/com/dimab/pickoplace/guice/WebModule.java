package com.dimab.pickoplace.guice;

import com.google.common.collect.ImmutableMap;
import com.google.inject.Module;
import com.google.inject.servlet.ServletModule;
import org.glassfish.jersey.servlet.ServletContainer;

import java.util.Map;

final class WebModule extends ServletModule {

    public final static Module INSTANCE = new WebModule();

    private WebModule() {
    }

    public void configureServlets() {
        Map<String, String> jerseyParameters = ImmutableMap.<String, String>builder()
                .put("javax.ws.rs.Application", "com.dimab.pickoplace.PickoplaceApplication")
                .build();

        filter("/*").through(ServletContainer.class, jerseyParameters);

        /*
        // todo(egor): `ResourcesFilter` for dev purposes
        if (Stage.getCurrentStage() == Stage.DEVELOPMENT) {

        }
        */
    }
}
