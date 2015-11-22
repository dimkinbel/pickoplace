package com.dimab.pp.server;

import com.typesafe.config.Config;
import com.typesafe.config.ConfigFactory;
import org.json.JSONException;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;


public class FaceBookSignIn extends HttpServlet {

    private final String facebookSecret;

    public FaceBookSignIn() {
        Config config = ConfigFactory.load();
        facebookSecret = config.getString("facebookSecret");
    }

    public void doGet(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {            
        String code = req.getParameter("code");
        if (code == null || code.equals("")) {
            // an error occurred, handle this
        }

        String token = null;
        try {
            String g = "https://graph.facebook.com/oauth/access_token?client_id=953909477967729&redirect_uri=" + URLEncoder.encode("http://pickoplace.com/signin_fb", "UTF-8") + "&client_secret=" + facebookSecret +"&code=" + code;
            URL u = new URL(g);
            URLConnection c = u.openConnection();
            BufferedReader in = new BufferedReader(new InputStreamReader(c.getInputStream()));
            String inputLine;
            System.out.println("IN:"+in);
            StringBuffer b = new StringBuffer();
            while ((inputLine = in.readLine()) != null)
                b.append(inputLine + "\n");            
            in.close();
            token = b.toString();
            if (token.startsWith("{"))
                throw new Exception("error on requesting token: " + token + " with code: " + code);
        } catch (Exception e) {
                // an error occurred, handle this
        }

        String graph = null;
        System.out.println("Token:"+token);
        try {
            String g = "https://graph.facebook.com/me?" + token;
            URL u = new URL(g);
            URLConnection c = u.openConnection();
            BufferedReader in = new BufferedReader(new InputStreamReader(c.getInputStream()));
            String inputLine;
            StringBuffer b = new StringBuffer();
            while ((inputLine = in.readLine()) != null)
                b.append(inputLine + "\n");            
            in.close();
            graph = b.toString();
        } catch (Exception e) {
                // an error occurred, handle this
        }

        String facebookId;
        String firstName;
        String middleNames;
        String lastName;
        String email;
        try {
            JSONObject json = new JSONObject(graph);
            facebookId = json.getString("id");
            firstName = json.getString("first_name");
            if (json.has("middle_name"))
               middleNames = json.getString("middle_name");
            else
                middleNames = null;
            if (middleNames != null && middleNames.equals(""))
                middleNames = null;
            lastName = json.getString("last_name");
            email = json.getString("email");
            if (json.has("gender")) {
                String g = json.getString("gender");

            } else {
            }
            System.out.println(graph);
        } catch (JSONException e) {
            // an error occurred, handle this
        }

    }

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

}
