package com.dimab.pp.account;

import java.io.IOException; 
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.dimab.pickoplace.utils.JsonUtils;
import com.dimab.pp.dto.IFresponse;
import com.dimab.pp.dto.IFsave;
import com.dimab.pp.dto.iFrameObj;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query; 
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;



public class GetiFrames extends HttpServlet {
	private static final long serialVersionUID = 1L;
    public GetiFrames() {
        super();
    }

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
  		Map <String , Object> map = new HashMap<String , Object>();
	
		String placeIDvalue = request.getParameter("pid");
		List<iFrameObj> ifresponse = new ArrayList<iFrameObj>();
 
		Filter ifidfilter = new  FilterPredicate("pid",FilterOperator.EQUAL,placeIDvalue);
 	    Query piq = new Query("IFrames").setFilter(ifidfilter);
        PreparedQuery sbpiq = datastore.prepare(piq);

		for (Entity iframeEntity : sbpiq.asIterable()) {
			String ifid = (String)iframeEntity.getProperty("ifid");
			String uid = (String)iframeEntity.getProperty("savedby");
  			Date date_ = (Date)iframeEntity.getProperty("date");
			Integer width = (int)(long)iframeEntity.getProperty("width");
			Integer height = (int)(long)iframeEntity.getProperty("height");
			Boolean booking = (Boolean)iframeEntity.getProperty("booking");
			String theme = (String)iframeEntity.getProperty("theme");


	        SimpleDateFormat dateFormat = new SimpleDateFormat("ddMMMy HH:mm");
	        System.out.println("date: " + dateFormat.format( date_ ) );
	        
	        iFrameObj ifresp = new iFrameObj();
	        ifresp.setDate(dateFormat.format( date_ ));
	        ifresp.setIfid(ifid);
	        ifresp.setUser(uid);
	        ifresp.setTime(date_.getTime());
	        ifresp.setWidth(width);
			ifresp.setHeight(height);
			ifresp.setBooking(booking);
			ifresp.setTheme(theme);
	        ifresponse.add(ifresp);
	        
		}
		Collections.sort(ifresponse, new Comparator<iFrameObj>(){
			@Override
			public int compare(iFrameObj o1, iFrameObj o2) {
				return -1 * o1.getTime().compareTo(o2.getTime());
			}
		});
		if(ifresponse.size()>0) {
			map.put("size", ifresponse.size());
			map.put("list", ifresponse);
		} else {
			map.put("size", 0);
		}
		
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(JsonUtils.serialize(map));
		
	}

}
