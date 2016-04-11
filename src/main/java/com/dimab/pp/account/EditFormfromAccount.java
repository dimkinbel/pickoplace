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
import com.dimab.pp.dto.AJAXImagesJSON;
import com.dimab.pp.dto.CanvasShape;
import com.dimab.pp.dto.JsonImageID_2_GCSurl;
import com.dimab.pp.dto.JsonSID_2_imgID;
import com.dimab.pp.dto.PPSubmitObject; 
import com.dimab.pp.login.CheckTokenValid;
import com.dimab.pp.login.dto.GenericUser;
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
import com.google.gson.reflect.TypeToken;


public class EditFormfromAccount extends HttpServlet {
	private static final long serialVersionUID = 1L;

    public EditFormfromAccount() {
        super();
    }


	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		String placeIDvalue = request.getParameter("placeIDvalue");
		
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
		} else {
			username_email = genuser.getEmail();
		}
		System.out.println("USERNAME = [" + username_email + "]");
		
		//Filter usernameFilter = new  FilterPredicate("username",FilterOperator.EQUAL,username_email);
		Filter placeIdFilter = new  FilterPredicate("placeUniqID",FilterOperator.EQUAL,placeIDvalue);
		Query q = new Query("CanvasState").setFilter(placeIdFilter);
		PreparedQuery pq = datastore.prepare(q);
  		Entity userCanvasState = pq.asSingleEntity();
  		AJAXImagesJSON CanvasStateEdit = new AJAXImagesJSON();

		String referer = request.getHeader("Referer");
		System.out.println("REFERER = [" + referer + "]");

  		if (userCanvasState != null) {
			Type StringListType = new TypeToken<List<String>>() {}.getType();
			List<String> admins  = JsonUtils.deserialize((String) userCanvasState.getProperty("adminList"), StringListType);
			if(!admins.contains(username_email)) {
				/*String referer = request.getHeader("Referer");
				response.sendRedirect(referer);*/

				String returnurl = "/welcome.jsp";
				response.addHeader("Access-Control-Allow-Origin", "*");
				response.sendRedirect(returnurl);
			}

  			String shapesJSON =  ((Text) userCanvasState.getProperty("shapesJSON")).getValue();
  			String sid2ImageIDJSON =  ((Text) userCanvasState.getProperty("sid2ImageIDJSON")).getValue();
  			String placeID = (String) userCanvasState.getProperty("placeUniqID");
  			String placeName = (String) userCanvasState.getProperty("placeName");
  			String placeBranchName = (String)  userCanvasState.getProperty("placeBranchName");
  			String usernameRandom =  (String)  userCanvasState.getProperty("usernameRandom");
  			String address = (String)  userCanvasState.getProperty("address");
  			String lat = (String)  userCanvasState.getProperty("lat");
  			String lng = (String)  userCanvasState.getProperty("lng");
			
  			Type CanvasListcollectionType = new TypeToken<List<PPSubmitObject>>(){}.getType();
			List<PPSubmitObject> floors = JsonUtils.deserialize(shapesJSON, CanvasListcollectionType);
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
				
				if (!floor.getState().getBackgroundType().contains("color")) {
					String floorID=floor.getFloorid();
					String fileName_ = usernameRandom +"/"+  placeID+"/"+"main"+"/"+floorID +"/backgroundImage.png";

					String bucket = "pp_images"; 
			  	    GcsFilename gcsFilename = new GcsFilename(bucket, fileName_);
			  	    ImagesService is = ImagesServiceFactory.getImagesService(); 
			  	    String filename = String.format("/gs/%s/%s", gcsFilename.getBucketName(), gcsFilename.getObjectName());
			  	    
			  	    String servingUrl = is.getServingUrl(ServingUrlOptions.Builder.withGoogleStorageFileName(filename));
			  	    servingUrl = servingUrl.concat("=s0");
			  	  
			  	    floor.setBackground(servingUrl);
				} else {
					floor.setBackground("");
				}
			}
			Type collectionType = new TypeToken<List<JsonSID_2_imgID>>(){}.getType();
			List<JsonSID_2_imgID> sid2imgID = JsonUtils.deserialize(sid2ImageIDJSON, collectionType);
			if(sid2imgID.isEmpty()) {
				System.out.println("sid2imgID = null");
				sid2imgID = null;
			} else {
				System.out.println("sid2imgID =" + sid2imgID);
			}
			
			CanvasStateEdit.setJSONSIDlinks(sid2imgID);
			CanvasStateEdit.setPlace_(placeName);
			CanvasStateEdit.setSnif_(placeBranchName);
			CanvasStateEdit.setUsernameRandom(usernameRandom);
			CanvasStateEdit.setPlaceID(placeID);
			CanvasStateEdit.setAddress(address);
			CanvasStateEdit.setLat(lat);
			CanvasStateEdit.setLng(lng);
			
		  //CanvasStateEdit.setBackground(servingUrl);
		  //CanvasStateEdit.getJSONimageID2url().add(imgID2url);
			
			// Updating images URLs
			// Updating background
			// Updating Images used
			Map <String , String> gcsurlUpdated = new HashMap<String , String>();
			if (sid2imgID!=null) {
				for (JsonSID_2_imgID shapeImgData : sid2imgID) {
	                 String imgID = shapeImgData.getImageID();
	                 if(!gcsurlUpdated.containsKey(imgID)) {
	                	String fileName = usernameRandom +"/"+   placeID+"/"+"main" +"/" + imgID + ".png";
	     		  	    String bucket = "pp_images"; 
	     		  	    GcsFilename gcsFilename = new GcsFilename(bucket, fileName);
	     		  	    System.out.println(gcsFilename);
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
			
			CanvasStateEdit.setFloors(floors);
  		}
  		
  		if (CanvasStateEdit.getJSONimageID2url().isEmpty()) {
  			//CanvasStateEdit.getJSONimageID2url().add(new JsonImageID_2_GCSurl());
  		}
  		request.setAttribute("canvasEditPlace", CanvasStateEdit);
		RequestDispatcher dispathser  = request.getRequestDispatcher("/editplace.jsp");
		response.addHeader("Access-Control-Allow-Origin", "*");
		dispathser.forward(request, response);
	}

}
