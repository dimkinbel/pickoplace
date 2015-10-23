package com.dimab.pp.account;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.dimab.pp.database.GetAJAXimageJSONfromCSfactory;
import com.dimab.pp.dto.AJAXImagesJSON;
import com.dimab.pp.dto.IFresponse;
import com.dimab.pp.dto.IFsave;
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
	  	IFresponse ifresp = new IFresponse();
	  	boolean showonlyResponse = true;
  		
		Filter placeIdFilter  = new  FilterPredicate("placeUniqID",FilterOperator.EQUAL,pid);
		Query q = new Query("CanvasState").setFilter(placeIdFilter);
		PreparedQuery pq = datastore.prepare(q);		
  		Entity userCanvasState = pq.asSingleEntity();
  		
  		
  		if (userCanvasState != null) {
  			CanvasStateEdit = csFactory.getBaseData(userCanvasState, datastore);	
		
			Filter ifidfilter = new  FilterPredicate("ifid",FilterOperator.EQUAL,ifid);
			Filter pidfilter = new  FilterPredicate("pid",FilterOperator.EQUAL,pid);
			Filter ifpidfilter =  CompositeFilterOperator.and(ifidfilter, pidfilter);
		    Query piq = new Query("IFrames").setFilter(ifpidfilter);
		    PreparedQuery sbpiq = datastore.prepare(piq);
		  	Entity ifidEntity = sbpiq.asSingleEntity();
		  	
	
		  	Gson gson = new Gson();
		  	if (ifidEntity != null) {
	  	  		String ifid_ = (String)ifidEntity.getProperty("ifid");
				String uid = (String)ifidEntity.getProperty("savedby");
	  			Date date_ = (Date)ifidEntity.getProperty("date");
	  			String iframe_ = (String)ifidEntity.getProperty("ifjson");
				IFsave SaveObject = gson.fromJson(iframe_, IFsave.class);
		        SimpleDateFormat dateFormat = new SimpleDateFormat("wwMMMy HH:mm");
		        
		        ifresp.setDate(dateFormat.format( date_ ));
		        ifresp.setIfid(ifid_);
		        ifresp.setSavedby(uid);
		        ifresp.setTime(date_.getTime());
		        ifresp.setIframedata(SaveObject);
		        if(showonly == null || showonly.equals("")) {
		        	// Add booking availability
		        	showonlyResponse = false;
		        	
		        }
		  	} 
  		}

  		request.setAttribute("ifid", ifid);
  		request.setAttribute("iframedata", ifresp);
  		request.setAttribute("canvasState", CanvasStateEdit);
  		request.setAttribute("showonly", showonlyResponse);
	    RequestDispatcher dispathser  = request.getRequestDispatcher("/iframepage.jsp");
	    response.addHeader("Access-Control-Allow-Origin", "*");
	    dispathser.forward(request, response);
	  	
	}

}
