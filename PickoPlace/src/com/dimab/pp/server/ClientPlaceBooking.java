package com.dimab.pp.server;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.dimab.pp.channel.ChannelMessageFactory;
import com.dimab.pp.dto.BookingListForJSON;
import com.dimab.pp.dto.BookingRequest;
import com.dimab.pp.dto.BookingRequestWrap;
import com.dimab.pp.dto.SingleTimeRangeLong;
import com.dimab.pp.dto.WeekDayOpenClose;
import com.dimab.pp.dto.WorkingWeek;
import com.dimab.pp.login.CheckTokenValid;
import com.dimab.pp.login.GenericUser;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Text;
import com.google.appengine.api.datastore.Transaction;
import com.google.appengine.api.datastore.TransactionOptions;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;


public class ClientPlaceBooking extends HttpServlet {
	private static final long serialVersionUID = 1L;

    public ClientPlaceBooking() {
        super();
    }

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		String jsonString = request.getParameter("booking");		
		Map <String , Object> map = new HashMap<String , Object>();
		
		String username_email = new String();
		CheckTokenValid tokenValid = new CheckTokenValid(request);
		GenericUser genuser = tokenValid.getUser();
		if(genuser==null) {
			map.put("added", false);
			response.setContentType("application/json");
			response.setCharacterEncoding("UTF-8");
			response.getWriter().write(new Gson().toJson(map));
			return;
		} else {
			username_email = genuser.getEmail();
		}
		
		
     /* boolean signinRequest = false;
		if( requestSignIn != null ) {
			signinRequest = true;
			RequestDispatcher dispatcher = request.getRequestDispatcher("/tempBooking");
			dispatcher.forward(request, response);
			return;
		}*/
		
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		TransactionOptions options = TransactionOptions.Builder.withXG(true);
		Transaction txn = datastore.beginTransaction(options);
		
		map.put("added", true);
		Gson gson = new Gson();
		BookingRequestWrap bookingRequestsWrap = gson.fromJson(jsonString,BookingRequestWrap.class);
		bookingRequestsWrap.setClientid(username_email);
		List<BookingRequest> bookingRequests = bookingRequestsWrap.getBookingList();

		Long fromSeconds = bookingRequestsWrap.getDateSeconds() + bookingRequestsWrap.getTime();
		Long UTCdateProper = bookingRequestsWrap.getDateSeconds() - bookingRequestsWrap.getClientOffset()*60;

		Long secondsRelativeToClient = fromSeconds - bookingRequestsWrap.getClientOffset()*60 - (long)(bookingRequestsWrap.getPlaceOffcet()*3600);	
		Date PlaceLocalTime = new Date((secondsRelativeToClient + (long)(bookingRequestsWrap.getPlaceOffcet()*3600))*1000);
		
		
		// Get CanvasState by PID
		Filter pidFilter = new  FilterPredicate("placeUniqID",FilterOperator.EQUAL,bookingRequestsWrap.getPid());
		Query sq_ = new Query("CanvasState").setFilter(pidFilter);
		PreparedQuery psq_ = datastore.prepare(sq_);
  		Entity canvasEntity = psq_.asSingleEntity();
  		Key canvasKey = canvasEntity.getKey();
  		Integer bookingsMade;
  		if(canvasEntity.getProperty("bookingsCount")!= null) {
  		  bookingsMade = (int)(long) canvasEntity.getProperty("bookingsCount");
  		  bookingsMade+=1;
  		  canvasEntity.setProperty("bookingsCount", bookingsMade); 
  		} else {
  			bookingsMade = 1;
  			canvasEntity.setProperty("bookingsCount", bookingsMade);  			
  		}
  		Text bookingListGSON = new Text(gson.toJson(bookingRequests));
  		Entity bookingOrder = new Entity("BookingOrders",canvasKey);
  		bookingOrder.setProperty("bookingList", bookingListGSON);
  		bookingOrder.setProperty("clientid", username_email);
		bookingOrder.setProperty("bid", bookingRequestsWrap.getBookID());
		bookingOrder.setProperty("Date", PlaceLocalTime.toString());
		bookingOrder.setProperty("UTCstartSeconds", secondsRelativeToClient);
		bookingOrder.setProperty("pid", bookingRequestsWrap.getPid());
		bookingOrder.setProperty("periodSeconds", bookingRequestsWrap.getPeriod());
		bookingOrder.setProperty("weekday", bookingRequestsWrap.getWeekday());
		bookingOrder.setProperty("num",bookingsMade);
		datastore.put(bookingOrder);
		datastore.put(canvasEntity);
		
		// Check available by place open or time passed (1min)
		Date current = new Date();
		Long utcTimeSeconds = current.getTime()/1000;
		Long time = current.getTime()/1000 +  (long)(bookingRequestsWrap.getPlaceOffcet())*3600L;
		Date placeDateCurent = new Date(time*1000L);
		System.out.println("Current time at place (offset="+ bookingRequestsWrap.getPlaceOffcet()*3600 +"): " + placeDateCurent + " (" +time+")");
		boolean bookAvailable = true;
		
		// Check time passed for booking
		if(utcTimeSeconds + 60 > secondsRelativeToClient) {
			System.out.println("Plase time passed:\n   UTCTime = "+utcTimeSeconds+"\n   bookTime="+secondsRelativeToClient);			
			bookAvailable = false;
		}
		
