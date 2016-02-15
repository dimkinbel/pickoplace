package com.dimab.pp.JSON;

import com.dimab.pickoplace.json.GsonUtils;
import com.dimab.pp.dto.PPSubmitObject;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;


public class ReceiveJSONServlet extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String jsonString = request.getParameter("boardState");
        System.out.println(jsonString);
        PPSubmitObject CS = GsonUtils.fromJson(jsonString, PPSubmitObject.class);
        System.out.println(GsonUtils.toJson(CS));
    }
}
