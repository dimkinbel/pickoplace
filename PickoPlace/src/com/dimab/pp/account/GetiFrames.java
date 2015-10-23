package com.dimab.pp.account;

import java.io.IOException;
import java.lang.reflect.Array;
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

import com.dimab.pp.dto.IFresponse;
import com.dimab.pp.dto.IFsave;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Transaction;
import com.google.appengine.api.datastore.TransactionOptions;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.gson.Gson;


public class GetiFrames extends HttpServlet {
	private static final long serialVersionUID = 1L;
    public GetiFrames() {
        super();
    }

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
  		Map <String , Object> map = new HashMap<String , Object>();
	
		String placeIDvalue = request.getParameter("pid");
		List<IFresponse> ifresponse = new ArrayList<IFresponse>();
		Gson gson = new Gson();
		
		Filter ifidfilter = new  FilterPredicate("pid",FilterOperator.EQUAL,placeIDvalue);
 	    Query piq = new Query("IFrames").setFilter(ifidfilter);
        PreparedQuery sbpiq = datastore.prepare(piq);

		for (Entity iframeEntity : sbpiq.asIterable()) {
			String ifid = (String)iframeEntity.getProperty("ifid");
			String uid = (String)iframeEntity.getProperty("savedby");
  			Date date_ = (Date)iframeEntity.getProperty("date");
  			String iframe_ = (String)iframeEntity.getProperty("ifjson");
			IFsave SaveObject = gson.fromJson(iframe_, IFsave.class);
	        SimpleDateFormat dateFormat = new SimpleDateFormat("ddMMMy HH:mm");
	        System.out.println("date: " + dateFormat.format( date_ ) );
	        
	        IFresponse ifresp = new IFresponse();
	        ifresp.setDate(dateFormat.format( date_ ));
	        ifresp.setIfid(ifid);
	        ifresp.setSavedby(uid);
	        ifresp.setTime(date_.getTime());
	        ifresp.setIframedata(SaveObject);
	        ifresponse.add(ifresp);
	        
		}
		Collections.sort(ifresponse, new Comparator<IFresponse>(){
			@Override
			public int compare(IFresponse o1, IFresponse o2) {				
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
		response.getWriter().write(new Gson().toJson(map));
		
	}

}
