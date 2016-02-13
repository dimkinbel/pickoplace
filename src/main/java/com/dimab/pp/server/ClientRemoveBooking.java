package com.dimab.pp.server;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.dimab.pickoplace.utils.JsonUtils;
import com.dimab.pp.database.FreePlaceFactory;
import com.dimab.pp.dto.BookingListForJSON;
import com.dimab.pp.dto.BookingRequest; 
import com.dimab.pp.login.CheckTokenValid;
import com.dimab.pp.login.GenericUser;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Text;
import com.google.appengine.api.datastore.Transaction;
import com.google.appengine.api.datastore.TransactionOptions;
import com.google.appengine.api.datastore.Query.CompositeFilterOperator;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate; 
import com.google.gson.reflect.TypeToken;

public class ClientRemoveBooking extends HttpServlet {
	private static final long serialVersionUID = 1L;


	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String bid = request.getParameter("bid"); 
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		TransactionOptions options = TransactionOptions.Builder.withXG(true);
		Transaction txn = datastore.beginTransaction(options);
		Map <String , String> map = new HashMap<String , String>();
		map.put("status", "false");

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
		if(genuser==null) {
			map.put("status", "nouser");
		} else {
			username_email = genuser.getEmail();
			
			System.out.println("Remove Booking.Client:"+username_email+",BID:"+bid);
			Filter usernameFilter = new FilterPredicate("clientid", FilterOperator.EQUAL,username_email);
			Filter bidFilter = new FilterPredicate("bid", FilterOperator.EQUAL,bid);		
			Filter user_and_seconds_filter = CompositeFilterOperator.and(bidFilter, usernameFilter);
			Query sq_ = new Query("BookingOrders").setFilter(user_and_seconds_filter);
			PreparedQuery psq_ = datastore.prepare(sq_);
			if(psq_.asSingleEntity()!=null) {						
	  		    Entity bidEntity = psq_.asSingleEntity();
	  		    String pid = (String)bidEntity.getProperty("pid");
	  		    String bookingListJSON =   ((Text) bidEntity.getProperty("bookingList")).getValue();
	  		    Type bookinglistType = new TypeToken<List<BookingRequest>>(){}.getType();
	  		    List<BookingRequest> bookingRequests =   JsonUtils.deserialize(bookingListJSON, bookinglistType);
	  		    
	  		    for(BookingRequest bookRequest : bookingRequests) {
	  		    	String bsid = bookRequest.getSid();
		  		    Filter placeIdFilter = new  FilterPredicate("pid",FilterOperator.EQUAL,pid);
		  		    Filter sIdFilter = new  FilterPredicate("sid",FilterOperator.EQUAL,bsid);
		  		    Filter composeFilter = CompositeFilterOperator.and(placeIdFilter,sIdFilter);
			  		Query q = new Query("ShapeOrdersList").setFilter(composeFilter);
			  		PreparedQuery pq = datastore.prepare(q);
			  		if(pq.asSingleEntity()!= null) {
			  		    Entity shapeList = pq.asSingleEntity();
			  			String sid = (String) shapeList.getProperty("sid");
		                System.out.println("Removing booking from shape:"+sid);
			  			String allOrdersJSON =   ((Text) shapeList.getProperty("bookingListJSON")).getValue();
			  			BookingListForJSON ordersList = JsonUtils.deserialize(allOrdersJSON, BookingListForJSON.class);
			  			ordersList.remove(bid);
			  			Text ordersListJSON = new Text(JsonUtils.serialize(ordersList));
			  			shapeList.setUnindexedProperty("bookingListJSON", ordersListJSON);
			  			datastore.put(shapeList);
			  		}
			  }
	  		    FreePlaceFactory freePlaceFactory = new FreePlaceFactory();
	  		    freePlaceFactory.UpdateFreePlaceRemoveBooking(bidEntity, bookingRequests,datastore);
	  		    datastore.delete(bidEntity.getKey());
	  		    map.put("status", "removed");
			}
		} 
		txn.commit();
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(JsonUtils.serialize(map));
	}

}
