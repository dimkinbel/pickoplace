package com.dimab.pp.server;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

public class AlertBookingEvent extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        //content type must be set to text/event-stream
        response.setContentType("text/event-stream");

        //encoding must be set to UTF-8
        response.setCharacterEncoding("UTF-8");

        PrintWriter writer = response.getWriter();

        writer.write("data: " + "Book" + "\n\n");

        writer.close();
    }


}
