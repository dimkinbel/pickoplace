package com.dimab.pp.account;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.dimab.pickoplace.utils.JsonUtils;
import com.dimab.pp.database.GetAJAXimageJSONfromCSfactory;
import com.dimab.pp.database.GetBookingShapesDataFactory; 
import com.dimab.pp.database.GetShapesOrders;
import com.dimab.pp.dto.AJAXImagesJSON; 
import com.dimab.pp.dto.BookingRequestWrap;
import com.dimab.pp.dto.CanvasShape;
import com.dimab.pp.dto.JsonImageID_2_GCSurl; 
import com.dimab.pp.dto.OrderedResponse;
import com.dimab.pp.dto.PPSubmitObject;
import com.dimab.pp.dto.PlaceCheckAvailableJSON;
import com.dimab.pp.dto.SingleShapeBookingResponse;
import com.dimab.pp.dto.SingleTimeRangeLong;
import com.dimab.pp.dto.WaiterInitialDTO; 
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
import com.google.appengine.api.images.ImagesService;
import com.google.appengine.api.images.ImagesServiceFactory;
import com.google.appengine.api.images.ServingUrlOptions;
import com.google.appengine.tools.cloudstorage.GcsFilename; 
import com.google.gson.reflect.TypeToken;

public class PlaceWaiterAdministration extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public PlaceWaiterAdministration() {
        super();
        // TODO Auto-generated constructor stub
    }

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

			String returnurl = "/user_waiter_list.jsp";
			response.addHeader("Access-Control-Allow-Origin", "*");
			response.sendRedirect(returnurl);

	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		String placeIDvalue = request.getParameter("placeIDvalue");
		String jsonString = request.getParameter("bookrequest");	
		
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
		
 
  		AJAXImagesJSON CanvasStateEdit = new AJAXImagesJSON();
  		WaiterInitialDTO waiterResponse = new WaiterInitialDTO();
		OrderedResponse orderedResponse = new OrderedResponse();
		GetShapesOrders orderedResponseFactory = new GetShapesOrders();
  		GetAJAXimageJSONfromCSfactory csFactory = new GetAJAXimageJSONfromCSfactory();
  		GetBookingShapesDataFactory bookingFactory = new GetBookingShapesDataFactory();
  		List<JsonImageID_2_GCSurl> JSONimageID2url = new ArrayList<JsonImageID_2_GCSurl>();
  		
		PlaceCheckAvailableJSON bookingRequest = JsonUtils.deserialize(jsonString, PlaceCheckAvailableJSON.class);
		Long date = bookingRequest.getDate1970();// Ignoring client offset
	    Long period = bookingRequest.getPeriod(); 
	    int weekday = bookingRequest.getWeekday();
	    double  placeOffset = bookingRequest.getPlaceOffset();
	    int  clientOffset = bookingRequest.getClientOffset();
	    Long UTCdate =  date + clientOffset*3600 - (long)placeOffset*3600; // date is UTC seconds relative to client browser Calendar
	    Integer UTCdateProper = date.intValue() + clientOffset*3600;

		List<SingleTimeRangeLong> openRanges = new ArrayList<SingleTimeRangeLong>();
		
		Filter usernameFilter = new  FilterPredicate("username",FilterOperator.EQUAL,username_email);
		Filter placeIdFilter  = new  FilterPredicate("placeUniqID",FilterOperator.EQUAL,placeIDvalue);
		Filter composeFilter = CompositeFilterOperator.and(usernameFilter,placeIdFilter);
		Query q = new Query("CanvasState").setFilter(composeFilter);
		PreparedQuery pq = datastore.prepare(q);		
  		Entity userCanvasState = pq.asSingleEntity();
  		
  		if (userCanvasState != null) {
  			CanvasStateEdit = csFactory.getBaseData(userCanvasState, datastore);	
 
   		   String closeDatesString = (String) userCanvasState.getProperty("closeDates");
   		   Type closeDateType = new TypeToken<List<Integer>>(){}.getType();
   		   List<Integer> closeDates  = JsonUtils.deserialize(closeDatesString, closeDateType);
   		   
 		   String weekdays = (String) userCanvasState.getProperty("workinghours");		
 		   WorkingWeek weekdaysObject  = JsonUtils.deserialize(weekdays, WorkingWeek.class);


		   List<SingleTimeRangeLong> tempRanges = weekdaysObject.getRangesList(weekday,2);

 		   // Check for dates the place is close (set by Administrator)
 		   if (closeDates.contains(UTCdateProper)) {
			    tempRanges = weekdaysObject.deleteRangeFromList(tempRanges,0,86400);
 		   }
            if (closeDates.contains(UTCdateProper+86400)) {
			    tempRanges = weekdaysObject.deleteRangeFromList(tempRanges,86400,2*86400);
 		   }

			openRanges = tempRanges;

            if(true) {

	  		    List<String> shapesIDs = new ArrayList<String>();
	  		    List<SingleShapeBookingResponse> shapesList = new ArrayList<SingleShapeBookingResponse>();
	  		    for(PPSubmitObject ppObject : CanvasStateEdit.getFloors()) {
	  		    	for(CanvasShape cshape:ppObject.getShapes()) {
	  		    		shapesIDs.add(cshape.getSid());
	  		    	}
	  		    }
	  		    shapesList = bookingFactory.getShapeInfo(datastore, userCanvasState, shapesIDs);
	  		    Map <String , String> gcsurlUpdated = new HashMap<String , String>();
	  		    for (SingleShapeBookingResponse shapeInfo_ : shapesList) {
	  		    	String imgID = shapeInfo_.getShapeInfo().getImgID();
	  		    	
	  		    	if(shapeInfo_.getShapeInfo().getType().equals("image") && !gcsurlUpdated.containsKey(shapeInfo_.getShapeInfo().getImgID())) {
	  		    		JsonImageID_2_GCSurl imgID2url = new JsonImageID_2_GCSurl();	
	  		    		String fileName = CanvasStateEdit.getUsernameRandom() +"/"+ CanvasStateEdit.getPlace_() + "/" + CanvasStateEdit.getSnif_() +  "/" + CanvasStateEdit.getPlaceID() +"/"+"main" +"/" + imgID + ".png";
	     		  	    String bucket = "pp_images"; 
	     		  	    GcsFilename gcsFilename = new GcsFilename(bucket, fileName);
	     		  	    ImagesService is = ImagesServiceFactory.getImagesService(); 
	     		  	    String filename = String.format("/gs/%s/%s", gcsFilename.getBucketName(), gcsFilename.getObjectName());
	     		  	    System.out.println("Shape_Image_URL:"+filename);
	     		  	    String servingUrl = is.getServingUrl(ServingUrlOptions.Builder.withGoogleStorageFileName(filename));
	     		  	    servingUrl = servingUrl + "=s50";
                        imgID2url.setImageID(imgID);
                        imgID2url.setGcsUrl(servingUrl);
                        shapeInfo_.getShapeInfo().setOverviewURL(servingUrl);
                        gcsurlUpdated.put(imgID, imgID);
                        System.out.println("SERVINGURL:"+servingUrl);
                        JSONimageID2url.add(imgID2url);
                                                  
	  		    	}
	  		    	
	  		    }
                 
            }
  		} 
  		

	    System.out.println("date + clientOffset - placeOffset: " + date + " + " + clientOffset*3600 + " - " + placeOffset*3600);
	    System.out.println("UTC date to check:" + UTCdate);
	    orderedResponseFactory.getOrderedResponse(orderedResponse,bookingRequest.getPid(), UTCdate, period,true);
	    orderedResponse.setDate1970(UTCdateProper.longValue());
	    orderedResponse.setPeriod(period);
	    orderedResponse.setClientOffset(clientOffset);
	    orderedResponse.setPlaceOffset(placeOffset);
	    orderedResponse.setPid(bookingRequest.getPid());
	    orderedResponse.setPlaceOpen(openRanges);

	    waiterResponse.setPlaceJSON(CanvasStateEdit);
	    waiterResponse.setOrderedResponse(orderedResponse);
	
	    // Bookings datastore
	    
	    List<BookingRequestWrap> bookings_ = bookingFactory.getDatastoreBookingsInludeStartBefore(datastore, placeIDvalue, UTCdate.intValue(), UTCdate.intValue()+2*24*3600);
	    request.setAttribute("waiterResponse", waiterResponse);
	    request.setAttribute("waiterBookings", JsonUtils.serialize(bookings_));
	    request.setAttribute("imgid2link50", JsonUtils.serialize(JSONimageID2url));
	    RequestDispatcher dispathser  = request.getRequestDispatcher("/placewaiteradmin.jsp");
	    response.addHeader("Access-Control-Allow-Origin", "*");
	    dispathser.forward(request, response);			
	}

}
