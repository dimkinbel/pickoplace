package com.dimab.pickoplace.guice;

import com.dimab.pickoplace.i18n.I18nFilter;
import com.dimab.pickoplace.i18n.I18nServlet;
import com.dimab.pickoplace.security.HasRoleInterceptor;
import com.dimab.pickoplace.security.LoggedInInterceptor;
import com.dimab.pickoplace.security.annotations.HasRole;
import com.dimab.pickoplace.security.annotations.LoggedIn;
import com.dimab.pickoplace.utils.MDCFilter;
import com.dimab.pickoplace.utils.StaticResourceFilter;
import com.dimab.pickoplace.websession.SimpleWebSessionStorage;
import com.dimab.pickoplace.websession.WebSessionStorage;
import com.google.common.collect.ImmutableMap;
import com.google.inject.Module;
import com.google.inject.matcher.Matchers;
import com.google.inject.servlet.ServletModule;
import com.typesafe.config.Config;
import com.typesafe.config.ConfigFactory;
import org.glassfish.jersey.servlet.ServletContainer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Singleton;
import java.util.Map;

import static com.google.inject.matcher.Matchers.any;

final class WebModule extends ServletModule {

    private final Logger LOG = LoggerFactory.getLogger(WebModule.class);

    public final static Module INSTANCE = new WebModule();

    private WebModule() {
    }

    public void configureServlets() {
        bind(WebSessionStorage.class).to(SimpleWebSessionStorage.class).in(Singleton.class);
        bind(ServletContainer.class).in(Singleton.class);

        // i18n
        filter("/*").through(I18nFilter.class);

        //
        filter("/*").through(MDCFilter.class);

        // jersey
        Map<String, String> jerseyParameters = ImmutableMap.<String, String>builder()
                .put("javax.ws.rs.Application", "com.dimab.pickoplace.PickoplaceApplication")
                .build();
        filter("/*").through(ServletContainer.class, jerseyParameters);


        serve("/rest/i18n.js").with(I18nServlet.class);

        configureResourceFilter();

        // interceptors
        bindInterceptor(any(),
                Matchers.annotatedWith(LoggedIn.class),
                new LoggedInInterceptor());

        bindInterceptor(any(),
                Matchers.annotatedWith(HasRole.class),
                new HasRoleInterceptor());
    }

    private void configureResourceFilter() {
        Config config = ConfigFactory.load();
        Config devConfig = config.getConfig("dev");

        if (!devConfig.getBoolean("enabled")) {
            LOG.info("skip configuration of resource filter for production env");
            return;
        }

        String staticResourcePath = devConfig.getString("staticResourcePath");

        filter("/*").through(new StaticResourceFilter(staticResourcePath));
    }
}
