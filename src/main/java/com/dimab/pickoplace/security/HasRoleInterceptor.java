package com.dimab.pickoplace.security;

import com.dimab.pickoplace.service.IdentityHelper;
import org.aopalliance.intercept.MethodInterceptor;
import org.aopalliance.intercept.MethodInvocation;

public class HasRoleInterceptor implements MethodInterceptor {

    @Override
    public Object invoke(MethodInvocation invocation) throws Throwable {
        if (IdentityHelper.getIdentityService().isLoggedIn()) {
            throw new AuthorizationException("can't perform operation");
        }

        return invocation.proceed();
    }
}
