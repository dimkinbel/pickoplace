package com.dimab.pp.JSON;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;




import com.dimab.pp.dto.CanvasShape;
import com.dimab.pp.dto.CanvasState;
import com.dimab.pp.dto.PPSubmitObject;
import com.google.gson.Gson;


public class ReceiveJSONServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

    public ReceiveJSONServlet() {
        super();
    }


	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String jsonString = request.getParameter("boardState");
		System.out.println(jsonString);
		Gson gson = new Gson();
		PPSubmitObject CS = gson.fromJson(jsonString, PPSubmitObject.class);
		System.out.println(gson.toJson(CS));
	}

}
