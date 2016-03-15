package com.dimab.pp.account;

import java.io.IOException;
import java.text.SimpleDateFormat; 
import java.util.Date; 

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.dimab.pickoplace.utils.JsonUtils;
import com.dimab.pp.database.GetAJAXimageJSONfromCSfactory;
import com.dimab.pp.dto.*;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.CompositeFilterOperator;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;


public class ShowIframe extends HttpServlet {
	private static final long serialVersionUID = 1L;

    public ShowIframe() {
        super();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {		
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		String pid = request.getParameter("pid");
		String ifid = request.getParameter("ifid");
		String showonly = request.getParameter("show");

  		GetAJAXimageJSONfromCSfactory csFactory = new GetAJAXimageJSONfromCSfactory();
  		AJAXImagesJSON CanvasStateEdit = new AJAXImagesJSON();
		iFrameObj ifresp = new iFrameObj();
	  	boolean showonlyResponse = true;
  		
		Filter placeIdFilter  = new  FilterPredicate("placeUniqID",FilterOperator.EQUAL,pid);
		Query q = new Query("CanvasState").setFilter(placeIdFilter);
		PreparedQuery pq = datastore.prepare(q);		
  		Entity userCanvasState = pq.asSingleEntity();
		ConfigBookingProperties BookProperties = new ConfigBookingProperties();
  		
  		if (userCanvasState != null) {
  			CanvasStateEdit = csFactory.getBaseData(userCanvasState, datastore);

			 BookProperties = JsonUtils.deserialize((String) userCanvasState.getProperty("bookingProperties"), ConfigBookingProperties.class);
			Filter ifidfilter = new  FilterPredicate("ifid",FilterOperator.EQUAL,ifid);
			Filter pidfilter = new  FilterPredicate("pid",FilterOperator.EQUAL,pid);
			Filter ifpidfilter =  CompositeFilterOperator.and(ifidfilter, pidfilter);
		    Query piq = new Query("IFrames").setFilter(ifpidfilter);
		    PreparedQuery sbpiq = datastore.prepare(piq);
		  	Entity iframeEntity = sbpiq.asSingleEntity();
		  	 
		  	if (iframeEntity != null) {
				String uid = (String)iframeEntity.getProperty("savedby");
				Date date_ = (Date)iframeEntity.getProperty("date");
				Integer width = (int)(long)iframeEntity.getProperty("width");
				Integer height = (int)(long)iframeEntity.getProperty("height");
				Boolean booking = (Boolean)iframeEntity.getProperty("booking");
				String theme = (String)iframeEntity.getProperty("theme");
				SimpleDateFormat dateFormat = new SimpleDateFormat("ddMMMy HH:mm");

		        ifresp.setDate(dateFormat.format( date_ ));
		        ifresp.setIfid(ifid);
		        ifresp.setUser(uid);
		        ifresp.setTime(date_.getTime());
		        ifresp.setBooking(booking);
				ifresp.setWidth(width);
				ifresp.setHeight(height);
				ifresp.setTheme(theme);
		        if(showonly == null || showonly.equals("")) {
		        	// Add booking availability
		        	showonlyResponse = false;
		        	
		        }
		  	} 
  		}

  		request.setAttribute("ifid", ifid);
  		request.setAttribute("iframedata", ifresp);
  		request.setAttribute("canvasState", CanvasStateEdit);
		request.setAttribute("bookProperties", BookProperties);
  		request.setAttribute("showonly", showonlyResponse);
	    RequestDispatcher dispathser  = request.getRequestDispatcher("/iframepage.jsp");
	    response.addHeader("Access-Control-Allow-Origin", "*");
	    dispathser.forward(request, response);
	  	
	}

}
