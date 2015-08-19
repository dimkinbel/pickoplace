package com.dimab.pp.search;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.dimab.pp.database.GetPlaceInfoFactory;
import com.dimab.pp.dto.PlaceInfo;
import com.dimab.pp.dto.SearchRequestJSON;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.CompositeFilterOperator;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.gson.Gson;


public class SearchNameGeo extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String name = request.getParameter("name");
		String lats = request.getParameter("lat");
		String lngs = request.getParameter("lng");
		String rads = request.getParameter("rad");
		Map <String , Object> map = new HashMap<String , Object>();		
		if(name==null || lats ==null || lngs ==null || rads ==null) {
			map.put("status", "requestError");
			response.setContentType("application/json");
			response.setCharacterEncoding("UTF-8");
			response.getWriter().write(new Gson().toJson(map));
			return;
		}
		System.out.println(name+" "+lats+" "+lngs+" "+rads);
		Double lat  = Double.parseDouble(lats);
		Double lng  = Double.parseDouble(lngs);
		Integer rad = Integer.parseInt(rads);

		SearchRequestJSON searchObject = new SearchRequestJSON();
		searchObject.setName(name);
		searchObject.setLat(lat);
		searchObject.setLng(lng);
		searchObject.setRadius(rad);
		
		SearchFabric searchIndexFabrix = new SearchFabric();
		List<String> pids = searchIndexFabrix.getPlacesBySearchObject(searchObject);
		if(pids==null) {
			// Error in search request
			map.put("status", "searchError");
        } else if (pids.size()==0) {
        	// No places found
        	map.put("status", "zero");
        } else {
        	DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        	List<Filter> subFilters = new ArrayList<Filter>();
        	for(String pid : pids) {

        		Filter pidFilter =  new FilterPredicate("placeUniqID",
        				                      FilterOperator.EQUAL,
        				                      pid);
        		subFilters.add(pidFilter);
        	}
        	List<PlaceInfo> places = new ArrayList<PlaceInfo>();
        	Filter allPidsFilters ;
        	if(subFilters.size()==1) {
        		allPidsFilters = subFilters.get(0);
        	} else {
        		allPidsFilters = CompositeFilterOperator.or(subFilters);
        	}

        	Query q = new Query("CanvasState").setFilter(allPidsFilters);
    		PreparedQuery pq = datastore.prepare(q);
    		for (Entity canvasEntity : pq.asIterable()) {
    			GetPlaceInfoFactory placeDataFActory = new GetPlaceInfoFactory();
    			places.add(placeDataFActory.getPlaceInfo(datastore, canvasEntity, 222));
    			
    		}
    		map.put("status", "OK");
    		map.put("places", places);
        }
        response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(new Gson().toJson(map));
	}

}
