package com.dimab.pp.server;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.dimab.pickoplace.utils.JsonUtils;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory; 


public class CheckGoogleStatus extends HttpServlet {
	private static final long serialVersionUID = 1L;

    public CheckGoogleStatus() {
        super();
        // TODO Auto-generated constructor stub
    }


	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		 UserService userService = UserServiceFactory.getUserService();
		Map <String , Object> map = new HashMap<String , Object>();
		map.put("status", true);
		if (userService.getCurrentUser() != null) {
         
            String userGMail = userService.getCurrentUser().getEmail();
            map.put("status", userGMail);
		} else {
			map.put("status", "logout");
		}
  		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(JsonUtils.serialize(map));
	}

}
