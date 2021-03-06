package com.dimab.pp.account;

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

import com.dimab.pickoplace.utils.JsonUtils;
import com.dimab.pp.database.GetBookingShapesDataFactory;
import com.dimab.pp.database.GetPlaceInfoFactory; 
import com.dimab.pp.dto.BookingDTO;
import com.dimab.pp.dto.BookingRequest; 
import com.dimab.pp.dto.ClientBookingHistoryRequestDTO;
import com.dimab.pp.dto.ClientBookingsObject;
import com.dimab.pp.dto.JsonImageID_2_GCSurl;
import com.dimab.pp.dto.JsonSID_2_imgID; 
import com.dimab.pp.dto.PlaceInfo;
import com.dimab.pp.dto.PlaceRatingDTO;
import com.dimab.pp.dto.SingleShapeBookingResponse; 
import com.dimab.pp.login.CheckTokenValid;
import com.dimab.pp.login.dto.GenericUser;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity; 
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Text;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate; 
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.appengine.api.datastore.Query.CompositeFilterOperator;
import com.google.appengine.api.images.ImagesService;
import com.google.appengine.api.images.ImagesServiceFactory;
import com.google.appengine.api.images.ServingUrlOptions;
import com.google.appengine.tools.cloudstorage.GcsFilename; 
import com.google.gson.reflect.TypeToken;

import static com.google.appengine.api.datastore.FetchOptions.Builder.*;


