package com.dimab.pickoplace.i18n;

import javax.servlet.*;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

public class I18nFilter implements Filter {
    private final static String MESSAGE_ATTRIBUTE_NAME = "i18n";
    private final static String LANGUAGE_COOKIE_NAME = "pickoplace.language";

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // no-op
    }

    @Override
    public void doFilter(final ServletRequest request,
                         final ServletResponse response,
                         final FilterChain filterChain) {
        final Language requestLanguage = extractLanguageFromRequest(request);

        I18nContext.runWith(requestLanguage, new Runnable() {
            @Override
            public void run() {
                try {
                    request.setAttribute(MESSAGE_ATTRIBUTE_NAME, I18nService.INSTANCE.getMessages(requestLanguage));

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

        for (Cookie cookie : httpServletRequest.getCookies()) {
            if (LANGUAGE_COOKIE_NAME.equals(cookie.getName())) {
                String languageAsString = cookie.getValue();

                try {
                    return Language.valueOf(languageAsString);
                } catch (RuntimeException e) {
                    return Language.DEFAULT_LANGUAGE;
                }
            }
        }

        return Language.DEFAULT_LANGUAGE;
    }
}
