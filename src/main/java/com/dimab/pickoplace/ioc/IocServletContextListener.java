package com.dimab.pickoplace.ioc;


import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

public class IocServletContextListener implements ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        // todo(egor): integrate dagger or guice
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        // no-op, GAE never call this method
    }

/*
    private void initializeLog() {
        SLF4JBridgeHandler.removeHandlersForRootLogger();
        SLF4JBridgeHandler.install();
    }
*/
}
