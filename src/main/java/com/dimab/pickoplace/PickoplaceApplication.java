package com.dimab.pickoplace;

import org.glassfish.jersey.jackson.JacksonFeature;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.servlet.ServletProperties;

public class PickoplaceApplication extends ResourceConfig {

    public PickoplaceApplication() {
        packages("com.dimab.pickoplace.controller");
        packages("com.dimab.pickoplace.rest");
        packages("com.dimab.pickoplace.jersey");

        property(ServletProperties.FILTER_FORWARD_ON_404, true);

        // register(LoggingFilter.class); // for dev purposes

        register(org.glassfish.jersey.server.mvc.MvcFeature.class);

        register(JacksonFeature.class);
    }
}
