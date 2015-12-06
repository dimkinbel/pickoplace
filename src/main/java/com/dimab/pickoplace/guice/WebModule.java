package com.dimab.pickoplace.guice;

import com.dimab.pickoplace.i18n.I18nFilter;
import com.dimab.pickoplace.i18n.I18nServlet;
import com.dimab.pickoplace.security.LoggedInInterceptor;
import com.dimab.pickoplace.security.annotations.HasRole;
import com.dimab.pickoplace.security.annotations.LoggedIn;
import com.dimab.pickoplace.websession.SimpleWebSessionStorage;
import com.dimab.pickoplace.websession.WebSessionStorage;
import com.google.common.collect.ImmutableMap;
import com.google.inject.Module;
import com.google.inject.matcher.Matchers;
import com.google.inject.servlet.ServletModule;
import org.glassfish.jersey.servlet.ServletContainer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Singleton;
import java.lang.reflect.Modifier;
import java.util.Map;
import java.util.Set;

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

        // jersey
        Map<String, String> jerseyParameters = ImmutableMap.<String, String>builder()
                .put("javax.ws.rs.Application", "com.dimab.pickoplace.PickoplaceApplication")
                .build();
        filter("/*").through(ServletContainer.class, jerseyParameters);


        serve("/rest/i18n.js").with(I18nServlet.class);

        /*
        // todo(egor): `ResourcesFilter` for dev purposes
        if (Stage.getCurrentStage() == Stage.DEVELOPMENT) {

        }
        */

        bindInterceptor(any(),
                Matchers.annotatedWith(LoggedIn.class),
                new LoggedInInterceptor());

        bindInterceptor(any(),
                Matchers.annotatedWith(HasRole.class),
                new LoggedInInterceptor());

        injectStatic();
    }

    private void injectStatic() {
        Set<Class<?>> requireStaticInjectionClasses =
                ReflectionUtils.PARENT_NAMESPACE_REFLECTIONS.getTypesAnnotatedWith(RequireStaticInjection.class);

        int i = 0;
        for (Class requireStaticInjectionClass : requireStaticInjectionClasses) {
            i = ++i;
            if (requireStaticInjectionClass == null) {
                LOG.warn("skip null");
                continue;
            }

            if (!Modifier.isAbstract(requireStaticInjectionClass.getModifiers())) {
                binder().requestStaticInjection(requireStaticInjectionClass);
                LOG.info("requireStaticInjectForClass = `{}`", requireStaticInjectionClass);
            } else {
                LOG.warn("class = `{}` is abstract, so skip @Inject on it", requireStaticInjectionClass);
            }
        }
    }
}
