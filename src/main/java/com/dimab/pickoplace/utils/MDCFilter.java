package com.dimab.pickoplace.utils;

import com.dimab.pickoplace.service.IdentityService;
import org.slf4j.MDC;

import javax.inject.Inject;
import javax.inject.Singleton;
import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@Singleton
public class MDCFilter implements Filter {

    public final static String CLIENT_IP = "clientIp";

    public final static String REQUESTED_URL = "requestedUrl";

    private final IdentityService identityService;

    @Inject
    public MDCFilter(IdentityService identityService) {
        this.identityService = identityService;
    }

    public void init(FilterConfig filterConfig) throws ServletException {
        // no-op
    }

    public void destroy() {
        // no-op
    }

    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpServletRequest = (HttpServletRequest) request;

        if (httpServletRequest.getServerName() != null) {
            MDC.put("domain", httpServletRequest.getServerName());
        }


        MDC.put(CLIENT_IP, NetworkUtils.getRealClientIp(httpServletRequest));
        MDC.put(REQUESTED_URL, NetworkUtils.getFullRequestedUrl(httpServletRequest));

        MDC.put("requestId", Integer.toString(httpServletRequest.hashCode()));

        if (httpServletRequest.getRequestURI() != null) {
            MDC.put("requestURI", httpServletRequest.getRequestURI());
        }

        if (httpServletRequest.getQueryString() != null) {
            MDC.put("queryString", httpServletRequest.getQueryString());
        }

        if (httpServletRequest.getMethod() != null) {
            MDC.put("method", httpServletRequest.getMethod());
        }


        HttpSession httpSession = httpServletRequest.getSession(false);
        if (httpSession != null) {
            MDC.put("loggedIn", identityService.isLoggedIn() + "");
        }

        //httpMethod
        try {
            chain.doFilter(request, response);
        } finally {
            MDC.clear();
        }
    }
}
