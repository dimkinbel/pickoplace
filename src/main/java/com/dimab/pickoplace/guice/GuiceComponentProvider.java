package com.dimab.pickoplace.guice;

import com.dimab.pickoplace.controller.Controller;
import com.dimab.pickoplace.rest.RestService;
import org.glassfish.hk2.api.DynamicConfiguration;
import org.glassfish.hk2.api.DynamicConfigurationService;
import org.glassfish.hk2.api.Factory;
import org.glassfish.hk2.api.ServiceLocator;
import org.glassfish.hk2.utilities.binding.BindingBuilderFactory;
import org.glassfish.jersey.server.spi.ComponentProvider;

import java.util.Set;

@javax.ws.rs.ext.Provider
public class GuiceComponentProvider implements ComponentProvider {

    private ServiceLocator locator;

    @Override
    public void initialize(ServiceLocator locator) {
        this.locator = locator;
    }

    @Override
    public boolean bind(Class<?> component, Set<Class<?>> providerContracts) {
        if (RestService.class.isAssignableFrom(component)) {
            DynamicConfigurationService dynamicConfigService = locator.getService(DynamicConfigurationService.class);
            DynamicConfiguration dynamicConfiguration = dynamicConfigService.createDynamicConfiguration();

            BindingBuilderFactory
                    .addBinding(BindingBuilderFactory.newFactoryBinder(new GuiceFactory(component))
                            .to(component), dynamicConfiguration);

            dynamicConfiguration.commit();
        }

        return false;
    }

    @Override
    public void done() {
        // no-op
    }

    private boolean isGuiceProvidedComponent(Class componentClass) {
        return RestService.class.isAssignableFrom(componentClass) || Controller.class.isAssignableFrom(componentClass);
    }

    private final static class GuiceFactory implements Factory {

        private final Class componentClass;

        private GuiceFactory(Class componentClass) {
            this.componentClass = componentClass;
        }

        @Override
        public Object provide() {
            return GuiceUtils.getInstance(componentClass);
        }

        @Override
        public void dispose(Object instance) {
            // no-op
        }
    }
}