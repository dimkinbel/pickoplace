package com.dimab.pickoplace.i18n;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

public class I18nFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // no-op
    }

    @Override
    public void doFilter(final ServletRequest request,
                         final ServletResponse response,
                         final FilterChain filterChain) {
        Language requestLanguage = extractLanguageFromRequest(request);

        I18nContext.runWith(requestLanguage, new Runnable() {
            @Override
            public void run() {
                try {
                    filterChain.doFilter(request, response);
                } catch (IOException | ServletException e) {
                    throw new RuntimeException(e);
                }
            }
        });
    }

    @Override
    public void destroy() {
        // no-op
    }

    private Language extractLanguageFromRequest(ServletRequest request) {
        HttpServletRequest httpServletRequest = (HttpServletRequest) request;

        // todo(egor): implement

        return Language.HEBREW;
    }
}
