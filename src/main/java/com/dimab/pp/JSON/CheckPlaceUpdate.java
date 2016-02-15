package com.dimab.pp.JSON;

import com.dimab.pickoplace.utils.GsonUtils;
import com.dimab.pickoplace.utils.ServletUtils;
import com.dimab.pp.dto.ValidatePlaceUpdate;
import com.dimab.pp.login.CheckTokenValid;
import com.dimab.pp.login.GenericUser;
import com.google.appengine.api.datastore.*;
import com.google.appengine.api.datastore.Query.CompositeFilterOperator;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class CheckPlaceUpdate extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

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

        String jsonString = request.getParameter("jsonObject");
        System.out.println(jsonString);
        ValidatePlaceUpdate validateData = GsonUtils.fromJson(jsonString, ValidatePlaceUpdate.class);

        Filter usernameFilter = new FilterPredicate("username", FilterOperator.EQUAL, username_email);
        Filter placeNameFilter = new FilterPredicate("placeName", FilterOperator.EQUAL, validateData.getPlaceName());
        Filter branchNameFilter = new FilterPredicate("placeBranchName", FilterOperator.EQUAL, validateData.getBranchName());
        Filter placeIdFilter = new FilterPredicate("placeUniqID", FilterOperator.EQUAL, validateData.getPlaceID());
        System.out.println(username_email + "/" + validateData.getPlaceName() + "/" + validateData.getBranchName() + "/" + validateData.getPlaceID());
        Filter filter = CompositeFilterOperator.and(usernameFilter,
                placeNameFilter,
                branchNameFilter,
                placeIdFilter);
        Query q = new Query("CanvasState").setFilter(filter);
        PreparedQuery pq = datastore.prepare(q);
        Entity canvasStateEntity = pq.asSingleEntity();
        if (canvasStateEntity != null) {
            System.out.println("Entity exists");
            Map<String, Object> map = new HashMap<String, Object>();
            map.put("exists", true);

            ServletUtils.writeJsonResponse(response, map);
        }
    }
}
