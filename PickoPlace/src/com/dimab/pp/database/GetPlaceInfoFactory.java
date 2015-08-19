package com.dimab.pp.database;


import java.lang.reflect.Type;
import java.util.List;

import com.dimab.pp.dto.CanvasShape;
import com.dimab.pp.dto.JsonimgID_2_data;
import com.dimab.pp.dto.PPSubmitObject;
import com.dimab.pp.dto.PlaceInfo;
import com.dimab.pp.dto.PlaceRatingDTO;
import com.dimab.pp.dto.PlaceRatingSummary;
import com.dimab.pp.dto.UserPlace;
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
import com.google.appengine.tools.cloudstorage.GcsFileMetadata;
import com.google.appengine.tools.cloudstorage.GcsFilename;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

public class GetPlaceInfoFactory {
  public PlaceInfo getPlaceInfo (DatastoreService datastore , Entity csEntity , int ovrv_width) {
	    PlaceInfo placeInfo = new PlaceInfo();
	    UserPlace userPlace = new UserPlace();
	    
		String userRnd = (String) csEntity.getProperty("usernameRandom");
		String placeName = (String) csEntity.getProperty("placeName");
		String placeBranchName = (String) csEntity.getProperty("placeBranchName");
		String placeID = (String) csEntity.getProperty("placeUniqID");
		String mainFloorID = (String) csEntity.getProperty("mainFloorID");
		String Address = (String) csEntity.getProperty("address");
		String mail = new String();
		String phone = new String();
		if(csEntity.getProperty("placeMail") != null) {
			mail = (String) csEntity.getProperty("placeMail");
		}
		if(csEntity.getProperty("placePhone") != null) {
			phone = (String) csEntity.getProperty("placePhone");
		}
		Integer bookableShapes = 0;
	
		double placeOffset = (double) csEntity.getProperty("UTCoffcet");
		Double Lat = Double.parseDouble((String) csEntity.getProperty("lat"));
	    Double Lng = Double.parseDouble((String) csEntity.getProperty("lng"));
	    String shapesJSON =  ((Text) csEntity.getProperty("shapesJSON")).getValue();
        Gson gson = new Gson();
		Type CanvasListcollectionType = new TypeToken<List<PPSubmitObject>>(){}.getType();
		List<PPSubmitObject> floors = gson.fromJson(shapesJSON, CanvasListcollectionType);
        String mainFloorName = new String();
        
		for (PPSubmitObject floor : floors) {
			if(floor.isMainfloor()) {
				mainFloorName = floor.getFloor_name();
			}	
			for(CanvasShape shape : floor.getShapes()) {
				if(shape.getBooking_options().isBookable()) {
					bookableShapes+=1;
				}
			}
		}

  		// Get serving Overview URL;
  		String fileName_ = userRnd +"/"+ placeName + "/" + placeBranchName + "/" + placeID+"/"+"main"+"/"+mainFloorID +"/overview.png";
  		Filter imageVersion = new  FilterPredicate("PID",FilterOperator.EQUAL,placeID);
 	    Query piq = new Query("ImageVersion").setFilter(imageVersion);
        PreparedQuery sbpiq = datastore.prepare(piq);
  		Entity imageVersionEntity = sbpiq.asSingleEntity();
  		if (imageVersionEntity != null) {
  			int overviewVersion = (int)(long)imageVersionEntity.getProperty("overviewVersion");
  			fileName_ =  userRnd +"/"+ placeName + "/" + placeBranchName+"/"+placeID+"/"+"main"+"/"+mainFloorID+"/overview"+"_"+overviewVersion+".png";
  		}
        System.out.println(fileName_);
  	    String bucket = "pp_images"; 
  	    GcsFilename gcsFilename = new GcsFilename(bucket, fileName_);
  	    ImagesService is = ImagesServiceFactory.getImagesService(); 
  	    String filename = String.format("/gs/%s/%s", gcsFilename.getBucketName(), gcsFilename.getObjectName());
  	    String servingUrl = is.getServingUrl(ServingUrlOptions.Builder.withGoogleStorageFileName(filename).secureUrl(true));
  	    servingUrl = servingUrl + "=s"+ovrv_width;
  	    
  	    String placeURL ;
		if (csEntity.getProperty("placeURL") != null) {
			placeURL   = "";
		} else {
			placeURL   = (String)csEntity.getProperty("placeURL");
		}
		// Update logo and images
		String logoUrl = "";
		if (csEntity.getProperty("logo")!= null && !((String)csEntity.getProperty("logo")).isEmpty() && (String)csEntity.getProperty("logo")!= ""){ 
			String logoFileName = userRnd +"/"+placeName+"/"+placeBranchName+"/"+placeID+"/"+"main"+"/logo.png";
		    gcsFilename = new GcsFilename(bucket, logoFileName);
		    System.out.println("LOGO Upload:" + gcsFilename);
		    is = ImagesServiceFactory.getImagesService(); 
		    filename = String.format("/gs/%s/%s", gcsFilename.getBucketName(), gcsFilename.getObjectName());
		    logoUrl = is.getServingUrl(ServingUrlOptions.Builder.withGoogleStorageFileName(filename));
		    logoUrl = logoUrl + "=s100";
		}
		//------------------------------------------------------------------
  	    // Update Images ---------------------------------------------------
		//------------------------------------------------------------------
		Type collectionType = new TypeToken<List<String>>(){}.getType();
  	    List<String> photosList = gson.fromJson((String)csEntity.getProperty("photos"),collectionType);
  	    if(photosList!= null) {
	  	    for (String imgID : photosList) {
	  	    	bucket = "pp_images"; 
				String photoFileName = userRnd +"/"+placeName+"/"+placeBranchName+"/"+placeID+"/"+"main"+"/photos/"+imgID+".png";
				gcsFilename = new GcsFilename(bucket, photoFileName);
				is = ImagesServiceFactory.getImagesService(); 
				filename = String.format("/gs/%s/%s", gcsFilename.getBucketName(), gcsFilename.getObjectName());

		  	    String imgUrl = is.getServingUrl(ServingUrlOptions.Builder.withGoogleStorageFileName(filename));
		  	    imgUrl = imgUrl + "=s50" ; 

		  	  JsonimgID_2_data imgID2byte64 = new JsonimgID_2_data();
              imgID2byte64.setData64(imgUrl);
              imgID2byte64.setImageID(imgID);
              placeInfo.getPlaceImageThumbnails().add(imgID2byte64);
	  	    } 
  	    }		
		//-----------------------------------------------------------------
  	    // Update Rating --------------------------------------------------
  	    //-----------------------------------------------------------------
		Filter pidFilter = new  FilterPredicate("pid",FilterOperator.EQUAL,placeID);
		Query sq_ = new Query("PlaceRating").setFilter(pidFilter);
		PreparedQuery psq_ = datastore.prepare(sq_);
  		Entity PlaceRatingEntity = psq_.asSingleEntity();
		if(PlaceRatingEntity != null) {	
			PlaceRatingSummary rating = new PlaceRatingSummary();
			Double foodScore = (Double)PlaceRatingEntity.getProperty("food");
			Integer foodTotal = (int)(long)PlaceRatingEntity.getProperty("foodTotal");
			Double staffScore = (Double)PlaceRatingEntity.getProperty("staff");
			Integer staffTotal = (int)(long)PlaceRatingEntity.getProperty("staffTotal");
			Double locationScore = (Double)PlaceRatingEntity.getProperty("location");
			Integer locationTotal = (int)(long)PlaceRatingEntity.getProperty("locationTotal");
			rating.getRating().setFscore(foodScore);
			rating.getRating().setSscore(staffScore);
			rating.getRating().setLscore(locationScore);
			rating.setAverage((locationScore + staffScore + foodScore) / 3);
			rating.setTotal(Math.max(Math.max(foodTotal.intValue(),staffTotal.intValue()),locationTotal.intValue()));
			placeInfo.setRating(rating);
		} else {
			PlaceRatingSummary rating = new PlaceRatingSummary();
			rating.getRating().setFscore((double) 0);
			rating.getRating().setSscore((double) 0);
			rating.getRating().setLscore((double) 0);
			rating.setAverage((double) 0);
			rating.setTotal(0);
			placeInfo.setRating(rating);
		}
		//-----------------------------------------------------------------
  	    //-----------------------------------------------------------------
  	    //-----------------------------------------------------------------		
        userPlace.setAddress(Address);
        userPlace.setBranch(placeBranchName);
        userPlace.setLat(Lat);
        userPlace.setLng(Lng);
        userPlace.setOverviewCloudURL(servingUrl);
        userPlace.setPlace(placeName);
        userPlace.setPlaceID(placeID);
        userPlace.setUserRand(userRnd);
        userPlace.setShapesCount(bookableShapes);
        userPlace.setFloors(floors.size());
        
        placeInfo.setUserPlace(userPlace);
        placeInfo.setPlaceSiteURL(placeURL);
        placeInfo.setPlaceLogo(logoUrl);
        placeInfo.setPlaceOffcet(placeOffset);
        placeInfo.setMainFloorID(mainFloorID);
        placeInfo.setMainFloorName(mainFloorName);
        placeInfo.setPlaceMail(mail);
        placeInfo.setPlacePhone(phone);
   
	  return placeInfo;
  }
}
