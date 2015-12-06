package com.dimab.pickoplace.guice;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

public class GuiceListener implements ServletContextListener {

    private final static Logger LOG = LoggerFactory.getLogger(GuiceListener.class);

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        GuiceUtils.initializeGlobalInjector(WebAppIntegrationModule.INSTANCE);
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        // no-op
    }
}
