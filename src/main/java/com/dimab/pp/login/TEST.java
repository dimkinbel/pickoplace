package com.dimab.pp.login;

import com.google.appengine.api.urlfetch.*;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URL;


// todo(egor): remove?
public class TEST extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String accessToken = request.getParameter("at");
        String json = "{}";
        URL url = new URL("https://www.googleapis.com/oauth2/v1/userinfo?access_token=" + accessToken);
        HTTPRequest req_ = new HTTPRequest(url, HTTPMethod.GET);
        req_.addHeader(new HTTPHeader("Content-Type", "application/json"));
        //   req_.addHeader(new HTTPHeader("Authorization", "key=AIzaSyDVl5KlOhHdxlat0OOn0cNZ7k9Y_AVyM3g"));
        req_.setPayload(json.getBytes("UTF-8"));
        HTTPResponse resp_ = URLFetchServiceFactory.getURLFetchService().fetch(req_);
        System.out.println(resp_.getResponseCode());
        String str = new String(resp_.getContent(), "UTF-8");
        System.out.println(str);
    }

}
