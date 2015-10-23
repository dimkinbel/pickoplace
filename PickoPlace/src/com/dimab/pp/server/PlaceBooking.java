package com.dimab.pp.server;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.dimab.pp.database.GetPlaceInfoFactory;
import com.dimab.pp.database.GetShapesOrders;
import com.dimab.pp.dto.AJAXImagesJSON;
import com.dimab.pp.dto.CanvasShape;
import com.dimab.pp.dto.JsonImageID_2_GCSurl;
import com.dimab.pp.dto.JsonSID_2_imgID;
import com.dimab.pp.dto.OrderedResponse;
import com.dimab.pp.dto.PPSubmitObject;
import com.dimab.pp.dto.PlaceInfo;
import com.dimab.pp.dto.SingleTimeRange;
import com.dimab.pp.dto.WeekDays;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Text;
import com.google.appengine.api.datastore.Query.CompositeFilterOperator;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.appengine.api.images.ImagesService;
import com.google.appengine.api.images.ImagesServiceFactory;
import com.google.appengine.api.images.ServingUrlOptions;
import com.google.appengine.tools.cloudstorage.GcsFilename;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;


public class PlaceBooking extends HttpServlet {
	private static final long serialVersionUID = 1L;

    public PlaceBooking() {
        super();
        // TODO Auto-generated constructor stub
    }
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		System.out.println("DoGet:"+request.getRequestURL());
		
		String placeID_ = request.getParameter("placeID");
		String urlrequest = request.getRequestURL() +"?placeID="+placeID_;
		
