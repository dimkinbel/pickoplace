package com.dimab.pickoplace.guice;

/* todo(egor): deep review - rest instances must be created bu guice
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
            new GuiceFactory(component);


            DynamicConfigurationService dynamicConfigService =
                    locator.getService(DynamicConfigurationService.class);

            DynamicConfiguration dynamicConfiguration =
                    dynamicConfigService.createDynamicConfiguration();

            BindingBuilderFactory
                    .addBinding(BindingBuilderFactory.newFactoryBinder(PerSessionFactory.class)
                            .to(component), dynamicConfiguration);

            dynamicConfiguration.commit();
        }

        return false;
    }

    @Override
    public void done() {

    }

    private final static class GuiceFactory implements Factory<RestService> {

        private final Class componentClass;

        private GuiceFactory(Class componentClass) {
            this.componentClass = componentClass;
        }

        @Override
        public RestService provide() {
            return null;
        }

        @Override
        public void dispose(RestService instance) {
            // no-op
        }
    }
}
*/