  		if (canvasEntity != null && bookAvailable) {
   		   String closeDatesString = (String) canvasEntity.getProperty("closeDates");
   		   Type closeDateType = new TypeToken<List<Integer>>(){}.getType();
   		   List<Integer> closeDates  = gson.fromJson(closeDatesString, closeDateType);
   		   
 		   String weekdays = (String) canvasEntity.getProperty("workinghours");		
 		   WorkingWeek weekdaysObject  = gson.fromJson(weekdays, WorkingWeek.class);
 		   WeekDayOpenClose today , tomorrow;
 		   if(bookingRequestsWrap.getWeekday() < 6) {
 			   today = weekdaysObject.getWeekDayOpenClose(bookingRequestsWrap.getWeekday());
 			   tomorrow = weekdaysObject.getWeekDayOpenClose(bookingRequestsWrap.getWeekday()+1);
 		   } else {
 			   today = weekdaysObject.getWeekDayOpenClose(bookingRequestsWrap.getWeekday());
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
            // Check ranges
            Long bookFrom = bookingRequestsWrap.getTime().longValue();
            Long bookTo = bookingRequestsWrap.getTime().longValue() + bookingRequestsWrap.getPeriod().longValue();
            if((todayOpenRange.getFrom()    <= bookFrom && bookTo <= todayOpenRange.getTo() ) ||
               (tomorrowOpenRange.getFrom() <= bookFrom && bookTo <= tomorrowOpenRange.getTo())	) {
            	  
            } else {
            	System.out.println("Booking on place not working :" + todayOpenRange.getFrom() + "|" + tomorrowOpenRange.getFrom() +"<=" + bookFrom+"-"+bookTo+"<="+todayOpenRange.getTo()+"|"+tomorrowOpenRange.getTo());
            	bookAvailable = false;
            }
   		}
  		if(bookAvailable) {
		// Check available places by shapes (else delete BookingOrders entity) isAvailable
  			List<Entity> shapeEntities = new ArrayList<Entity>();
  			boolean allAvailable = true;
			for (BookingRequest bookingRequest:bookingRequests) {
				
				Filter sidFilter = new  FilterPredicate("sid",FilterOperator.EQUAL,bookingRequest.getSid());
				Query sq = new Query("Shapes").setFilter(sidFilter);
				PreparedQuery psq = datastore.prepare(sq);
		  		Entity shapeEntity = psq.asSingleEntity();
		  		if (shapeEntity != null) {
		  			Key shapeKey = shapeEntity.getKey();
		  			
		  			SingleTimeRangeLong OrderBid = new SingleTimeRangeLong();
		  			OrderBid.setBid(bookingRequest.getBookID());
		  			OrderBid.setFrom(secondsRelativeToClient);
		  			OrderBid.setTo(secondsRelativeToClient + bookingRequest.getPeriod());
		  			OrderBid.setTestID(bookingRequest.getTestID());
		  			OrderBid.setPersons(bookingRequest.getPersons()); 
		  			
		  			BookingListForJSON ordersList = new BookingListForJSON();
		  			Query so = new Query("ShapeOrdersList").setAncestor(shapeKey);
		            PreparedQuery soq = datastore.prepare(so);
			  		Entity shapeOrders = soq.asSingleEntity();
			  		if (shapeOrders == null) {
			  			shapeOrders = new Entity("ShapeOrdersList",shapeKey);
			  			shapeOrders.setProperty("sid", bookingRequest.getSid());	
			  			shapeOrders.setProperty("pid", bookingRequest.getPid());
			  			ordersList.add(OrderBid, 0);
			  			Text ordersListJSON = new Text(gson.toJson(ordersList));
			  			shapeOrders.setProperty("bookingListJSON", ordersListJSON);
			  			shapeEntities.add(shapeOrders);
			  			//datastore.put(shapeOrders);
			  			System.out.println("New Orders Entity");
			  		} else {
			  			String allOrdersJSON =   ((Text) shapeOrders.getProperty("bookingListJSON")).getValue();
			  			ordersList = gson.fromJson(allOrdersJSON, BookingListForJSON.class);
			  			boolean added = ordersList.add(OrderBid, 0);
			  			if (added) {
			  				// OK
			  				Text ordersListJSON = new Text(gson.toJson(ordersList));
			  				shapeOrders.setProperty("bookingListJSON", ordersListJSON);
			  				//datastore.put(shapeOrders);
			  				shapeEntities.add(shapeOrders);
			  			} else {
			  				allAvailable = false;
			  				//datastore.delete(bookingOrder.getKey());
			  				map.put("added", false);
			  			}
			  		}
			  			  		   
		  		}
			} 
			if(allAvailable) {
				for(Entity shapeOrders: shapeEntities) {
					datastore.put(shapeOrders);
				}
				// Update all open managers
				ChannelMessageFactory channelFactory = new ChannelMessageFactory();
				channelFactory.SendBookingUpdate(bookingRequestsWrap.getPid(),bookingRequestsWrap.getBookID());
			} else {
				datastore.delete(bookingOrder.getKey());
			}
		} else {
			datastore.delete(bookingOrder.getKey());
			map.put("added", false);
		}
  		txn.commit();
  		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(new Gson().toJson(map));
	}

}
