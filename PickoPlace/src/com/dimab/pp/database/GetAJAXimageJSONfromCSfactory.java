package com.dimab.pp.database;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.dimab.pp.dto.AJAXImagesJSON;
import com.dimab.pp.dto.AdminUser;
import com.dimab.pp.dto.CanvasShape;
import com.dimab.pp.dto.JsonImageID_2_GCSurl;
import com.dimab.pp.dto.JsonSID_2_imgID;
import com.dimab.pp.dto.PPSubmitObject;
import com.dimab.pp.dto.SingleTimeRange;
import com.dimab.pp.dto.WeekDays;
import com.dimab.pp.dto.WorkingWeek;
import com.google.appengine.api.datastore.DatastoreService;
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
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

public class GetAJAXimageJSONfromCSfactory {
  public AJAXImagesJSON getBaseData(Entity csEntity , DatastoreService datastore) {
	  AJAXImagesJSON CanvasStateEdit = new AJAXImagesJSON();
		String shapesJSON =  ((Text) csEntity.getProperty("shapesJSON")).getValue();
		String sid2ImageIDJSON =  ((Text) csEntity.getProperty("sid2ImageIDJSON")).getValue();
		String placeID = (String) csEntity.getProperty("placeUniqID");
		String placeName = (String) csEntity.getProperty("placeName");
		String placeBranchName = (String)  csEntity.getProperty("placeBranchName");
		String usernameRandom =  (String)  csEntity.getProperty("usernameRandom");
		double UTCoffcet = 0;
		if (csEntity.getProperty("UTCoffcet") == null) {
			UTCoffcet = (double) 0;
		} else {
			UTCoffcet = (double) csEntity.getProperty("UTCoffcet");
			
		}
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
		  			String description = (String) shapeEntity.getProperty("description");
		  			
		  			
		  			shape.getBooking_options().setGivenName(name);
		  			shape.getBooking_options().setMaxPersons(maxP);
		  			shape.getBooking_options().setMinPersons(minP);
		  			shape.getBooking_options().setDescription(description);;
		  		}
			}
			
			if (!floor.getState().getBackgroundType().contains("color")) {
				String floorID=floor.getFloorid();
				String fileName_ = usernameRandom +"/"+ placeName + "/" + placeBranchName + "/" + placeID+"/"+"main"+"/"+floorID +"/backgroundImage.png";
		  	    Filter imageVersion = new  FilterPredicate("PID",FilterOperator.EQUAL,placeID);
		 	    Query piq = new Query("ImageVersion").setFilter(imageVersion);
		        PreparedQuery sbpiq = datastore.prepare(piq);
		  		Entity imageVersionEntity = sbpiq.asSingleEntity();
		  		if (imageVersionEntity != null) {
		  			int backgroundVersion = (int)(long)imageVersionEntity.getProperty("backgroundVersion");
		  			fileName_ =  usernameRandom +"/"+ placeName + "/" + placeBranchName+"/"+placeID+"/"+"main"+"/"+floorID+"/backgroundImage"+"_"+backgroundVersion+".png";
		  		}
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
		List<JsonSID_2_imgID> sid2imgID = gson.fromJson(sid2ImageIDJSON, collectionType);
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
		CanvasStateEdit.setUTCoffset(UTCoffcet);
		
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
		
		CanvasStateEdit.setFloors(floors);
		
		//Update configuration variables
		String address ;
		if (csEntity.getProperty("address") != null) {
			address    = (String)csEntity.getProperty("address");
		} else {
			address = "";
		}
		String lat ;
		if(csEntity.getProperty("lat") != null) {
			lat        = (String)csEntity.getProperty("lat");
		} else {
			lat        = "";
		}
		String lng ;
		if(csEntity.getProperty("lng") != null) {
			lng        = (String)csEntity.getProperty("lng");
		} else {
			lng        = "";
		}			
		String placePhone ;
		if (csEntity.getProperty("placePhone")!= null) {
			placePhone = (String)csEntity.getProperty("placePhone");
		} else {
			placePhone = "";
		}
		String placeFax;
		if (csEntity.getProperty("placeFax")!= null) {
			placeFax   = "";
		} else {
			placeFax   = (String)csEntity.getProperty("placeFax");
		}
		String placeMail ;
		if (csEntity.getProperty("placeMail") != null) {
			placeMail  = "";
		} else {
			placeMail  = (String)csEntity.getProperty("placeMail");
		}
		String placeURL ;
		if (csEntity.getProperty("placeURL") != null) {
			placeURL   = "";
		} else {
			placeURL   = (String)csEntity.getProperty("placeURL");
		}
		String placeDescription  = "";
		if (csEntity.getProperty("placeDescription") != null) {
			placeDescription  = (String)csEntity.getProperty("placeDescription");
		}
		boolean automatic_approval = true;
		if (csEntity.getProperty("automatic_approval") != null) {
			automatic_approval = (boolean)csEntity.getProperty("automatic_approval");
		}
		List<String> automaticApprovalList = new ArrayList<String>();			
		if (csEntity.getProperty("automaticApprovalList") != null) {
			String automaticApprovalListJSON = (String)csEntity.getProperty("automaticApprovalList");
			collectionType = new TypeToken<List<String>>(){}.getType();
			automaticApprovalList = gson.fromJson(automaticApprovalListJSON, collectionType);				
		}
		List<String> adminApprovalList = new ArrayList<String>();
		if(csEntity.getProperty("adminApprovalList")!=null) {
			String adminApprovalListJSON = (String)csEntity.getProperty("adminApprovalList");
			collectionType = new TypeToken<List<String>>(){}.getType();
			adminApprovalList = gson.fromJson(adminApprovalListJSON, collectionType);
		}
		List<AdminUser> placeEditList = new ArrayList<AdminUser>();
		if(csEntity.getProperty("placeEditList")!=null) {
			String placeEditListJSON = (String)csEntity.getProperty("placeEditList");
			collectionType = new TypeToken<List<AdminUser>>(){}.getType();
			placeEditList = gson.fromJson(placeEditListJSON, collectionType);
		}
		List<Integer> closeDates =  new ArrayList<Integer>();
		if (csEntity.getProperty("closeDates")!=null) {
			String closeDatesJSON = (String)csEntity.getProperty("closeDates");
			collectionType = new TypeToken<List<Integer>>(){}.getType();
			closeDates = gson.fromJson(closeDatesJSON, collectionType);
		}
		Collections.sort(closeDates);
		WorkingWeek workinghours =  new WorkingWeek();
		if(csEntity.getProperty("workinghours")!=null) {
			String workinghoursJSON = (String)csEntity.getProperty("workinghours");
			System.out.println(workinghoursJSON);
			collectionType = new TypeToken<WorkingWeek>(){}.getType();
			workinghours = gson.fromJson(workinghoursJSON, collectionType);				
		}
		
		CanvasStateEdit.setAddress(address);
		CanvasStateEdit.setLat(lat);
		CanvasStateEdit.setLng(lng);
		CanvasStateEdit.setPlacePhone(placePhone);
		CanvasStateEdit.setPlaceFax(placeFax);
		CanvasStateEdit.setPlaceMail(placeMail);
		CanvasStateEdit.setPlaceURL(placeURL);
		CanvasStateEdit.setPlaceDescription(placeDescription);
		CanvasStateEdit.setAutomatic_approval(automatic_approval);
		CanvasStateEdit.setAutomaticApprovalList(automaticApprovalList);
		CanvasStateEdit.setAdminApprovalList(adminApprovalList);
		CanvasStateEdit.setPlaceEditList(placeEditList);
		CanvasStateEdit.setCloseDates(closeDates);
		CanvasStateEdit.setWorkinghours(workinghours);
		
		// Update logo and images
		String logoUrl = "";
		if (csEntity.getProperty("logo")!= null && !((String)csEntity.getProperty("logo")).isEmpty() && (String)csEntity.getProperty("logo")!= ""){
			String bucket = "pp_images"; 
			String logoFileName = usernameRandom +"/"+placeName+"/"+placeBranchName+"/"+placeID+"/"+"main"+"/logo.png";
	  	    GcsFilename gcsFilename = new GcsFilename(bucket, logoFileName);
	  	    System.out.println("LOGO Upload:" + gcsFilename);
	  	    ImagesService is = ImagesServiceFactory.getImagesService(); 
	  	    String filename = String.format("/gs/%s/%s", gcsFilename.getBucketName(), gcsFilename.getObjectName());
	  	    logoUrl = is.getServingUrl(ServingUrlOptions.Builder.withGoogleStorageFileName(filename));
	  	    logoUrl = logoUrl + "=s100";
	   }
	    CanvasStateEdit.setLogosrc(logoUrl);  
	    return CanvasStateEdit;
  }
}
