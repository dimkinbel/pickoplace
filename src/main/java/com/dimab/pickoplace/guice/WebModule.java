package com.dimab.pickoplace.guice;

import com.dimab.pickoplace.websession.SimpleWebSessionStorage;
import com.dimab.pickoplace.websession.WebSessionStorage;
import com.google.common.collect.ImmutableMap;
import com.google.inject.Module;
import com.google.inject.servlet.ServletModule;
import org.glassfish.jersey.servlet.ServletContainer;

import javax.inject.Singleton;
import java.util.Map;

final class WebModule extends ServletModule {

    public final static Module INSTANCE = new WebModule();

    private WebModule() {
    }

    public void configureServlets() {
        bind(WebSessionStorage.class).to(SimpleWebSessionStorage.class).in(Singleton.class);
        bind(ServletContainer.class).in(Singleton.class);

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
