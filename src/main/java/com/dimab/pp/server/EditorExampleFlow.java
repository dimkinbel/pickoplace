package com.dimab.pp.server;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.*;

/**
 * Created by dima on 04-May-16.
 */
@WebServlet(name = "EditorExampleFlow")
public class EditorExampleFlow extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setAttribute("creatingFlow" , "false");
        request.setAttribute("placeName", "test");
        request.setAttribute("placeBranchName", "test");
        request.setAttribute("placeAddress", "test");
        request.setAttribute("placeUniqID", "test");


            request.setAttribute("placeLat", 0);
            request.setAttribute("placeLng", 0);

        RequestDispatcher dispathser  = request.getRequestDispatcher("/drawing.jsp");
        dispathser.forward(request, response);
    }

}
