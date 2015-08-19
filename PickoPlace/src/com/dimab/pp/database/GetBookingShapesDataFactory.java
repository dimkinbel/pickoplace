package com.dimab.pp.database;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.dimab.pp.dto.BookingDTO;
import com.dimab.pp.dto.BookingRequest;
import com.dimab.pp.dto.BookingRequestWrap;
import com.dimab.pp.dto.CanvasShape;
import com.dimab.pp.dto.PPSubmitObject;
import com.dimab.pp.dto.PlaceInfo;
import com.dimab.pp.dto.ShapeInfo;
import com.dimab.pp.dto.SingleShapeBookingResponse;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Text;
import com.google.appengine.api.datastore.Query.CompositeFilterOperator;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
//String pid;
//String sid;
//String floorid;
//String overviewURL = new String();
//String type = new String();
//String imgID = new String();
//double w;
//double h;
//double x;
//double y;
//double angle;
//int min;
//int max;
public class GetBookingShapesDataFactory {
	  public List<SingleShapeBookingResponse> getShapeInfo(DatastoreService datastore , Entity csEntity , List<String> shapesIDs) {
		  List<SingleShapeBookingResponse> shapesBookingList = new ArrayList<SingleShapeBookingResponse>();
		  
		  String shapesJSON =  ((Text) csEntity.getProperty("shapesJSON")).getValue();
	      String placeID = (String) csEntity.getProperty("placeUniqID");
	      
	      Gson gson = new Gson();
			Type CanvasListcollectionType = new TypeToken<List<PPSubmitObject>>(){}.getType();
			List<PPSubmitObject> floors = gson.fromJson(shapesJSON, CanvasListcollectionType);
			// Restore shapes booking options
			for (PPSubmitObject floor : floors) {
				String floorName = floor.getFloor_name();
				for (CanvasShape shape : floor.getShapes()) {
					if(shapesIDs.contains(shape.getSid())){
					  ShapeInfo shapeInfo = new ShapeInfo();
					  SingleShapeBookingResponse bookingShape = new SingleShapeBookingResponse();
					  String ShapeSID = shape.getSid();
					  shapeInfo.setName(shape.getBooking_options().getGivenName());
					  shapeInfo.setPid(placeID);
					  shapeInfo.setSid(ShapeSID);
					  shapeInfo.setFloorid(floor.getFloorid());
					  shapeInfo.setType(shape.getType());
					  shapeInfo.setW(shape.getW());
					  shapeInfo.setH(shape.getH());
					  shapeInfo.setX(shape.getX());
					  shapeInfo.setY(shape.getY());
					  shapeInfo.setAngle(shape.getAngle());
					  shapeInfo.setOptions(shape.getOptions());
					  shapeInfo.setMax(shape.getBooking_options().getMaxPersons());
					  shapeInfo.setMin(shape.getBooking_options().getMinPersons());
					  shapeInfo.setFloorname(floorName);
					  if(shape.getType().contains("image")) {
					   shapeInfo.setImgID(shape.getOptions().getImgID());
					  } else {
					   shapeInfo.setImgID("");  
					  }
					  bookingShape.setPid(placeID);
					  bookingShape.setSid(ShapeSID);
					  bookingShape.setShapeInfo(shapeInfo);
					  shapesBookingList.add(bookingShape);
					}
				}
			}
		  return shapesBookingList;
	  }
	  
	  // Return list of bookings as stored in datastore Bookings
	  public List<BookingRequestWrap> getDatastoreBookings(DatastoreService datastore , String pid , Integer from , Integer to) {
		    List<BookingRequestWrap> bookings = new ArrayList<BookingRequestWrap>();
		    Gson gson = new Gson();
			Filter greaterF = new FilterPredicate("UTCstartSeconds", FilterOperator.GREATER_THAN_OR_EQUAL,from);
			Filter lessF =   new FilterPredicate("UTCstartSeconds", FilterOperator.LESS_THAN_OR_EQUAL,to);
			Filter pidF = new FilterPredicate("pid", FilterOperator.EQUAL,pid);
			Filter pid_and_range_filter  = CompositeFilterOperator.and(pidF,greaterF, lessF);

			Query q = new Query("BookingOrders").setFilter(pid_and_range_filter).addSort("UTCstartSeconds", SortDirection.ASCENDING);
	        PreparedQuery pq = datastore.prepare(q);
	        for (Entity BookingEntity : pq.asIterable()) { 
	        	Integer startAt = (int)(long)BookingEntity.getProperty("UTCstartSeconds");
				String pid_ = (String)BookingEntity.getProperty("pid");
				String bid = (String)BookingEntity.getProperty("bid");
				String client = (String)BookingEntity.getProperty("clientid");
				Integer period = (int)(long)BookingEntity.getProperty("periodSeconds");
				Integer weekday = (int)(long)BookingEntity.getProperty("weekday");
				Integer num  = (int)(long)BookingEntity.getProperty("num");
				String textRequest = "";
				if(BookingEntity.getProperty("textRequest") != null) {
					textRequest = (String)BookingEntity.getProperty("textRequest");
				} 
				String bookingListJSON = ((Text) BookingEntity.getProperty("bookingList")).getValue();
				Type bookingListType = new TypeToken<List<BookingRequest>>(){}.getType();
				List<BookingRequest> bookingShapesList = gson.fromJson(bookingListJSON, bookingListType);
				
				BookingRequestWrap booking = new BookingRequestWrap();
				booking.setBookID(bid);	
				booking.setNum(num);
				booking.setTime(startAt);
				booking.setPid(pid_);
				booking.setPeriod(period);
				booking.setWeekday(weekday);
				booking.setTextRequest(textRequest);
				booking.setClientid(client);
				booking.setBookingList(bookingShapesList);
				bookings.add(booking);
	        }
		    return bookings;
	  }
}
