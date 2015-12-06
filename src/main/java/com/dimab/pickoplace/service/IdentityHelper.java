package com.dimab.pickoplace.service;

/**
 * must be used in rare cases - where we can't use @Inject on constructor (interceptors and etc.)
 */
public final class IdentityHelper {

    static IdentityService identityService;

    IdentityHelper() {
    }

    public static IdentityService getIdentityService() {
        return identityService;
    }
}
