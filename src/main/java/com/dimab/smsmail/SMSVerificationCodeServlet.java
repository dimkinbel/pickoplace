package com.dimab.smsmail;

import com.dimab.pickoplace.entity.EntityKind;
import com.google.appengine.api.datastore.*;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Servlet implementation class SMSVerificationCodeServlet
 */
@WebServlet("/SMSVerificationCodeServlet")
public class SMSVerificationCodeServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;


    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Map<String, Object> map = new HashMap<String, Object>();
        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        TransactionOptions options = TransactionOptions.Builder.withXG(true);
        Transaction txn = datastore.beginTransaction(options);

        String vaerifiactionCode = request.getParameter("code");
        String sessionEmail = (String) request.getSession().getAttribute("userEmail");
        if (sessionEmail == null || sessionEmail.isEmpty()) {
            map.put("status", "NOTLOGGED");
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(new Gson().toJson(map));
            return;
        } else {
            Filter UserExists = new FilterPredicate("username", FilterOperator.EQUAL, sessionEmail);
            Query q = new Query(EntityKind.Users).setFilter(UserExists);
            PreparedQuery pq = datastore.prepare(q);
            Entity result = pq.asSingleEntity();
            if (result == null) {
                map.put("status", "NOTLOGGED");
                response.setContentType("application/json");
                response.setCharacterEncoding("UTF-8");
                response.getWriter().write(new Gson().toJson(map));
                return;
            } else {
                if (result.getProperty("validationCode") == null) {
                    map.put("status", "NOCODE");
                    response.setContentType("application/json");
                    response.setCharacterEncoding("UTF-8");
                    response.getWriter().write(new Gson().toJson(map));
                    return;
                } else {
                    String datastoreCode = (String) result.getProperty("validationCode");
                    if (datastoreCode.isEmpty()) {
                        map.put("status", "NOCODE");
                        response.setContentType("application/json");
                        response.setCharacterEncoding("UTF-8");
                        response.getWriter().write(new Gson().toJson(map));
                        return;
                    } else {
                        if (datastoreCode.equals(vaerifiactionCode)) {
                            map.put("status", "OK");
                            result.setUnindexedProperty("phoneValid", true);

                            datastore.put(result);
                            txn.commit();

                            response.setContentType("application/json");
                            response.setCharacterEncoding("UTF-8");
                            response.getWriter().write(new Gson().toJson(map));
                            return;
                        } else {
                            map.put("status", "WRONG");
                            response.setContentType("application/json");
                            response.setCharacterEncoding("UTF-8");
                            response.getWriter().write(new Gson().toJson(map));
                            return;
                        }
                    }
                }
            }
        }
    }

}
