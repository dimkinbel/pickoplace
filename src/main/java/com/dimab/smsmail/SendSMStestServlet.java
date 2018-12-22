package com.dimab.smsmail;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * for test purposes
 */
@WebServlet("/SendSMStestServlet")
public class SendSMStestServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public SendSMStestServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String num = request.getParameter("num");
		String sms = request.getParameter("sms");
		if(num!=null && !num.isEmpty() && sms!=null && !sms.isEmpty()) {
		PlivoSendSMS plivio = new PlivoSendSMS();
			try
			{
				plivio.sendSMSPlivio("PickoPlace",num,sms);
			}
			catch (Exception e)
			{
				e.printStackTrace();
			}
		}
	}
}
