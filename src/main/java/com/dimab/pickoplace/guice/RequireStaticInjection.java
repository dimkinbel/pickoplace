package com.dimab.pickoplace.guice;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.TYPE;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

/**
 * perform requireStaticInjection for static fields with @Inject if guice proper configured
 */
@Documented
@Target({TYPE})
@Retention(RUNTIME)
public @interface RequireStaticInjection {
}
