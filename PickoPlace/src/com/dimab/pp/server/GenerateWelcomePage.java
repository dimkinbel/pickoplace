package com.dimab.pp.server;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.dimab.pp.database.GetPlaceInfoFactory;
import com.dimab.pp.dto.PPSubmitObject;
import com.dimab.pp.dto.PlaceInfo;
import com.dimab.pp.dto.UserPlace;
import com.dimab.pp.dto.WelcomePageData;
import com.google.appengine.api.datastore.Cursor;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.QueryResultList;
import com.google.appengine.api.datastore.Text;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.appengine.api.images.ImagesService;
import com.google.appengine.api.images.ImagesServiceFactory;
import com.google.appengine.api.images.ServingUrlOptions;
import com.google.appengine.api.memcache.ErrorHandlers;
import com.google.appengine.api.memcache.MemcacheService;
import com.google.appengine.api.memcache.MemcacheServiceFactory;
import com.google.appengine.tools.cloudstorage.GcsFilename;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;


public class GenerateWelcomePage extends HttpServlet {
	private static final long serialVersionUID = 1L;
    private String lastCursor = "";
    public GenerateWelcomePage() {
        super();

    }

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		String lastCursor = request.getParameter("cursor");
		String num = request.getParameter("num");
		Integer numInt =  Integer.parseInt(num);
		if(lastCursor==null || lastCursor.isEmpty() ) {
			lastCursor = "";
		}
		
		System.out.println(request.getLocale());
		GetPlaceInfoFactory placeInfoFactory = new GetPlaceInfoFactory();
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		WelcomePageData welcomePagedata = new WelcomePageData();
		
		QueryResultList<Entity> CanvasStateEntities = getNEntities(numInt,lastCursor);
		for (Entity csEntity : CanvasStateEntities) {
			PlaceInfo placeInfo = placeInfoFactory.getPlaceInfo(datastore, csEntity, 222);
			welcomePagedata.getPlaces().add(placeInfo);			
		}
		
		welcomePagedata.setCursor(this.lastCursor);
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(new Gson().toJson(welcomePagedata));
	}

	
	QueryResultList<Entity> getNEntities(int n,String cursor) {
		
		  DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		  
		  FetchOptions fetchOptions = FetchOptions.Builder.withLimit(n);
		  if(cursor!=null && !cursor.isEmpty() ) {
			  fetchOptions.startCursor(Cursor.fromWebSafeString(cursor));
		  }
		     		  
		  Query q = new Query("CanvasState")
		                  .addSort("DateUpdatedSec", SortDirection.DESCENDING);
		  
		  PreparedQuery pq = datastore.prepare(q);
		  QueryResultList<Entity> results = pq.asQueryResultList(fetchOptions);
		  this.lastCursor=results.getCursor().toWebSafeString();
		  return results;
		}
}