public class ClientBookingHistoryServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ClientBookingHistoryServlet() {
        super();
        // TODO Auto-generated constructor stub
    }
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String jsonString = request.getParameter("bookingHistory");
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		ClientBookingsObject bookingsResponse = new ClientBookingsObject(); 
		ClientBookingHistoryRequestDTO hisoryRequest = JsonUtils.deserialize(jsonString,ClientBookingHistoryRequestDTO.class);
		System.out.println(jsonString);
		
		String username = new String();
		CheckTokenValid tokenValid = new CheckTokenValid(request);
		GenericUser genuser = tokenValid.getUser();
		if(genuser!=null) {
			bookingsResponse.setLogged(true);
			username = genuser.getEmail();

			List<Entity> bookingsEntities = getNEntities(hisoryRequest.getFromNum(),
					                                     hisoryRequest.getMaxBookings(),
					                                     hisoryRequest.isFuture(),
					                                     datastore,
					                                     username);
			List<BookingDTO> bookings = new ArrayList<BookingDTO>();
			List<JsonImageID_2_GCSurl> JSONimageID2url = new ArrayList<JsonImageID_2_GCSurl>();
	  		List<JsonSID_2_imgID> JSONSIDlinks = new ArrayList<JsonSID_2_imgID>();
	  		Map <String , String> gcsurlUpdated = new HashMap<String , String>();
			for(Entity bookingE : bookingsEntities) {
				BookingDTO singleBooking = new BookingDTO();
	  		    PlaceInfo placeInfo = new PlaceInfo();
				Long startAt = (Long)bookingE.getProperty("UTCstartSeconds");
				String pid = (String)bookingE.getProperty("pid");
				String bid = (String)bookingE.getProperty("bid");
				
				System.out.println("BID:"+bid);
				Integer period = (int)(long)bookingE.getProperty("periodSeconds");
				Integer weekday = (int)(long)bookingE.getProperty("weekday");
				Long dateUTC = (long) 0;
				Integer time = 0;
				String textRequest = new String();
				if(bookingE.getProperty("userTextRequest") != null) {
					textRequest = (String)bookingE.getProperty("userTextRequest");
				}
				String bookingListJSON = ((Text) bookingE.getProperty("bookingList")).getValue();
				Type bookingListType = new TypeToken<List<BookingRequest>>(){}.getType();
				List<BookingRequest> bookingShapesList  = JsonUtils.deserialize(bookingListJSON, bookingListType);
				System.out.println("BOOKING:"+startAt+"("+pid+")\n"+bookingShapesList);
				// Get CanvasState entity
				Filter pidFilter = new  FilterPredicate("placeUniqID",FilterOperator.EQUAL,pid);
				Query sq_ = new Query("CanvasState").setFilter(pidFilter);
				PreparedQuery psq_ = datastore.prepare(sq_);

				if(psq_.asSingleEntity()!=null) {		
					
		  		    Entity canvasEntity = psq_.asSingleEntity();
                    
		  		    GetPlaceInfoFactory placeInfoFactory = new GetPlaceInfoFactory();
		  		    GetBookingShapesDataFactory shapeInfoFactory = new GetBookingShapesDataFactory();
		  		    placeInfo = placeInfoFactory.getPlaceInfo(datastore, canvasEntity,190,false,true);
		  		    List<String> shapesIDs = new ArrayList<String>();
		  		    List<SingleShapeBookingResponse> shapesList = new ArrayList<SingleShapeBookingResponse>();
		  		    for(BookingRequest singleShapeBooking : bookingShapesList) {
		  		    	String sid = singleShapeBooking.getSid();
		  		    	shapesIDs.add(sid);
		  		    	dateUTC = singleShapeBooking.getDateSeconds();
		  		    	time = singleShapeBooking.getTime();
		  		    	
		  		    }
		  		    shapesList = shapeInfoFactory.getShapeInfo(datastore, canvasEntity, shapesIDs);
		  		    int totalPersons = 0;
		  		    for (SingleShapeBookingResponse shapeInfo_ : shapesList) {
		  		    	String sid = shapeInfo_.getSid();
		  		    	String imgID = shapeInfo_.getShapeInfo().getImgID();
		  		    	for (BookingRequest singleShapeBooking : bookingShapesList) {
		  		    		if(singleShapeBooking.getSid().equals(sid)) {
		  		    			int persons = singleShapeBooking.getPersons();
		  		    			shapeInfo_.setPersons(persons);
		  		    			totalPersons += persons;
		  		    		}
		  		    	}
		  		    	JsonSID_2_imgID      sid2ImgID = new JsonSID_2_imgID();
		  		    	sid2ImgID.setImageID(imgID);
                        sid2ImgID.setSid(sid);
		  		    	JSONSIDlinks.add(sid2ImgID); 
		  		    	if(shapeInfo_.getShapeInfo().getType().equals("image") && !gcsurlUpdated.containsKey(shapeInfo_.getShapeInfo().getImgID())) {
		  		    		JsonImageID_2_GCSurl imgID2url = new JsonImageID_2_GCSurl();	
		  		    		String fileName = placeInfo.getUserPlace().getUserRand() +"/"+   placeInfo.getUserPlace().getPlaceID()+"/"+"main" +"/" + imgID + ".png";
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
                            JSONimageID2url.add(imgID2url);
                                                      
		  		    	}
		  		    	
		  		    }
                     
		  		  singleBooking.setBookID(bid);
                  singleBooking.setClientid(username);
                  singleBooking.setPeriod(period.longValue());
                  singleBooking.setPid(pid);
                  singleBooking.setPlaceInfo(placeInfo);
                  singleBooking.setShapesList(shapesList);
                  singleBooking.setTextRequest(textRequest);
                  singleBooking.setTime(startAt);
                  singleBooking.setTotalPersons(totalPersons);
                  singleBooking.setUTCdate(dateUTC);
                  singleBooking.setWaitingApproval(false);//TBD
                  singleBooking.setWeekday(weekday);
                  if(!hisoryRequest.isFuture()) {
                	  String ratingString = (String)bookingE.getProperty("rating");
                	  Type ratingType = new TypeToken<PlaceRatingDTO>(){}.getType();
          			  PlaceRatingDTO rating = JsonUtils.deserialize(ratingString, ratingType);
          			  singleBooking.setRating(rating);
                  } else {

                  }
				} else {
					// Place not exists anymore;
				}
				bookings.add(singleBooking);
			}
			bookingsResponse.setBookings(bookings);
			bookingsResponse.setClientID(username);
			bookingsResponse.setJSONimageID2url(JSONimageID2url);
			bookingsResponse.setJSONSIDlinks(JSONSIDlinks);
			bookingsResponse.setTotalBookings(10);
			
			response.setContentType("application/json");
			response.setCharacterEncoding("UTF-8");
			response.getWriter().write(JsonUtils.serialize(bookingsResponse));
		} else {
			Map <String , Object> map = new HashMap<String , Object>();
			map.put("logged", false);
			response.setContentType("application/json");
			response.setCharacterEncoding("UTF-8");
			response.getWriter().write(JsonUtils.serialize(map));			
		}
	}

	List<Entity> getNEntities(int from , int count , boolean future, DatastoreService datastore , String user) {
		Date date = new Date();
		Long seconds =  date.getTime()/1000;
		System.out.println("Current Seconds:"+seconds);
		Filter futureFilter = new FilterPredicate("UTCstartSeconds", FilterOperator.GREATER_THAN_OR_EQUAL,seconds);
		Filter pastFilter =   new FilterPredicate("UTCstartSeconds", FilterOperator.LESS_THAN,seconds);
		Filter usernameFilter = new FilterPredicate("clientid", FilterOperator.EQUAL,user);
		Filter user_and_seconds_filter;
		Query q;
		if(future) {
			user_and_seconds_filter = CompositeFilterOperator.and(futureFilter, usernameFilter);
			q = new Query("BookingOrders").setFilter(user_and_seconds_filter).addSort("UTCstartSeconds", SortDirection.ASCENDING);
		} else {
			user_and_seconds_filter = CompositeFilterOperator.and(pastFilter, usernameFilter);
			q = new Query("BookingOrders").setFilter(user_and_seconds_filter).addSort("UTCstartSeconds", SortDirection.DESCENDING);
		}

        PreparedQuery pq = datastore.prepare(q);       
        return pq.asList(withLimit(count).offset(from));
	}
}
