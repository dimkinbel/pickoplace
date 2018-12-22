package com.dimab.pp.account;

import com.dimab.pickoplace.utils.JsonUtils;
import com.google.appengine.api.datastore.*;
import com.google.gson.reflect.TypeToken;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by dima on 11-Apr-16.
 */
@WebServlet(name = "WaiterCheckPassword")
public class WaiterCheckPassword extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        String placeIDvalue = request.getParameter("placeIDvalue");
        String waiterUsername   = request.getParameter("username");
        String waiterPassword   = request.getParameter("password");

        Query.Filter placeIdFilter  = new Query.FilterPredicate("placeUniqID", Query.FilterOperator.EQUAL,placeIDvalue);
        Query q = new Query("CanvasState").setFilter(placeIdFilter);
        PreparedQuery pq = datastore.prepare(q);
        Entity userCanvasState = pq.asSingleEntity();
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("valid", false);
        if (userCanvasState != null) {

            String waiterUsernameStored = (String) userCanvasState.getProperty("Admin_username");
            String waiterPasswordStored = (String) userCanvasState.getProperty("Admin_password");
            if(waiterUsernameStored.equals(waiterUsername) && waiterPasswordStored.equals(waiterPassword)) {
                map.put("valid", true);
            }

        }
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(JsonUtils.serialize(map));
    }


}
