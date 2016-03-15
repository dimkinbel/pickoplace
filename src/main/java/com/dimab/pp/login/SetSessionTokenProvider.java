package com.dimab.pp.login;

import com.dimab.pickoplace.utils.JsonUtils;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse; 

public class SetSessionTokenProvider extends HttpServlet {

    public static String ACCESS_TOKEN_SESSION_KEY = "access_token";
    public static String PROVIDER_SESSION_KEY = "provider";


	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String accessToken = request.getParameter(ACCESS_TOKEN_SESSION_KEY);
        String provider = request.getParameter("provider");
        
        response.setContentType("application/json");
        Map <String , Object> map = new HashMap<String , Object>();
        map.put("valid", false);
        
        request.getSession().setAttribute("provider", provider);
		request.getSession().setAttribute("access_token", accessToken);
		map.put("valid", true);
		System.out.println(provider+":"+accessToken);
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(JsonUtils.serialize(map));
	     
	}

}
