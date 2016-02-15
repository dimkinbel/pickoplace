package com.dimab.pp.server;

import com.dimab.pickoplace.entity.EntityKind;
import com.dimab.pickoplace.json.GsonUtils;
import com.dimab.pp.functions.RandomStringGenerator;
import com.google.appengine.api.datastore.*;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;


public class UserLoginLogout extends HttpServlet {

    /**
     * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
     */
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        HttpSession session = req.getSession();
        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        TransactionOptions options = TransactionOptions.Builder.withXG(true);
        Transaction txn = datastore.beginTransaction(options);
        String returnurl = (String) session.getAttribute("urlreturn");

        System.out.println(returnurl);
        resp.setContentType("text/html");
        if (req.getUserPrincipal() != null) {
            System.out.println("User Login:" + req.getUserPrincipal().getName());
            String userGMail = req.getUserPrincipal().getName();

            Filter UserExists = new FilterPredicate("username", FilterOperator.EQUAL, userGMail);
            Query q = new Query(EntityKind.Users).setFilter(UserExists);
            PreparedQuery pq = datastore.prepare(q);
            Entity result = pq.asSingleEntity();
            if (result == null) {
                // First Username login
                Date date = new Date();
                Entity userEntity = new Entity(EntityKind.Users);
                RandomStringGenerator randomGen = new RandomStringGenerator();
                String random = randomGen.generateRandomString(10, RandomStringGenerator.Mode.ALPHANUMERIC);
                userEntity.setProperty("username", userGMail);
                userEntity.setProperty("GoogleAccount", true);
                userEntity.setProperty("FacebookAccount", "");
                userEntity.setProperty("LoggedBy", "Google");
                userEntity.setProperty("UserID", random);
                userEntity.setUnindexedProperty("firstEntry", date.toString());
                userEntity.setUnindexedProperty("lastDateInSec", date.getTime() / 1000);
                userEntity.setUnindexedProperty("lastDate", date.toString());

                List<String> pids = new ArrayList<String>();
                userEntity.setUnindexedProperty("PID_full_access", GsonUtils.toJson(pids));
                userEntity.setUnindexedProperty("PID_edit_place", GsonUtils.toJson(pids));
                userEntity.setUnindexedProperty("PID_move_only", GsonUtils.toJson(pids));
                userEntity.setUnindexedProperty("PID_book_admin", GsonUtils.toJson(pids));
                datastore.put(userEntity);
            } else {
                // User Not first login
                Date date = new Date();
                result.setProperty("LoggedBy", "Google");
                result.setProperty("GoogleAccount", true);
                result.setUnindexedProperty("firstEntry", date.toString());
                result.setUnindexedProperty("lastDateInSec", date.getTime() / 1000);
                result.setUnindexedProperty("lastDate", date.toString());
                datastore.put(result);
            }

        } else {
            String userEmailsession = (String) session.getAttribute("userEmail");
            System.out.println("User Logout:" + userEmailsession);
            Filter UserExists = new FilterPredicate("username", FilterOperator.EQUAL, userEmailsession);
            Query q = new Query(EntityKind.Users).setFilter(UserExists);
            PreparedQuery pq = datastore.prepare(q);
            Entity result = pq.asSingleEntity();
            if (result != null) {
                Date date = new Date();
                result.setUnindexedProperty("lastDateInSec", date.getTime() / 1000);
                result.setUnindexedProperty("lastDate", date.toString());
                datastore.put(result);
            }
            returnurl = "/welcome.jsp";
            resp.addHeader("Access-Control-Allow-Origin", "*");
        }
        txn.commit();
        resp.sendRedirect(returnurl);
    }
}
