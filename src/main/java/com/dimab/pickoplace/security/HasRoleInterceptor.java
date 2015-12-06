package com.dimab.pickoplace.security;

import com.dimab.pickoplace.guice.RequireStaticInjection;
import com.dimab.pickoplace.service.IdentityService;
import org.aopalliance.intercept.MethodInterceptor;
import org.aopalliance.intercept.MethodInvocation;

import javax.inject.Inject;

@RequireStaticInjection
public class HasRoleInterceptor implements MethodInterceptor {

    @Inject
    private static IdentityService identityService;

    @Override
    public Object invoke(MethodInvocation invocation) throws Throwable {
        return invocation.proceed();
    }
}
