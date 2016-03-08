package com.dimab.pickoplace.utils;

import com.google.common.io.ByteStreams;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;

/**
 * Serve content from disk ot resources with type .js, .css, .less, .jpg, .png, .html
 */
public class StaticResourceFilter implements Filter {


    private final static String HTML_EXTENSION = ".html";

    private final static String MAP_EXTENSION = ".map";

    private final static String HTML_MIME_TYPE = "text/html";

    private final String staticResourcePath;

    public StaticResourceFilter(String staticResourcePath) {
        this.staticResourcePath = staticResourcePath;
    }

    @Override
    public void init(FilterConfig filterConfig) {
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpServletRequest = (HttpServletRequest) request;
        String requestUri = httpServletRequest.getRequestURI();

        if ((requestUri.endsWith(WebResourceType.JS_EXTENSION) ||
                requestUri.endsWith(WebResourceType.CSS_EXTENSION) ||
                requestUri.endsWith(WebResourceType.LESS_EXTENSION) ||
                requestUri.endsWith(WebResourceType.JPG_EXTENSION) ||
                requestUri.endsWith(WebResourceType.PNG_EXTENSION) ||
                requestUri.endsWith(WebResourceType.GIF_EXTENSION) ||
                requestUri.endsWith(WebResourceType.SVG_EXTENSION) ||
                requestUri.endsWith(MAP_EXTENSION) ||
                requestUri.endsWith(HTML_EXTENSION) ||
                isWebFont(requestUri))) {

            HttpServletResponse httpServletResponse = (HttpServletResponse) response;

            if (requestUri.endsWith(WebResourceType.JS_EXTENSION)) {
                httpServletResponse.setContentType(WebResourceType.JS_MIME_TYPE);
            }

            if (requestUri.endsWith(WebResourceType.CSS_EXTENSION)) {
                httpServletResponse.setContentType(WebResourceType.CSS_MIME_TYPE);
            }

            if (requestUri.endsWith(WebResourceType.JPG_EXTENSION)) {
                httpServletResponse.setContentType(WebResourceType.JPG_MIME_TYPE);
            }

            if (requestUri.endsWith(WebResourceType.PNG_EXTENSION)) {
                httpServletResponse.setContentType(WebResourceType.PNG_MIME_TYPE);
            }

            if (requestUri.endsWith(WebResourceType.GIF_EXTENSION)) {
                httpServletResponse.setContentType(WebResourceType.GIF_MIME_TYPE);
            }

            if (requestUri.endsWith(WebResourceType.SVG_EXTENSION)) {
                httpServletResponse.setContentType(WebResourceType.SVG_MIME_TYPE);
            }

            if (requestUri.endsWith(HTML_EXTENSION)) {
                httpServletResponse.setContentType(HTML_MIME_TYPE);
            }

            httpServletResponse.setStatus(HttpServletResponse.SC_OK);
            httpServletResponse.setHeader("X-Powered-By", "StaticResourcesFilter");

            File file = new File(new File(staticResourcePath), requestUri);
            if (!file.exists()) {
                chain.doFilter(request, response);
                return;
            }

            OutputStream outputStream = httpServletResponse.getOutputStream();
            InputStream in = new FileInputStream(file);
            ByteStreams.copy(in, outputStream);
        } else {
            chain.doFilter(request, response);
        }
    }

    @Override
    public void destroy() {
    }

    private boolean isWebFont(String requestUri) {
        return requestUri.endsWith(".otf") ||
                requestUri.endsWith(".eot") ||
                requestUri.endsWith(".svg") ||
                requestUri.endsWith(".ttf") ||
                requestUri.endsWith(".woff") ||
                requestUri.endsWith(".woff2");
    }
}
