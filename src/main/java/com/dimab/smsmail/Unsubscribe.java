package com.dimab.smsmail;

import com.dimab.pickoplace.utils.ServletUtils;
import com.google.appengine.api.datastore.*;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Servlet implementation class Unsubscribe
 */
@WebServlet("/Unsubscribe")
public class Unsubscribe extends HttpServlet {

    /**
     * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
     */
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String email = request.getParameter("email");
        String keystring = request.getParameter("ukey");
        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        TransactionOptions options = TransactionOptions.Builder.withXG(true);
        Transaction txn = datastore.beginTransaction(options);

        Map<String, Object> map = new HashMap<String, Object>();
        Key personKey = KeyFactory.stringToKey(keystring);
        try {
            Entity userEntity = datastore.get(personKey);
            String savedEmail = (String) userEntity.getProperty("username");
            if (savedEmail.equals(email)) {
                userEntity.setProperty("emailsend", false);
                datastore.put(userEntity);
                txn.commit();
                map.put("status", "OK");
            } else {
                map.put("status", "WRONGUSER");
            }
        } catch (EntityNotFoundException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            map.put("status", "ERROR");
        }

        ServletUtils.writeJsonResponse(response, map);
    }
}
