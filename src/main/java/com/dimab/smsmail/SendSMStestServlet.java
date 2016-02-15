package com.dimab.smsmail;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * for test purposes
 */
@WebServlet("/SendSMStestServlet")
public class SendSMStestServlet extends HttpServlet {

    /**
     * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
     */
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String num = request.getParameter("num");
        String sms = request.getParameter("sms");
        if (num != null && !num.isEmpty() && sms != null && !sms.isEmpty()) {
            PlivoSendSMS plivio = new PlivoSendSMS();
            try {
                plivio.sendSMSPlivio("PickoPlace", num, sms);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
