package com.dimab.pickoplace;

import com.dimab.pickoplace.controller.TestController;
import org.glassfish.jersey.server.ResourceConfig;

public class PickoplaceApplication extends ResourceConfig {

    public PickoplaceApplication() {
//        packages("com.dimab.pickoplace.controller");
        register(TestController.class);
    }
}
