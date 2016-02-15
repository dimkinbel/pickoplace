package com.dimab.pp.search;

import com.dimab.pickoplace.utils.ServletUtils;
import com.dimab.pp.database.GetPlaceInfoFactory;
import com.dimab.pp.dto.PlaceInfo;
import com.dimab.pp.dto.SearchPidsAndCursor;
import com.dimab.pp.dto.SearchRequestJSON;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.appengine.api.search.Cursor;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class SearchNameGeo extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String name = request.getParameter("name");
        String lats = request.getParameter("lat");
        String lngs = request.getParameter("lng");
        String rads = request.getParameter("rad");
        String nameOnly = request.getParameter("nameOnly");
        String cursor_ = request.getParameter("cursor");
        Cursor cursor = Cursor.newBuilder().build();
        //String cursorString = cursor.toWebSafeString();
        // Save the string ... and restore:
        //Cursor cursor = Cursor.newBuilder().build(cursorString));
        if (cursor_.equals("init")) {
            cursor = Cursor.newBuilder().build();
        } else {
            cursor = Cursor.newBuilder().build(cursor_);
        }
        Map<String, Object> map = new HashMap<String, Object>();
        if (name == null || lats == null || lngs == null || rads == null) {
            map.put("status", "requestError");

            ServletUtils.writeJsonResponse(response, map);
            return;
        }
        System.out.println(name + " " + lats + " " + lngs + " " + rads);
        Double lat = Double.parseDouble(lats);
        Double lng = Double.parseDouble(lngs);
        Integer rad = Integer.parseInt(rads);

        SearchRequestJSON searchObject = new SearchRequestJSON();
        searchObject.setName(name);
        searchObject.setLat(lat);
        searchObject.setLng(lng);
        searchObject.setRadius(rad);
        searchObject.setCursor(cursor);
        searchObject.setSearchLimit(6);

        SearchFabric searchIndexFabrix = new SearchFabric();
        SearchPidsAndCursor searchResult = new SearchPidsAndCursor();
        if (nameOnly.equals("true")) {
            System.out.println("NameOnly");
            searchResult = searchIndexFabrix.getPlacesBySearchObjectNameOnly(searchObject);
        } else {
            searchResult = searchIndexFabrix.getPlacesBySearchObject(searchObject);
        }
        if (searchResult == null) {
            // Error in search request
            map.put("status", "searchError");
        } else if (searchResult.getPids().size() == 0) {
            // No places found
            map.put("status", "zero");
        } else {
            DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

            List<PlaceInfo> places = new ArrayList<PlaceInfo>();

            for (String pid_ : searchResult.getPids()) {
                Filter pidFilter = new FilterPredicate("placeUniqID",
                        FilterOperator.EQUAL,
                        pid_);
                Query q = new Query("CanvasState").setFilter(pidFilter);
                PreparedQuery pq = datastore.prepare(q);
                if (pq.asSingleEntity() != null) {
                    GetPlaceInfoFactory placeDataFActory = new GetPlaceInfoFactory();
                    places.add(placeDataFActory.getPlaceInfo(datastore, pq.asSingleEntity(), 222));
                }
            }

            map.put("status", "OK");
            map.put("places", places);
            if (searchResult.getCursor() == null) {
                map.put("cursor", "null");
            } else {
                map.put("cursor", searchResult.getCursor().toWebSafeString());
            }
        }

        ServletUtils.writeJsonResponse(response, map);
    }
}
