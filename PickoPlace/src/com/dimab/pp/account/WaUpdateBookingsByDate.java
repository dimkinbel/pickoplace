package com.dimab.pp.account;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.dimab.pp.database.GetBookingShapesDataFactory;
import com.dimab.pp.database.GetShapesOrders;
import com.dimab.pp.dto.BookingRequestWrap;
import com.dimab.pp.dto.OrderedResponse;
import com.dimab.pp.dto.PlaceCheckAvailableJSON;
import com.dimab.pp.dto.SingleTimeRangeLong;
import com.dimab.pp.dto.WeekDayOpenClose;
import com.dimab.pp.dto.WorkingWeek;
import com.dimab.pp.login.CheckTokenValid;
import com.dimab.pp.login.GenericUser;
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
import com.google.gson.reflect.TypeToken;


public class WaUpdateBookingsByDate extends HttpServlet {
	private static final long serialVersionUID = 1L;

    public WaUpdateBookingsByDate() {
        super();
    }

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		String jsonString = request.getParameter("bookrequest");
		Map <String , Object> map = new HashMap<String , Object>();
		
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
			String returnurl = "/welcome.jsp";
			response.addHeader("Access-Control-Allow-Origin", "*");
			response.sendRedirect(returnurl);
			return;
		} else {
			username_email = genuser.getEmail();
		}
	
		Gson gson = new Gson();
		OrderedResponse orderedResponse = new OrderedResponse();
		GetShapesOrders orderedResponseFactory = new GetShapesOrders();
		SingleTimeRangeLong todayOpenRange = new SingleTimeRangeLong();
		SingleTimeRangeLong tomorrowOpenRange = new SingleTimeRangeLong();	 
  		GetBookingShapesDataFactory bookingFactory = new GetBookingShapesDataFactory();
		
		PlaceCheckAvailableJSON bookingRequest = gson.fromJson(jsonString, PlaceCheckAvailableJSON.class);
		Long date = bookingRequest.getDate1970();// Ignoring client offset
	    Long period = bookingRequest.getPeriod(); 
	    int weekday = bookingRequest.getWeekday();
	    double  placeOffset = bookingRequest.getPlaceOffset();
	    int  clientOffset = bookingRequest.getClientOffset();
	    String placeIDvalue = bookingRequest.getPid();
	    		
	    Long UTCdate =  date + clientOffset*3600 - (long)placeOffset*3600; // date is UTC seconds relative to client browser Calendar
	    Integer UTCdateProper = date.intValue() + clientOffset*3600;

	    
   
		
		Filter usernameFilter = new  FilterPredicate("username",FilterOperator.EQUAL,username_email);
		Filter placeIdFilter  = new  FilterPredicate("placeUniqID",FilterOperator.EQUAL,placeIDvalue);
		Filter composeFilter = CompositeFilterOperator.and(usernameFilter,placeIdFilter);
		Query q = new Query("CanvasState").setFilter(composeFilter);
		PreparedQuery pq = datastore.prepare(q);		
  		Entity userCanvasState = pq.asSingleEntity();
  		
  		if (userCanvasState != null) {

   		   String closeDatesString = (String) userCanvasState.getProperty("closeDates");
   		   Type closeDateType = new TypeToken<List<Integer>>(){}.getType();
   		   List<Integer> closeDates  = gson.fromJson(closeDatesString, closeDateType);
   		   
 		   String weekdays = (String) userCanvasState.getProperty("workinghours");		
 		   WorkingWeek weekdaysObject  = gson.fromJson(weekdays, WorkingWeek.class);
 		   WeekDayOpenClose today , tomorrow;
 		   if(weekday < 6) {
 			   today = weekdaysObject.getWeekDayOpenClose(weekday);
 			   tomorrow = weekdaysObject.getWeekDayOpenClose(weekday+1);
 		   } else {
 			   today = weekdaysObject.getWeekDayOpenClose(weekday);
 			   tomorrow = weekdaysObject.getWeekDayOpenClose(0);
 		   }

 		   if (today.isOpen()) {
 			   todayOpenRange.setFrom(new Integer(today.getFrom()).longValue());
 			   todayOpenRange.setTo(new Integer(today.getTo()).longValue());
 		   } else {
 			   todayOpenRange.setFrom(new Integer(0).longValue());
 			   todayOpenRange.setTo(new Integer(0).longValue());
 		   }

 		   if (tomorrow.isOpen()) {
 			   tomorrowOpenRange.setFrom(new Integer(tomorrow.getFrom() + 86400).longValue());
 			   tomorrowOpenRange.setTo(new Integer(tomorrow.getTo() + 86400).longValue());  
 		   } else {
 			   tomorrowOpenRange.setFrom(new Integer(86400).longValue());
 			   tomorrowOpenRange.setTo(new Integer(86400).longValue()); 
 		   }
 		   // Check for dates the place is close (set by Administrator)
 		   if (closeDates.contains(UTCdateProper)) {
 			   todayOpenRange.setFrom(new Integer(0).longValue());
 			   todayOpenRange.setTo(new Integer(0).longValue());
 		   } 
            if (closeDates.contains(UTCdateProper+86400)) {
 			   tomorrowOpenRange.setFrom(new Integer(86400).longValue());
 			   tomorrowOpenRange.setTo(new Integer(86400).longValue()); 
 		   }
  		}
	    orderedResponseFactory.getOrderedResponse(orderedResponse,bookingRequest.getPid(), UTCdate, period,true);
	    orderedResponse.setDate1970(UTCdateProper.longValue());
	    orderedResponse.setPeriod(period);
	    orderedResponse.setClientOffset(clientOffset);
	    orderedResponse.setPlaceOffset(placeOffset);
	    orderedResponse.setPid(bookingRequest.getPid());
	    orderedResponse.getPlaceOpen().add(todayOpenRange);
		orderedResponse.getPlaceOpen().add(tomorrowOpenRange);


	    // Bookings datastore
	    
	    List<BookingRequestWrap> bookings_ = bookingFactory.getDatastoreBookings(datastore, placeIDvalue, UTCdateProper, UTCdateProper+2*24*3600);

	    map.put("orderedResponse", orderedResponse);
	    map.put("bookings", bookings_);

	    response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(new Gson().toJson(map));
		
	}

}
