package com.dimab.smsmail;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Servlet implementation class PlivioSMSResponse
 */
@WebServlet("/PlivioSMSResponse")
public class PlivioSMSResponse extends HttpServlet {

    /**
     * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
     */
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("Plivio SMS response.GO GET");
        String from_number = request.getParameter("From");
        String to_number = request.getParameter("To");
        String status = request.getParameter("Status");
        String uuid = request.getParameter("MessageUUID");
        System.out.println("From : " + from_number + " To : " + to_number + " Status : " + status + " Message UUID : " + uuid);
    }

    /**
     * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
     */
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("Plivio SMS response.GO POST");
        String from_number = request.getParameter("From");
        String to_number = request.getParameter("To");
        String status = request.getParameter("Status");
        String uuid = request.getParameter("MessageUUID");
        System.out.println("From : " + from_number + " To : " + to_number + " Status : " + status + " Message UUID : " + uuid);
    }

}
