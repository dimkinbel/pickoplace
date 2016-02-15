package com.dimab.pp.account;

import com.dimab.pickoplace.json.GsonUtils;
import com.dimab.pp.dto.IFresponse;
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
import java.text.SimpleDateFormat;
import java.util.*;


public class DeleteiFrame extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        TransactionOptions options = TransactionOptions.Builder.withXG(true);
        Transaction txn = datastore.beginTransaction(options);

        Map<String, Object> map = new HashMap<String, Object>();

        String username_email = new String();
        CheckTokenValid tokenValid = new CheckTokenValid(request);
        try {
            GenericUser genuser = tokenValid.getUser();
            if (genuser == null) {
                String returnurl = "/welcome.jsp";
                response.addHeader("Access-Control-Allow-Origin", "*");
                response.sendRedirect(returnurl);
            } else {
                username_email = genuser.getEmail();
            }
        } catch (NullPointerException e) {
            String returnurl = "/welcome.jsp";
            response.addHeader("Access-Control-Allow-Origin", "*");
            response.sendRedirect(returnurl);
        }
        String placeIDvalue = request.getParameter("pid");
        String iFID = request.getParameter("ifid");

        Filter ifidfilter = new FilterPredicate("ifid", FilterOperator.EQUAL, iFID);
        Query piq = new Query("IFrames").setFilter(ifidfilter);
        PreparedQuery sbpiq = datastore.prepare(piq);
        Entity ifidEntity = sbpiq.asSingleEntity();
        if (ifidEntity != null) {
            datastore.delete(ifidEntity.getKey());
            txn.commit();
            map.put("status", "removed");
        } else {
            map.put("status", "notremoved");
        }
        List<IFresponse> ifresponse = new ArrayList<IFresponse>();

        Filter ifidfilterList = new FilterPredicate("pid", FilterOperator.EQUAL, placeIDvalue);
        Query piql = new Query("IFrames").setFilter(ifidfilterList);
        PreparedQuery sbpiql = datastore.prepare(piql);

        for (Entity iframeEntity : sbpiql.asIterable()) {
            String ifid = (String) iframeEntity.getProperty("ifid");
            String uid = (String) iframeEntity.getProperty("savedby");
            Date date_ = (Date) iframeEntity.getProperty("date");
            String iframe_ = (String) iframeEntity.getProperty("ifjson");
            IFsave SaveObject = GsonUtils.fromJson(iframe_, IFsave.class);
            SimpleDateFormat dateFormat = new SimpleDateFormat("wwMMMy HH:mm");
            System.out.println("date: " + dateFormat.format(date_));

            IFresponse ifresp = new IFresponse();
            ifresp.setDate(dateFormat.format(date_));
            ifresp.setIfid(ifid);
            ifresp.setSavedby(uid);
            ifresp.setTime(date_.getTime());
            ifresp.setIframedata(SaveObject);
            ifresponse.add(ifresp);

        }
        Collections.sort(ifresponse, new Comparator<IFresponse>() {
            @Override
            public int compare(IFresponse o1, IFresponse o2) {
                return -1 * o1.getTime().compareTo(o2.getTime());
            }
        });
        if (ifresponse.size() > 0) {
            map.put("size", ifresponse.size());
            map.put("list", ifresponse);
        } else {
            map.put("size", 0);
        }

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(GsonUtils.toJson(map));
    }
}
