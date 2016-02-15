package com.dimab.pp.account;

import com.dimab.pickoplace.utils.GsonUtils;
import com.dimab.pp.database.GetAJAXimageJSONfromCSfactory;
import com.dimab.pp.dto.AJAXImagesJSON;
import com.dimab.pp.dto.IFresponse;
import com.dimab.pp.dto.IFsave;
import com.dimab.pp.dto.JsonImageID_2_GCSurl;
import com.dimab.pp.login.CheckTokenValid;
import com.dimab.pp.login.GenericUser;
import com.google.appengine.api.datastore.*;
import com.google.appengine.api.datastore.Query.CompositeFilterOperator;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;


public class EditIFrame extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        String placeIDvalue = request.getParameter("placeIDvalue");
        String ifid = request.getParameter("iFIDvalue");

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
            return;
        } else {
            username_email = genuser.getEmail();
        }

        GetAJAXimageJSONfromCSfactory csFactory = new GetAJAXimageJSONfromCSfactory();
        List<JsonImageID_2_GCSurl> JSONimageID2url = new ArrayList<JsonImageID_2_GCSurl>();
        AJAXImagesJSON CanvasStateEdit = new AJAXImagesJSON();

        Filter usernameFilter = new FilterPredicate("username", FilterOperator.EQUAL, username_email);
        Filter placeIdFilter = new FilterPredicate("placeUniqID", FilterOperator.EQUAL, placeIDvalue);
        Filter composeFilter = CompositeFilterOperator.and(usernameFilter, placeIdFilter);
        Query q = new Query("CanvasState").setFilter(composeFilter);
        PreparedQuery pq = datastore.prepare(q);
        Entity userCanvasState = pq.asSingleEntity();

        if (userCanvasState != null) {
            CanvasStateEdit = csFactory.getBaseData(userCanvasState, datastore);

        }
        IFresponse ifresp = new IFresponse();
        if (ifid != null && !ifid.isEmpty()) {
            Filter ifidfilter = new FilterPredicate("ifid", FilterOperator.EQUAL, ifid);
            Query piq = new Query("IFrames").setFilter(ifidfilter);
            PreparedQuery sbpiq = datastore.prepare(piq);
            Entity ifidEntity = sbpiq.asSingleEntity();
            if (ifidEntity != null) {
                String ifid_ = (String) ifidEntity.getProperty("ifid");
                String uid = (String) ifidEntity.getProperty("savedby");
                Date date_ = (Date) ifidEntity.getProperty("date");
                String iframe_ = (String) ifidEntity.getProperty("ifjson");
                IFsave SaveObject = GsonUtils.fromJson(iframe_, IFsave.class);
                SimpleDateFormat dateFormat = new SimpleDateFormat("wwMMMy HH:mm");
                System.out.println("date: " + dateFormat.format(date_));

                ifresp.setDate(dateFormat.format(date_));
                ifresp.setIfid(ifid_);
                ifresp.setSavedby(uid);
                ifresp.setTime(date_.getTime());
                ifresp.setIframedata(SaveObject);

            }
        }
        request.setAttribute("ifid", ifid);
        request.setAttribute("iframedata", ifresp);
        request.setAttribute("canvasState", CanvasStateEdit);
        RequestDispatcher dispathser = request.getRequestDispatcher("/iframeEditor.jsp");
        response.addHeader("Access-Control-Allow-Origin", "*");
        dispathser.forward(request, response);
    }
}
