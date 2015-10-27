package com.dimab.pp.login;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

public class SetSessionTokenProvider extends HttpServlet {
	private static final long serialVersionUID = 1L;
       

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String accessToken = request.getParameter("access_token");
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
		response.getWriter().write(new Gson().toJson(map));
	     
	}

}
