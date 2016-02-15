package com.dimab.pp.login;

import com.dimab.pickoplace.utils.ServletUtils;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class SetSessionTokenProvider extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String accessToken = request.getParameter("access_token");
        String provider = request.getParameter("provider");

        Map<String, Object> map = new HashMap<String, Object>();
        map.put("valid", false);

        request.getSession().setAttribute("provider", provider);
        request.getSession().setAttribute("access_token", accessToken);
        map.put("valid", true);
        System.out.println(provider + ":" + accessToken);

        ServletUtils.writeJsonResponse(response, map);
    }
}
