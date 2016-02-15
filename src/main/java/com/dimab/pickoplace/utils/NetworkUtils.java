package com.dimab.pickoplace.utils;

import javax.servlet.http.HttpServletRequest;
import java.util.regex.Pattern;

public class NetworkUtils {
    private static final Pattern IPV4_REGEX = Pattern.compile("^(\\d{1,3})\\.(\\d{1,3})\\.(\\d{1,3})\\.(\\d{1,3})$");

    private static final String HEADER_X_FORWARDED_FOR = "X-FORWARDED-FOR";
    private static final int CLIENT_REAL_IP_INDEX = 0;

    private NetworkUtils() {
    }

    public static String getRealClientIp(HttpServletRequest request) {
        String remoteIpAddress = request.getRemoteAddr();
        String xForwardedFor = request.getHeader(HEADER_X_FORWARDED_FOR);

        if (xForwardedFor != null) {
            String[] ipAddresses = xForwardedFor.split(",");
            ipAddresses[CLIENT_REAL_IP_INDEX] = ipAddresses[CLIENT_REAL_IP_INDEX].trim();

            if (IPV4_REGEX.matcher(ipAddresses[CLIENT_REAL_IP_INDEX]).find()) {
                remoteIpAddress = ipAddresses[CLIENT_REAL_IP_INDEX];
            }
        }
        return remoteIpAddress;
    }

    public static String getFullRequestedUrl(HttpServletRequest httpServletRequest) {
        String request = httpServletRequest.getRequestURL().toString();
        String queryPart = httpServletRequest.getQueryString();

        if (queryPart != null && !queryPart.isEmpty()) {
            request += "?" + queryPart;
        }

        return request;
    }
}
