package com.dimab.pickoplace;

import com.dimab.pickoplace.guice.GuiceUtils;
import org.glassfish.hk2.api.ServiceLocator;
import org.glassfish.jersey.jackson.JacksonFeature;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.servlet.ServletProperties;
import org.jvnet.hk2.guice.bridge.api.GuiceBridge;
import org.jvnet.hk2.guice.bridge.api.GuiceIntoHK2Bridge;

import javax.inject.Inject;

public class PickoplaceApplication extends ResourceConfig {

    @Inject
    public PickoplaceApplication(ServiceLocator serviceLocator) {
        packages("com.dimab.pickoplace.controller");
        packages("com.dimab.pickoplace");
        packages("com.dimab.pickoplace.security");
        packages("com.dimab.pickoplace.jersey"); // integrations
        packages("com.dimab.pickoplace.rest");
        packages("com.dimab.pp.adminRest");
        property(ServletProperties.FILTER_FORWARD_ON_404, true);

        // register(LoggingFilter.class); // for dev purposes

        register(org.glassfish.jersey.server.mvc.jsp.JspMvcFeature.class);

        register(JacksonFeature.class);

        GuiceBridge.getGuiceBridge().initializeGuiceBridge(serviceLocator);
        GuiceIntoHK2Bridge guiceBridge = serviceLocator.getService(GuiceIntoHK2Bridge.class);
        guiceBridge.bridgeGuiceInjector(GuiceUtils.getInjector());
    }
}
