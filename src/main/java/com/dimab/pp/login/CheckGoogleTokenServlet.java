package com.dimab.pp.login;

import com.dimab.pickoplace.json.GsonUtils;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.HashMap;
import java.util.Map;

public class CheckGoogleTokenServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String accessToken = request.getParameter("at");
        Map<String, Object> map = new HashMap<String, Object>();

        System.out.println(accessToken);
        GoogVerifyToken tokenVerifier = new GoogVerifyToken(accessToken);
        System.out.println(tokenVerifier.isValid());
        if (tokenVerifier.isValid()) {
            GOOGmeResponseJSON userData = tokenVerifier.getData();
            System.out.println(userData.email);
            map.put("valid", true);
            map.put("provider", "GOOG");
            map.put("userData", userData);
        } else {
            map.put("valid", false);
        }
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(GsonUtils.GSON.toJson(map));
    }

    static void getContent(InputStream inputStream, ByteArrayOutputStream outputStream)
            throws IOException {
        // Read the response into a buffered stream
        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
        int readChar;
        while ((readChar = reader.read()) != -1) {
            outputStream.write(readChar);
        }
        reader.close();
    }
}