		System.out.println(placeID_);
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		Filter placeIdFilter = new  FilterPredicate("placeUniqID",FilterOperator.EQUAL,placeID_);
		Query q = new Query("CanvasState").setFilter(placeIdFilter);
		PreparedQuery pq = datastore.prepare(q);
  		Entity userCanvasState = pq.asSingleEntity();
  		AJAXImagesJSON CanvasStateEdit = new AJAXImagesJSON();
  		OrderedResponse orderedResponse = new OrderedResponse();
  		double UTCoffcet ; 
  		if (userCanvasState != null) {
  			String shapesJSON =  ((Text) userCanvasState.getProperty("shapesJSON")).getValue();
  			String sid2ImageIDJSON =  ((Text) userCanvasState.getProperty("sid2ImageIDJSON")).getValue();
  			String placeID = (String) userCanvasState.getProperty("placeUniqID");
  			String placeName = (String) userCanvasState.getProperty("placeName");
  			String placeBranchName = (String)  userCanvasState.getProperty("placeBranchName");
  			String usernameRandom =  (String)  userCanvasState.getProperty("usernameRandom");
  			
  			
  			if (userCanvasState.getProperty("UTCoffcet") == null) {
  				UTCoffcet = (double) 0;
  			} else {
  				UTCoffcet = (double) userCanvasState.getProperty("UTCoffcet");
  				
  			}
  			System.out.println(UTCoffcet);
  			
  			Gson gson = new Gson();
  			Type CanvasListcollectionType = new TypeToken<List<PPSubmitObject>>(){}.getType();
			List<PPSubmitObject> floors = gson.fromJson(shapesJSON, CanvasListcollectionType);
			// Restore shapes booking options
			for (PPSubmitObject floor : floors) {
				for (CanvasShape shape : floor.getShapes()) {
					String ShapeSID = shape.getSid();
					Filter sidFilter = new  FilterPredicate("sid",FilterOperator.EQUAL,ShapeSID);
					Query sq = new Query("Shapes").setFilter(sidFilter);
					PreparedQuery psq = datastore.prepare(sq);
			  		Entity shapeEntity = psq.asSingleEntity();
			  		if (shapeEntity != null) {
			  			String name = (String) shapeEntity.getProperty("name");
			  			int minP = (int)(long) shapeEntity.getProperty("minP");
			  			int maxP = (int)(long) shapeEntity.getProperty("maxP");
			  			

			  			shape.getBooking_options().setGivenName(name);
			  			shape.getBooking_options().setMaxPersons(maxP);
			  			shape.getBooking_options().setMinPersons(minP);
			  		}
				}
				
				// Updating background
				String floorID=floor.getFloorid();
				if (!floor.getState().getBackgroundType().contains("color")) {
					
					String fileName_ = usernameRandom +"/"+ placeName + "/" + placeBranchName + "/" + placeID+"/"+"main"+"/"+floorID +"/backgroundImage.png";
					String overview = usernameRandom +"/"+ placeName + "/" + placeBranchName + "/" + placeID+"/"+"main"+"/"+floorID +"/overview.png";
					Filter imageVersion = new  FilterPredicate("PID",FilterOperator.EQUAL,placeID);
			 	    Query piq = new Query("ImageVersion").setFilter(imageVersion);
			        PreparedQuery sbpiq = datastore.prepare(piq);
			  		Entity imageVersionEntity = sbpiq.asSingleEntity();
			  		if (imageVersionEntity != null) {
			  			int backgroundVersion = (int)(long)imageVersionEntity.getProperty("backgroundVersion");
			  			int overviewVersion = (int)(long)imageVersionEntity.getProperty("overviewVersion");
			  			fileName_ =  usernameRandom +"/"+ placeName + "/" + placeBranchName+"/"+placeID+"/"+"main"+"/"+floorID+"/backgroundImage"+"_"+backgroundVersion+".png";
			  			overview =  usernameRandom +"/"+ placeName + "/" + placeBranchName+"/"+placeID+"/"+"main"+"/"+floorID+"/overview"+"_"+overviewVersion+".png";
			  		}
					String bucket = "pp_images"; 
					// Background
			  	    GcsFilename gcsFilename = new GcsFilename(bucket, fileName_);
			  	    ImagesService is = ImagesServiceFactory.getImagesService(); 
			  	    String filename = String.format("/gs/%s/%s", gcsFilename.getBucketName(), gcsFilename.getObjectName());	  	    
			  	    String servingUrl = is.getServingUrl(ServingUrlOptions.Builder.withGoogleStorageFileName(filename));
			  	    servingUrl = servingUrl.concat("=s0");		  	  
			  	    floor.setBackground(servingUrl);
			  	    // Overview
			  	    gcsFilename = new GcsFilename(bucket, overview);
			  	    is = ImagesServiceFactory.getImagesService(); 
			  	    filename = String.format("/gs/%s/%s", gcsFilename.getBucketName(), gcsFilename.getObjectName());
			  	    servingUrl = is.getServingUrl(ServingUrlOptions.Builder.withGoogleStorageFileName(filename));
			  	    servingUrl = servingUrl + "=s100";
			  	    floor.setAllImageSrc(servingUrl);
			  	    
				} else {
					//Overview only
					String overview = usernameRandom +"/"+ placeName + "/" + placeBranchName + "/" + placeID+"/"+"main"+"/"+floorID +"/overview.png";
					Filter imageVersion = new  FilterPredicate("PID",FilterOperator.EQUAL,placeID);
			 	    Query piq = new Query("ImageVersion").setFilter(imageVersion);
			        PreparedQuery sbpiq = datastore.prepare(piq);
			  		Entity imageVersionEntity = sbpiq.asSingleEntity();
			  		if (imageVersionEntity != null) {
			  			int overviewVersion = (int)(long)imageVersionEntity.getProperty("overviewVersion");
			  			overview =  usernameRandom +"/"+ placeName + "/" + placeBranchName+"/"+placeID+"/"+"main"+"/"+floorID+"/overview"+"_"+overviewVersion+".png";
			  		}
					String bucket = "pp_images"; 
					 // Overview
			  	    GcsFilename gcsFilename = new GcsFilename(bucket, overview);
			  	    ImagesService is = ImagesServiceFactory.getImagesService(); 
			  	    String filename = String.format("/gs/%s/%s", gcsFilename.getBucketName(), gcsFilename.getObjectName());	  	    
			  	    String servingUrl = is.getServingUrl(ServingUrlOptions.Builder.withGoogleStorageFileName(filename));
			  	    servingUrl = servingUrl.concat("=s100");		  	  
			  	    floor.setAllImageSrc(servingUrl);
			  	    floor.setBackground("");
			  	   
				}

			}
			Type collectionType = new TypeToken<List<JsonSID_2_imgID>>(){}.getType();
			List<JsonSID_2_imgID> sid2imgID = gson.fromJson(sid2ImageIDJSON, collectionType);
			if(sid2imgID.isEmpty()) {
				System.out.println("sid2imgID = null");
				sid2imgID = null;
			} else {
				System.out.println("sid2imgID =" + sid2imgID);
			}
			CanvasStateEdit.setFloors(floors);
			CanvasStateEdit.setJSONSIDlinks(sid2imgID);
			CanvasStateEdit.setPlace_(placeName);
			CanvasStateEdit.setSnif_(placeBranchName);
			CanvasStateEdit.setUsernameRandom(usernameRandom);
			CanvasStateEdit.setPlaceID(placeID);
			CanvasStateEdit.setUTCoffset(UTCoffcet);
			
		  //CanvasStateEdit.setBackground(servingUrl);
		  //CanvasStateEdit.getJSONimageID2url().add(imgID2url);
			
			// Updating images URLs


			// Updating Images used
			Map <String , String> gcsurlUpdated = new HashMap<String , String>();
			if (sid2imgID!=null) {
				for (JsonSID_2_imgID shapeImgData : sid2imgID) {
	                 String imgID = shapeImgData.getImageID();
	                 if(!gcsurlUpdated.containsKey(imgID)) {
	                	String fileName = usernameRandom +"/"+ placeName + "/" + placeBranchName +  "/" + placeID+"/"+"main" +"/" + imgID + ".png";
	     		  	    String bucket = "pp_images"; 
	     		  	    GcsFilename gcsFilename = new GcsFilename(bucket, fileName);
	     		  	    ImagesService is = ImagesServiceFactory.getImagesService(); 
	     		  	    String filename = String.format("/gs/%s/%s", gcsFilename.getBucketName(), gcsFilename.getObjectName());
	     		  	    String servingUrl = is.getServingUrl(ServingUrlOptions.Builder.withGoogleStorageFileName(filename));
	     		  	    JsonImageID_2_GCSurl imgID2url = new JsonImageID_2_GCSurl();
	     		  	    imgID2url.setImageID(imgID);
	     		  	    imgID2url.setGcsUrl(servingUrl);
	     		  	    gcsurlUpdated.put(imgID, imgID);
	     		  	    CanvasStateEdit.getJSONimageID2url().add(imgID2url);
	                 }
	
				}
			}
			
			Date currentDate = new Date();
	  		Long currentSec = currentDate.getTime()/1000;
	  		Long currentPlaceSec = currentSec + (long)(UTCoffcet*24*60*60);
	  		Long fromStartOfDay = currentPlaceSec % (24*60*60);
	  		Long placeStartOfDate = currentPlaceSec - fromStartOfDay;
	  		GetShapesOrders orderedResponseFactory = new GetShapesOrders();
	  		orderedResponse = orderedResponseFactory.getOrderedResponse(orderedResponse,placeID_, placeStartOfDate, (long)2*24*60*60,false);
	  		orderedResponse.setDate1970(placeStartOfDate);
		    orderedResponse.setPeriod((long)2*24*60*60);
		    orderedResponse.setPid(placeID_);
	  		
  		}
  		if (CanvasStateEdit.getJSONimageID2url().isEmpty()) {
  			//CanvasStateEdit.getJSONimageID2url().add(new JsonImageID_2_GCSurl());
  		}

  		String Address = (String) userCanvasState.getProperty("address");
  		String Lat = (String) userCanvasState.getProperty("lat");
  		String Lng = (String) userCanvasState.getProperty("lng");

  		// Get Place Info Global
  		GetPlaceInfoFactory placeInfoFactory = new GetPlaceInfoFactory();
  		PlaceInfo placeInfo = placeInfoFactory.getPlaceInfo(datastore, userCanvasState, 150);
  		//
  		request.setAttribute("placeAddress", Address);
  		request.setAttribute("placeLat", Lat);
  		request.setAttribute("placeLng", Lng);
  		request.setAttribute("placeInfo", placeInfo);
  		
  		request.setAttribute("todaysOrders", orderedResponse);
  		request.setAttribute("canvasEditPlace", CanvasStateEdit);
		RequestDispatcher dispathser  = request.getRequestDispatcher("/SinglePlaceBooking.jsp");
		response.addHeader("Access-Control-Allow-Origin", "*");
		dispathser.forward(request, response);
		
		HttpSession session = request.getSession();
		session.setAttribute("urlreturn",urlrequest);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

}
