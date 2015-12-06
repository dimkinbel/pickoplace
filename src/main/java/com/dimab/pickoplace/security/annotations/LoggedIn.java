package com.dimab.pickoplace.security.annotations;

import java.lang.annotation.*;

/**
 * rest-method with this annotation available only for loggedIn user
 */
@Inherited
@Documented
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface LoggedIn {
}
