package com.dimab.pp.database;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.dimab.pickoplace.utils.JsonUtils;
import com.dimab.pp.dto.*;
import com.dimab.pp.login.GenericUser;
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

import com.google.appengine.api.images.ImagesService;
import com.google.appengine.api.images.ImagesServiceFactory;
import com.google.appengine.api.images.ServingUrlOptions;
import com.google.appengine.tools.cloudstorage.GcsFilename;
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
	public BookingRequestWrap getBookData(Entity bookingEntity) {
		BookingRequestWrap booking = new BookingRequestWrap();
		Integer startAt = (int) (long) bookingEntity.getProperty("UTCstartSeconds");
		String pid_ = (String) bookingEntity.getProperty("pid");
		String bid = (String) bookingEntity.getProperty("bid");
		String client = (String) bookingEntity.getProperty("clientid");
		Integer period = (int) (long) bookingEntity.getProperty("periodSeconds");
		Integer weekday = (int) (long) bookingEntity.getProperty("weekday");
		Integer num = (int) (long) bookingEntity.getProperty("num");
		Date placeLocalTime = (Date) bookingEntity.getProperty("Date");
		System.out.println("placeLocalTime:"+placeLocalTime);
		String placeName = (String)bookingEntity.getProperty("placeName");
		String branchName = (String)bookingEntity.getProperty("placeBranchName");
		String address = (String)bookingEntity.getProperty("address");
		String textRequest = "";
		String userPhone = "";
		if (bookingEntity.getProperty("userTextRequest") != null) {
			textRequest = (String) bookingEntity.getProperty("userTextRequest");
		}
		if (bookingEntity.getProperty("userPhone") != null) {
			userPhone = (String) bookingEntity.getProperty("userPhone");
		}

		String bookingListJSON = ((Text) bookingEntity.getProperty("bookingList")).getValue();
		Type bookingListType = new TypeToken<List<BookingRequest>>() {
		}.getType();
		List<BookingRequest> bookingShapesList = JsonUtils.deserialize(bookingListJSON, bookingListType);

		Integer persons = 0;
		for(BookingRequest singlePlace: bookingShapesList) {
			persons+= singlePlace.getPersons();
		}

		booking.setBookID(bid);
		booking.setAddress(address);
		booking.setNum(num);
		booking.setTime(startAt);
		booking.setPlaceLocalTime(placeLocalTime);
		booking.setPid(pid_);
		booking.setPlaceName(placeName);
		booking.setBranchName(branchName);
		booking.setPeriod(period);
		booking.setWeekday(weekday);
		booking.setTextRequest(textRequest);
		booking.setClientid(client);
		booking.setPhone(userPhone);
		booking.setBookingList(bookingShapesList);
		booking.setPersons(persons);

		if (bookingEntity.getProperty("genuser") != null) {
			Type genuserType = new TypeToken<GenericUser>() {
			}.getType();
			GenericUser genuser = JsonUtils.deserialize((String) bookingEntity.getProperty("genuser"), genuserType);
			booking.setUser(genuser);
		}

		// Update place view
		String viewJSON = (String)bookingEntity.getProperty("bookingViewData");
		Type viewListType = new TypeToken<List<BookingRequestPlaceView>>() {}.getType();
		List<BookingRequestPlaceView> viewList = JsonUtils.deserialize(viewJSON,viewListType);
		for(BookingRequestPlaceView Floorview: viewList) {
			String fileName_ = Floorview.getUserID() + "/" + pid_ + "/" + "main" + "/" + Floorview.getFloorID() + "/overview.png";
			System.out.println(fileName_);

			String bucket = "pp_images";
			GcsFilename gcsFilename = new GcsFilename(bucket, fileName_);
			ImagesService is = ImagesServiceFactory.getImagesService();
			String filename = String.format("/gs/%s/%s", gcsFilename.getBucketName(), gcsFilename.getObjectName());
			String servingUrl = is.getServingUrl(ServingUrlOptions.Builder.withGoogleStorageFileName(filename).secureUrl(true));
			servingUrl = servingUrl + "=s" + 300;
			Floorview.setOverviewURL(servingUrl);

			double floorWidth = Floorview.getWidth();
			double floorHeight = Floorview.getHeight();

			for(ShapeDimentions shapeDim : Floorview.getShapes()) {
				String xper = String.format("%.2f",shapeDim.getX()/floorWidth*100);
				String yper = String.format("%.2f",shapeDim.getY()/floorHeight*100);
				shapeDim.setXperc(xper);
				shapeDim.setYperc(yper);
			}
		}
		booking.setBookingView(viewList);

		return booking;
	}
	  public List<SingleShapeBookingResponse> getShapeInfo(DatastoreService datastore , Entity csEntity , List<String> shapesIDs) {
		  List<SingleShapeBookingResponse> shapesBookingList = new ArrayList<SingleShapeBookingResponse>();
		  
		  String shapesJSON =  ((Text) csEntity.getProperty("shapesJSON")).getValue();
	      String placeID = (String) csEntity.getProperty("placeUniqID");
	      
	     
			Type CanvasListcollectionType = new TypeToken<List<PPSubmitObject>>(){}.getType();
			List<PPSubmitObject> floors = JsonUtils.deserialize(shapesJSON, CanvasListcollectionType);
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
				String userPhone = "";
				if(BookingEntity.getProperty("userTextRequest") != null) {
					textRequest = (String)BookingEntity.getProperty("userTextRequest");
				}
				if(BookingEntity.getProperty("userPhone") != null) {
					userPhone = (String)BookingEntity.getProperty("userPhone");
				}

				String bookingListJSON = ((Text) BookingEntity.getProperty("bookingList")).getValue();
				Type bookingListType = new TypeToken<List<BookingRequest>>(){}.getType();
				List<BookingRequest> bookingShapesList = JsonUtils.deserialize(bookingListJSON, bookingListType);
				
				BookingRequestWrap booking = new BookingRequestWrap();
				booking.setBookID(bid);	
				booking.setNum(num);
				booking.setTime(startAt);
				booking.setPid(pid_);
				booking.setPeriod(period);
				booking.setWeekday(weekday);
				booking.setTextRequest(textRequest);
				booking.setClientid(client);
				booking.setPhone(userPhone);
				booking.setBookingList(bookingShapesList);
				if(BookingEntity.getProperty("genuser")!=null) {
					Type genuserType = new TypeToken<GenericUser>(){}.getType();
					GenericUser genuser = JsonUtils.deserialize((String)BookingEntity.getProperty("genuser"), genuserType);
					booking.setUser(genuser);
				}

				bookings.add(booking);
	        }
		    return bookings;
	  }


	public List<BookingRequestWrap> getDatastoreBookingsInludeStartBefore(DatastoreService datastore , String pid , Integer from , Integer to) {
		List<BookingRequestWrap> bookings = new ArrayList<BookingRequestWrap>();
		Integer maxBookingLength = 12*3600;//TBD (Use Place max booking period available)

		Filter greaterF = new FilterPredicate("UTCstartSeconds", FilterOperator.GREATER_THAN_OR_EQUAL,from-maxBookingLength);
		Filter lessF =   new FilterPredicate("UTCstartSeconds", FilterOperator.LESS_THAN_OR_EQUAL,to);


		Filter pidF = new FilterPredicate("pid", FilterOperator.EQUAL,pid);
		Filter pid_and_range_filter  = CompositeFilterOperator.and(pidF,greaterF, lessF);


		Query q = new Query("BookingOrders").setFilter(pid_and_range_filter).addSort("UTCstartSeconds", SortDirection.ASCENDING);
		PreparedQuery pq = datastore.prepare(q);
		for (Entity BookingEntity : pq.asIterable()) {
			Integer startAt = (int)(long)BookingEntity.getProperty("UTCstartSeconds");
			Integer period = (int)(long)BookingEntity.getProperty("periodSeconds");

			if(startAt < from && startAt + period <= from ) {
				continue;
			}
			String pid_ = (String)BookingEntity.getProperty("pid");
			String bid = (String)BookingEntity.getProperty("bid");
			String client = (String)BookingEntity.getProperty("clientid");

			Integer weekday = (int)(long)BookingEntity.getProperty("weekday");
			Integer num  = (int)(long)BookingEntity.getProperty("num");
			String textRequest = "";
			String userPhone = "";
			if(BookingEntity.getProperty("userTextRequest") != null) {
				textRequest = (String)BookingEntity.getProperty("userTextRequest");
			}
			if(BookingEntity.getProperty("userPhone") != null) {
				userPhone = (String)BookingEntity.getProperty("userPhone");
			}

			String bookingListJSON = ((Text) BookingEntity.getProperty("bookingList")).getValue();
			Type bookingListType = new TypeToken<List<BookingRequest>>(){}.getType();
			List<BookingRequest> bookingShapesList = JsonUtils.deserialize(bookingListJSON, bookingListType);

			BookingRequestWrap booking = new BookingRequestWrap();
			booking.setBookID(bid);
			booking.setNum(num);
			booking.setTime(startAt);
			booking.setPid(pid_);
			booking.setPeriod(period);
			booking.setWeekday(weekday);
			booking.setTextRequest(textRequest);
			booking.setClientid(client);
			booking.setPhone(userPhone);
			booking.setBookingList(bookingShapesList);
			if(BookingEntity.getProperty("genuser")!=null) {
				Type genuserType = new TypeToken<GenericUser>(){}.getType();
				GenericUser genuser = JsonUtils.deserialize((String)BookingEntity.getProperty("genuser"), genuserType);
				booking.setUser(genuser);
			}

			bookings.add(booking);
		}
		return bookings;
	}
}
