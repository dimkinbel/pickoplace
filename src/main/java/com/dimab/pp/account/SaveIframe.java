package com.dimab.pp.account;

import com.dimab.pickoplace.utils.GsonUtils;
import com.dimab.pickoplace.utils.ServletUtils;
import com.dimab.pp.dto.IFsave;
import com.dimab.pp.login.CheckTokenValid;
import com.dimab.pp.login.GenericUser;
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

public class SaveIframe extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        TransactionOptions options = TransactionOptions.Builder.withXG(true);
        Transaction txn = datastore.beginTransaction(options);
        Map<String, Object> map = new HashMap<String, Object>();
        Date date = new Date();

        String username_email = new String();
        CheckTokenValid tokenValid = new CheckTokenValid(request);
        GenericUser genuser = new GenericUser();
        try {
            genuser = tokenValid.getUser();
        } catch (NullPointerException e) {
            String returnurl = "/welcome.jsp";
            response.addHeader("Access-Control-Allow-Origin", "*");
            response.sendRedirect(returnurl);
        }
        if (genuser == null) {
            String returnurl = "/welcome.jsp";
            response.addHeader("Access-Control-Allow-Origin", "*");
            response.sendRedirect(returnurl);
        } else {
            username_email = genuser.getEmail();
        }

        String placeIDvalue = request.getParameter("pid");
        String ifid = request.getParameter("ifid");
        String ifsaveString = request.getParameter("ifsave");
        IFsave SaveObject = GsonUtils.fromJson(ifsaveString, IFsave.class);

        Filter ifidfilter = new FilterPredicate("ifid", FilterOperator.EQUAL, ifid);
        Query piq = new Query("IFrames").setFilter(ifidfilter);
        PreparedQuery sbpiq = datastore.prepare(piq);
        Entity ifidEntity = sbpiq.asSingleEntity();
        if (ifidEntity == null) {
            ifidEntity = new Entity("IFrames");
            ifidEntity.setProperty("ifid", ifid);
            ifidEntity.setProperty("pid", placeIDvalue);
            ifidEntity.setProperty("savedby", username_email);
            ifidEntity.setProperty("date", date);
            ifidEntity.setUnindexedProperty("ifjson", GsonUtils.toJson(SaveObject));
            map.put("newifid", true);
        } else {
            ifidEntity.setProperty("ifid", ifid);
            ifidEntity.setProperty("pid", placeIDvalue);
            ifidEntity.setProperty("savedby", username_email);
            ifidEntity.setProperty("date", date);
            ifidEntity.setUnindexedProperty("ifjson", GsonUtils.toJson(SaveObject));
            map.put("newifid", false);
        }
        datastore.put(ifidEntity);
        txn.commit();

        map.put("ifid", ifid);

        ServletUtils.writeJsonResponse(response, map);
    }
}
