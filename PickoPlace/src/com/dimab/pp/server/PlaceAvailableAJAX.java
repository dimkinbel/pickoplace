package com.dimab.pp.server;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.dimab.pp.database.GetShapesOrders;
import com.dimab.pp.dto.BookingListForJSON;
import com.dimab.pp.dto.BookingRequest;
import com.dimab.pp.dto.BookingSingleShapeList;
import com.dimab.pp.dto.OrderedResponse;
import com.dimab.pp.dto.PPSubmitObject;
import com.dimab.pp.dto.PlaceCheckAvailableJSON;
import com.dimab.pp.dto.SingleTimeRange;
import com.dimab.pp.dto.SingleTimeRangeLong;
import com.dimab.pp.dto.WeekDayOpenClose;
import com.dimab.pp.dto.WorkingWeek;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Text;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

public class PlaceAvailableAJAX extends HttpServlet {
	private static final long serialVersionUID = 1L;

    public PlaceAvailableAJAX() {
        super();
    }

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		OrderedResponse orderedResponse = new OrderedResponse();
		GetShapesOrders orderedResponseFactory = new GetShapesOrders();
		String jsonString = request.getParameter("bookrequest");		
		Gson gson = new Gson();
		PlaceCheckAvailableJSON bookingRequest = gson.fromJson(jsonString, PlaceCheckAvailableJSON.class);
		Long date = bookingRequest.getDate1970();// Ignoring client offset
	    Long period = bookingRequest.getPeriod(); 
	    int weekday = bookingRequest.getWeekday();
	    double  placeOffset = bookingRequest.getPlaceOffset();
	    int  clientOffset = bookingRequest.getClientOffset();
	    Long UTCdate =  date + clientOffset*3600 - (long)placeOffset*3600; // date is UTC seconds relative to client browser Calendar
	    Integer UTCdateProper = date.intValue() + clientOffset*3600;
	    System.out.println("date + clientOffset - placeOffset: " + date + " + " + clientOffset*3600 + " - " + placeOffset*3600);
	    System.out.println("UTC date to check:" + UTCdate);
	    orderedResponseFactory.getOrderedResponse(orderedResponse,bookingRequest.getPid(), UTCdate, period,false);
	    orderedResponse.setDate1970(date);
	    orderedResponse.setPeriod(period);
	    orderedResponse.setClientOffset(clientOffset);
	    orderedResponse.setPlaceOffset(placeOffset);
	    orderedResponse.setPid(bookingRequest.getPid());
	    // Return place open
	    Filter placeIdFilter = new  FilterPredicate("placeUniqID",FilterOperator.EQUAL,bookingRequest.getPid());
		Query q = new Query("CanvasState").setFilter(placeIdFilter);
		PreparedQuery piq = datastore.prepare(q);
		Entity CanvasStateEntity = piq.asSingleEntity();
  		if (CanvasStateEntity != null) {
  		   String closeDatesString = (String) CanvasStateEntity.getProperty("closeDates");
  		   Type closeDateType = new TypeToken<List<Integer>>(){}.getType();
  		   List<Integer> closeDates  = gson.fromJson(closeDatesString, closeDateType);
  		   
		   String weekdays = (String) CanvasStateEntity.getProperty("workinghours");		
		   WorkingWeek weekdaysObject  = gson.fromJson(weekdays, WorkingWeek.class);
		   WeekDayOpenClose today , tomorrow;
		   if(weekday < 6) {
			   today = weekdaysObject.getWeekDayOpenClose(weekday);
			   tomorrow = weekdaysObject.getWeekDayOpenClose(weekday+1);
		   } else {
			   today = weekdaysObject.getWeekDayOpenClose(weekday);
			   tomorrow = weekdaysObject.getWeekDayOpenClose(0);
		   }
		   SingleTimeRangeLong todayOpenRange = new SingleTimeRangeLong();
		   if (today.isOpen()) {
			   todayOpenRange.setFrom(new Integer(today.getFrom()).longValue());
			   todayOpenRange.setTo(new Integer(today.getTo()).longValue());
		   } else {
			   todayOpenRange.setFrom(new Integer(0).longValue());
			   todayOpenRange.setTo(new Integer(0).longValue());
		   }
		   SingleTimeRangeLong tomorrowOpenRange = new SingleTimeRangeLong();
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
		   orderedResponse.getPlaceOpen().add(todayOpenRange);
		   orderedResponse.getPlaceOpen().add(tomorrowOpenRange);
  		}
		System.out.println(new Gson().toJson(orderedResponse));
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(new Gson().toJson(orderedResponse));
		
	}

}
