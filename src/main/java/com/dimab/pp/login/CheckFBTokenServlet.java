package com.dimab.pp.login;

import com.dimab.pickoplace.json.GsonUtils;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;


public class CheckFBTokenServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String accessToken = request.getParameter("at");
        Map<String, Object> map = new HashMap<String, Object>();

        System.out.println(accessToken);
        FBVerifyToken tokenFactory = new FBVerifyToken(accessToken);
        if (tokenFactory.isValid()) {
            FBmeResponseJSON userData = tokenFactory.getData();
            System.out.println(userData.email);
            map.put("valid", true);
            map.put("provider", "FB");
            map.put("userData", userData);
        } else {
            map.put("valid", false);
        }
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(GsonUtils.GSON.toJson(map));
    }

}
