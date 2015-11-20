package com.dimab.pickoplace;

import com.dimab.pickoplace.controller.TestController;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.servlet.ServletProperties;

public class PickoplaceApplication extends ResourceConfig {

    public PickoplaceApplication() {
//        packages("com.dimab.pickoplace.controller");
        register(TestController.class);

        property(ServletProperties.FILTER_FORWARD_ON_404, true);

        register(org.glassfish.jersey.server.mvc.MvcFeature.class);
    }
}
