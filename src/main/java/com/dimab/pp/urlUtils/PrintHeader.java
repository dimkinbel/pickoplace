package com.dimab.pp.urlUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by dima on 19-Nov-15.
 */
public class PrintHeader {
    public void printHeader(HttpServletRequest request, HttpServletResponse response) {
        Map<String, String> map = new HashMap<String, String>();

        Enumeration headerNames = request.getHeaderNames();

        System.out.println("HEADER:-----------------------------");
        while (headerNames.hasMoreElements()) {
            String key = (String) headerNames.nextElement();
            String value = request.getHeader(key);
            map.put(key, value);
            System.out.println(key + ": " + value);
        }
        System.out.println("REQUEST:--------------------------");

        System.out.println("<h3>URL = "+request.getRequestURL()+"</h3>");
        System.out.println("<h3>URI = "+request.getRequestURI()+"</h3>");
        System.out.println("<h3>Scheme = "+request.getScheme()+"</h3>");
        System.out.println("<h3>Server Name = "+request.getServerName()+"</h3>");
        System.out.println("<h3>Server Port = "+request.getServerPort()+"</h3>");
        System.out.println("<h3>Context Path = "+request.getContextPath()+"</h3>");
        System.out.println("<h3>Servlet Path = "+request.getServletPath()+"</h3>");
        System.out.println("<h3>Query String = "+request.getQueryString()+"</h3>");

    }
}
