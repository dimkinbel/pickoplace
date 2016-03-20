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

import com.dimab.pickoplace.utils.JsonUtils;
import com.dimab.pp.database.GetAJAXimageJSONfromCSfactory;
import com.dimab.pp.database.GetPlaceInfoFactory;
import com.dimab.pp.database.GetShapesOrders;
import com.dimab.pp.dto.AJAXImagesJSON;
import com.dimab.pp.dto.CanvasShape;
import com.dimab.pp.dto.JsonImageID_2_GCSurl;
import com.dimab.pp.dto.JsonSID_2_imgID;
import com.dimab.pp.dto.OrderedResponse;
import com.dimab.pp.dto.PPSubmitObject;
import com.dimab.pp.dto.PlaceInfo; 
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Text; 
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.appengine.api.images.ImagesService;
import com.google.appengine.api.images.ImagesServiceFactory;
import com.google.appengine.api.images.ServingUrlOptions;
import com.google.appengine.tools.cloudstorage.GcsFilename; 
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
		GetAJAXimageJSONfromCSfactory csFactory = new GetAJAXimageJSONfromCSfactory();

		double UTCoffcet ;
  		if (userCanvasState != null) {

			String placeID = (String) userCanvasState.getProperty("placeUniqID");
			String usernameRandom =  (String)  userCanvasState.getProperty("usernameRandom");
			CanvasStateEdit = csFactory.getBaseData(userCanvasState, datastore);

			// Updating Images used
			Map <String , String> gcsurlUpdated = new HashMap<String , String>();
			if (CanvasStateEdit.getJSONSIDlinks()!=null) {
				for (JsonSID_2_imgID shapeImgData : CanvasStateEdit.getJSONSIDlinks()) {
	                 String imgID = shapeImgData.getImageID();
	                 if(!gcsurlUpdated.containsKey(imgID)) {
	                	String fileName = usernameRandom +"/"+  placeID_+"/"+"main" +"/" + imgID + ".png";
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
	  		Long currentPlaceSec = currentSec + (long)(CanvasStateEdit.getUTCoffset()*24*60*60);
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
  		PlaceInfo placeInfo = placeInfoFactory.getPlaceInfo(datastore, userCanvasState, 150,true,true);
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
