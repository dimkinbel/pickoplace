package com.dimab.pp.tests;

import com.dimab.pickoplace.utils.JsonUtils;
import com.dimab.pp.login.FBVerifyToken;
import com.dimab.pp.login.GoogVerifyToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeTokenRequest;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.Reader;

/**
 * Created by dima on 08-Apr-16.
 */
@WebServlet(name = "GoogleTokenTest")
public class GoogleTokenTest extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String code = request.getParameter("code");
        GoogVerifyToken tokenVerifier = new GoogVerifyToken();
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        FBVerifyToken fbVerifier = new FBVerifyToken();
        String llat = fbVerifier.getLongLivedAccessToken(code);

        //String accessToken =  tokenVerifier.getAccessTokenByRefresh(code);
        out.println("<html>");
        out.println("<head>");
        out.println("<title>GTEST</title>");
        out.println("</head>");
        out.println("<body bgcolor=\"white\">");
        out.println(llat+"<br>");

        out.println("</body>");
        out.println("</html>");
    }
}
