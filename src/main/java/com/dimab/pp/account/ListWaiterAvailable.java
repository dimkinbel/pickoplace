package com.dimab.pp.account;

import com.dimab.pickoplace.entity.EntityKind;
import com.dimab.pickoplace.json.GsonUtils;
import com.dimab.pp.database.GetPlaceInfoFactory;
import com.dimab.pp.dto.PlaceInfo;
import com.dimab.pp.dto.WaiterListAJAXDTO;
import com.dimab.pp.login.CheckTokenValid;
import com.dimab.pp.login.GenericUser;
import com.google.appengine.api.datastore.*;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.gson.reflect.TypeToken;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

public class ListWaiterAvailable extends HttpServlet {
    private static final long serialVersionUID = 1L;

    public ListWaiterAvailable() {
        super();
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        WaiterListAJAXDTO waiterlist = new WaiterListAJAXDTO();
        waiterlist.setStatus("incomplete");

        String username = new String();
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
            waiterlist.setStatus("not_logged");
        } else {
            username = genuser.getEmail();
            Type collectionType = new TypeToken<List<String>>() {
            }.getType();
            DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
            Filter UserExists__ = new FilterPredicate("username", FilterOperator.EQUAL, username);
            Query q__ = new Query(EntityKind.Users).setFilter(UserExists__);
            PreparedQuery pq__ = datastore.prepare(q__);
            Entity result__ = pq__.asSingleEntity();
            if (result__ != null) {
                List<String> ba_list__ = new ArrayList<String>();
                if (result__.getProperty("PID_book_admin") != null) {
                    ba_list__ = GsonUtils.GSON.fromJson((String) result__.getProperty("PID_book_admin"), collectionType);
                    if (ba_list__.size() == 0) {
                        waiterlist.setStatus("no_places");
                    } else {
                        List<PlaceInfo> waiterPlaces = new ArrayList<PlaceInfo>();
                        System.out.println("Waiter places for (" + username + ") :" + ba_list__.toString());
                        for (String pid : ba_list__) {
                            Filter pidFilter = new FilterPredicate("placeUniqID", FilterOperator.EQUAL, pid);
                            Query q = new Query("CanvasState").setFilter(pidFilter);
                            PreparedQuery pq = datastore.prepare(q);
                            Entity canvasEntity = pq.asSingleEntity();
                            if (canvasEntity != null) {
                                PlaceInfo placeInfo = new PlaceInfo();
                                GetPlaceInfoFactory placeInfoFactory = new GetPlaceInfoFactory();
                                placeInfo = placeInfoFactory.getPlaceInfo(datastore, canvasEntity, 100);
                                waiterPlaces.add(placeInfo);
                            }
                        }
                        waiterlist.setStatus("success");
                        waiterlist.setWaiterPlaces(waiterPlaces);

                    }
                } else {
                    waiterlist.setStatus("no_places");
                }
            }

        }
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(GsonUtils.GSON.toJson(waiterlist));
    }
}
