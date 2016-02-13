package com.dimab.pp.JSON;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.dimab.pickoplace.utils.JsonUtils;
import com.dimab.pp.dto.PPSubmitObject;


public class ReceiveJSONServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

    public ReceiveJSONServlet() {
        super();
    }


	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String jsonString = request.getParameter("boardState");
		System.out.println(jsonString); 
		PPSubmitObject CS = JsonUtils.deserialize(jsonString, PPSubmitObject.class);
		System.out.println(JsonUtils.serialize(CS));
	}

}
