package com.dimab.pickoplace.guice;

import com.google.appengine.labs.repackaged.com.google.common.collect.ImmutableList;
import com.google.inject.Module;
import com.squarespace.jersey2.guice.JerseyGuiceServletContextListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletContextEvent;
import java.util.List;

public class GuiceListener extends JerseyGuiceServletContextListener {

    private final static Logger LOG = LoggerFactory.getLogger(GuiceListener.class);

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        GuiceUtils.initializeInjector(getInjector());
    }

    @Override
    protected List<? extends Module> modules() {
        return ImmutableList.of(WebAppIntegrationModule.INSTANCE);
    }
}
