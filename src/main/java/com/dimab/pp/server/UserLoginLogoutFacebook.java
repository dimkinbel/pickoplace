package com.dimab.pp.server;

import com.dimab.pickoplace.entity.EntityKind;
import com.dimab.pickoplace.json.GsonUtils;
import com.dimab.pp.dto.AJAXFacebookResponse;
import com.dimab.pp.functions.RandomStringGenerator;
import com.google.appengine.api.datastore.*;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;


public class UserLoginLogoutFacebook extends HttpServlet {
    private static final long serialVersionUID = 1L;

    public UserLoginLogoutFacebook() {
        super();
        // TODO Auto-generated constructor stub
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        TransactionOptions options = TransactionOptions.Builder.withXG(true);
        Transaction txn = datastore.beginTransaction(options);
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("logout", false);
        String jsonString = request.getParameter("fb_login");
        AJAXFacebookResponse fb_response = GsonUtils.GSON.fromJson(jsonString, AJAXFacebookResponse.class);
        System.out.println(jsonString);
        if (fb_response.getLogin().equals("login")) {
            System.out.println("Facebook Login:" + fb_response.getResponse().getEmail());
            Filter UserExists = new FilterPredicate("username", FilterOperator.EQUAL, fb_response.getResponse().getEmail());
            Query q = new Query(EntityKind.Users).setFilter(UserExists);
            PreparedQuery pq = datastore.prepare(q);
            Entity result = pq.asSingleEntity();
            if (result == null) {
                // First Username login
                Date date = new Date();
                Entity userEntity = new Entity(EntityKind.Users);
                RandomStringGenerator randomGen = new RandomStringGenerator();
                String random = randomGen.generateRandomString(10, RandomStringGenerator.Mode.ALPHANUMERIC);
                userEntity.setProperty("username", fb_response.getResponse().getEmail());
                userEntity.setProperty("GoogleAccount", "");
                userEntity.setProperty("FacebookAccount", true);
                userEntity.setProperty("FacebookJSON", GsonUtils.GSON.toJson(fb_response.getResponse()));
                userEntity.setProperty("LoggedBy", "Facebook");
                userEntity.setProperty("UserID", random);
                userEntity.setUnindexedProperty("firstEntry", date.toString());
                userEntity.setUnindexedProperty("lastDateInSec", date.getTime() / 1000);
                userEntity.setUnindexedProperty("lastDate", date.toString());
                datastore.put(userEntity);
            } else {
                // User Not first login
                Date date = new Date();
                if (result.getProperty("GoogleAccount") == null) {
                    result.setProperty("GoogleAccount", true);
                }
                result.setProperty("LoggedBy", "Facebook");
                result.setProperty("FacebookAccount", true);
                result.setProperty("FacebookJSON", GsonUtils.GSON.toJson(fb_response.getResponse()));
                result.setUnindexedProperty("firstEntry", date.toString());
                result.setUnindexedProperty("lastDateInSec", date.getTime() / 1000);
                result.setUnindexedProperty("lastDate", date.toString());
                datastore.put(result);
            }
        } else {
            if (fb_response.getResponse().getEmail() == null) {
            } else {
                System.out.println("Facebook Logout:" + fb_response.getResponse().getEmail());
                Filter UserExists = new FilterPredicate("username", FilterOperator.EQUAL, fb_response.getResponse().getEmail());
                Query q = new Query(EntityKind.Users).setFilter(UserExists);
                PreparedQuery pq = datastore.prepare(q);
                Entity result = pq.asSingleEntity();
                if (result != null) {
                    Date date = new Date();
                    result.setUnindexedProperty("lastDateInSec", date.getTime() / 1000);
                    result.setUnindexedProperty("lastDate", date.toString());
                    datastore.put(result);
                }
            }
        }
        txn.commit();

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(GsonUtils.GSON.toJson(map));
    }
}
