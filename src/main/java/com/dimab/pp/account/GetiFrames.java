package com.dimab.pp.account;

import com.dimab.pickoplace.json.GsonUtils;
import com.dimab.pickoplace.utils.ServletUtils;
import com.dimab.pp.dto.IFresponse;
import com.dimab.pp.dto.IFsave;
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


public class GetiFrames extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        Map<String, Object> map = new HashMap<String, Object>();

        String placeIDvalue = request.getParameter("pid");
        List<IFresponse> ifresponse = new ArrayList<IFresponse>();

        Filter ifidfilter = new FilterPredicate("pid", FilterOperator.EQUAL, placeIDvalue);
        Query piq = new Query("IFrames").setFilter(ifidfilter);
        PreparedQuery sbpiq = datastore.prepare(piq);

        for (Entity iframeEntity : sbpiq.asIterable()) {
            String ifid = (String) iframeEntity.getProperty("ifid");
            String uid = (String) iframeEntity.getProperty("savedby");
            Date date_ = (Date) iframeEntity.getProperty("date");
            String iframe_ = (String) iframeEntity.getProperty("ifjson");
            IFsave SaveObject = GsonUtils.fromJson(iframe_, IFsave.class);
            SimpleDateFormat dateFormat = new SimpleDateFormat("ddMMMy HH:mm");
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

        ServletUtils.writeJsonResponse(response, map);
    }

}
