package com.dimab.pp.login;

import com.dimab.pickoplace.utils.ServletUtils;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class CheckGoogleTokenServlet extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String accessToken = request.getParameter("at");
        Map<String, Object> map = new HashMap<String, Object>();

        System.out.println(accessToken);
        GoogVerifyToken tokenVerifier = new GoogVerifyToken(accessToken);
        System.out.println(tokenVerifier.isValid());
        if (tokenVerifier.isValid()) {
            GOOGmeResponseJSON userData = tokenVerifier.getData();
            System.out.println(userData.email);
            map.put("valid", true);
            map.put("provider", "GOOG");
            map.put("userData", userData);
        } else {
            map.put("valid", false);
        }

        ServletUtils.writeJsonResponse(response, map);
    }
}
