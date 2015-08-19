package com.dimab.pp.JSON;

import com.dimab.pp.dto.AJAXImagesJSON;
import com.dimab.pp.dto.AdminUser;
import com.dimab.pp.dto.CanvasShape;
import com.dimab.pp.dto.JsonImageID_2_GCSurl;
import com.dimab.pp.dto.JsonSID_2_imgID;
import com.dimab.pp.dto.JsonimgID_2_data;
import com.dimab.pp.dto.PPSubmitObject;
import com.dimab.pp.dto.PlacePhotoUploaded;
import com.dimab.pp.dto.ShapeBookingOptions;
import com.dimab.pp.dto.SingleTimeRangeLong;
import com.dimab.pp.dto.WeekDayOpenClose;
import com.dimab.pp.functions.RandomStringGenerator;
import com.dimab.pp.login.CheckTokenValid;
import com.dimab.pp.login.GenericUser;
import com.dimab.pp.search.SearchFabric;
import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Text;
import com.google.appengine.api.datastore.Transaction;
import com.google.appengine.api.datastore.TransactionOptions;
import com.google.appengine.api.datastore.Query.CompositeFilterOperator;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.appengine.api.images.ImagesService;
import com.google.appengine.api.images.ImagesServiceFactory;
import com.google.appengine.api.images.ServingUrlOptions;
import com.google.appengine.tools.cloudstorage.GcsFileOptions;
import com.google.appengine.tools.cloudstorage.GcsFilename;
import com.google.appengine.tools.cloudstorage.GcsInputChannel;
import com.google.appengine.tools.cloudstorage.GcsOutputChannel;
import com.google.appengine.tools.cloudstorage.GcsService;
import com.google.appengine.tools.cloudstorage.GcsServiceFactory;
import com.google.appengine.tools.cloudstorage.RetryParams;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.lang.reflect.Type;
import java.nio.channels.Channels;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletException;

public class AJAXImageImport extends HttpServlet {
	private static final long serialVersionUID = 1L;

	  private final GcsService gcsService = GcsServiceFactory.createGcsService(new RetryParams.Builder()
	      .initialRetryDelayMillis(10)
	      .retryMaxAttempts(10)
	      .totalRetryPeriodMillis(15000)
	      .build());

	  /**Used below to determine the size of chucks to read in. Should be > 1kb and < 10MB */
	  private static final int BUFFER_SIZE = 2 * 1024 * 1024;
    
    public AJAXImageImport() {
        super();
        // TODO Auto-generated constructor stub
    }


	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		TransactionOptions options = TransactionOptions.Builder.withXG(true);
		Transaction txn = datastore.beginTransaction(options);
		Date date = new Date();
		
		String username_email = new String();
		CheckTokenValid tokenValid = new CheckTokenValid(request);
		GenericUser genuser = tokenValid.getUser();
		if(genuser==null) {
			String returnurl = "http://pickoplace.com/welcome.jsp";
			response.sendRedirect(returnurl);
		} else {
			username_email = genuser.getEmail();
		}
		String jsonString = request.getParameter("jsonObject");
		Gson gson = new Gson();
		AJAXImagesJSON SaveObject = gson.fromJson(jsonString, AJAXImagesJSON.class);
        String stage = SaveObject.getStage();
		String userRandom = "";

		
		Filter UserExists = new  FilterPredicate("username",FilterOperator.EQUAL,username_email);
		Query q = new Query("Users").setFilter(UserExists);
		PreparedQuery pq = datastore.prepare(q);
		Entity result = pq.asSingleEntity();
	if (result != null) {
		String placeID = SaveObject.getPlaceID();
		
		Type collectionType = new TypeToken<List<String>>(){}.getType();
		List<String> fa_list = new ArrayList<String>();
		List<String> ep_list = new ArrayList<String>();
		List<String> mo_list = new ArrayList<String>();
		List<String> ba_list = new ArrayList<String>();
		if(result.getProperty("PID_full_access")!=null) {
			fa_list = gson.fromJson((String)result.getProperty("PID_full_access"),collectionType);
		} 
		if(result.getProperty("PID_edit_place")!=null) {
			ep_list = gson.fromJson((String)result.getProperty("PID_edit_place"),collectionType);
		}
		if(result.getProperty("PID_move_only")!=null) {
			mo_list = gson.fromJson((String)result.getProperty("PID_move_only"),collectionType);
		}
		if(result.getProperty("PID_book_admin")!=null) {
			ba_list = gson.fromJson((String)result.getProperty("PID_book_admin"),collectionType);
		}
		if(!fa_list.contains(placeID)) {
			fa_list.add(placeID);
			result.setProperty("PID_full_access",gson.toJson(fa_list));
		}
		if(!ep_list.contains(placeID)) {
			ep_list.add(placeID);
			result.setProperty("PID_edit_place",gson.toJson(ep_list));
		}
		if(!mo_list.contains(placeID)) {
			mo_list.add(placeID);
			result.setProperty("PID_move_only",gson.toJson(mo_list));
		}
		if(!ba_list.contains(placeID)) {
			ba_list.add(placeID);
			result.setProperty("PID_book_admin",gson.toJson(ba_list));
		}
		datastore.put(result);
		
		userRandom = (String) result.getProperty("UserID");
		
		//String username = CI.getUser_();
		String place = SaveObject.getPlace_();
		String snif = SaveObject.getSnif_();
		List<JsonimgID_2_data> JSONbyte64files = SaveObject.getJSONbyte64files();
		List<JsonSID_2_imgID> JSONSIDlinks = SaveObject.getJSONSIDlinks();
		System.out.println(JSONSIDlinks.toString());
        GcsFileOptions.Builder optionsBuilder = new GcsFileOptions.Builder();
        GcsOutputChannel outputChannel;
		
		System.out.println("SAVING Canvas Images: USER='"+username_email+"', USER_RANDOM='"+userRandom+"',PLACE'"+place+"',SNIF='"+snif+"',PID='"+placeID);

		final GcsService gcsService = GcsServiceFactory.createGcsService(RetryParams.getDefaultInstance());
		// Floor loop
		String mainFloorID = "";
		int backgroundVersion ;
		int overviewVersion ;
 	    Filter imageVersion = new  FilterPredicate("PID",FilterOperator.EQUAL,placeID);
 	    Query piq = new Query("ImageVersion").setFilter(imageVersion);
        PreparedQuery sbpiq = datastore.prepare(piq);
  		Entity imageVersionEntity = sbpiq.asSingleEntity();
  		if (imageVersionEntity == null) {
  			imageVersionEntity = new Entity("ImageVersion");  			
  			overviewVersion = 1;
  			backgroundVersion = 1;
  			imageVersionEntity.setProperty("PID", placeID);
  			imageVersionEntity.setProperty("overviewVersion", overviewVersion);
  			imageVersionEntity.setProperty("backgroundVersion", backgroundVersion);

  		} else {
  			backgroundVersion = (int)(long)imageVersionEntity.getProperty("backgroundVersion");
  			overviewVersion = (int)(long)imageVersionEntity.getProperty("overviewVersion");
  			backgroundVersion+=1;
  			overviewVersion+=1;
  			imageVersionEntity.setProperty("overviewVersion", overviewVersion);
  			imageVersionEntity.setProperty("backgroundVersion", backgroundVersion);
  		}		
  		datastore.put(imageVersionEntity);
		 for (PPSubmitObject floor:SaveObject.getFloors()) {
			String backgroundByte64image = floor.getBackground();
			String overviewByte64image = floor.getAllImageSrc();
			String floorID = floor.getFloorid();
			boolean mainfloor = floor.isMainfloor();
			if(mainfloor) {				
				mainFloorID = floorID;
			}

	        String backgroundFileName;
	        String OverviewFileName;
			// Delete previous versions
  			backgroundVersion-=1;
  			overviewVersion-=1;
  			backgroundFileName = userRandom+"/"+place+"/"+snif+"/"+placeID+"/"+"main"+"/"+floorID+"/backgroundImage"+"_"+backgroundVersion+".png";
  			OverviewFileName = userRandom+"/"+place+"/"+snif+"/"+placeID+"/"+"main"+"/"+floorID+"/overview"+"_"+overviewVersion+".png";
  			GcsFilename bname = new GcsFilename("pp_images", backgroundFileName);
  			GcsFilename oname = new GcsFilename("pp_images", OverviewFileName);
  			gcsService.delete(bname);
  			gcsService.delete(oname);

  		   // Update new Version
  			backgroundVersion+=1;
  			overviewVersion+=1;
			backgroundFileName = userRandom+"/"+place+"/"+snif+"/"+placeID+"/"+"main"+"/"+floorID+"/backgroundImage"+"_"+backgroundVersion+".png";
			OverviewFileName = userRandom+"/"+place+"/"+snif+"/"+placeID+"/"+"main"+"/"+floorID+"/overview"+"_"+overviewVersion+".png";
	
			
			
	
	     // Saving background image
	        if (backgroundByte64image!=null) {
		        String[] imageInfo = backgroundByte64image.split(",");
		        GcsFilename name = new GcsFilename("pp_images", backgroundFileName);        
		        optionsBuilder.mimeType("image/png");
		        outputChannel = gcsService.createOrReplace(name, optionsBuilder.build());
		        copy(decodeBytes(imageInfo[1]), Channels.newOutputStream(outputChannel));
		        System.out.println("Background Image = " + name);
	        }
	        // Saving overview image
			String[] OimageInfo = overviewByte64image.split(",");
	        GcsFilename Oname = new GcsFilename("pp_images", OverviewFileName);
	        optionsBuilder.mimeType("image/png");
	        outputChannel = gcsService.createOrReplace(Oname, optionsBuilder.build());
	        copy(decodeBytes(OimageInfo[1]), Channels.newOutputStream(outputChannel));
	        System.out.println("Overview Image = " + Oname);
		 }
  	///-------------------------------------------------------------          
        // Saving shapes images
	  if(!stage.equals("Configuration")) {
		// Shapes images not edited in the "Configuration" stage
        for(JsonimgID_2_data imgID2byte64: JSONbyte64files) {
        	
        	String imgID = imgID2byte64.getImageID();
        	String data64 = imgID2byte64.getData64();
        	String fileName = userRandom+"/"+place+"/"+snif+"/"+placeID+"/"+"main"+"/"+imgID+".png";
        	System.out.println(fileName);
    		String[] SimageInfo = data64.split(",");
            GcsFilename Sname = new GcsFilename("pp_images", fileName);
            optionsBuilder.mimeType("image/png");
            outputChannel = gcsService.createOrReplace(Sname, optionsBuilder.build());
            copy(decodeBytes(SimageInfo[1]), Channels.newOutputStream(outputChannel));
            System.out.println("Shapes Image = " + Sname);
        }
	  }
        // Saving Canvas object
            List<PPSubmitObject> CanvasObjectList = SaveObject.getFloors();
            List<JsonSID_2_imgID> sid2ImageID = SaveObject.getJSONSIDlinks();
            int mk = 0;
            for (PPSubmitObject floor:CanvasObjectList) {  
            	floor.setUsername(userRandom);
            	floor.setBackground("");
            	floor.setAllImageSrc(""); 
            	
         	   String name = "";
         	  for (CanvasShape shape : floor.getShapes()) {
         		 ShapeBookingOptions bookingOptions = shape.getBooking_options();
         	   if (bookingOptions.getGivenName() != null) {
         	      name = bookingOptions.getGivenName() ;
         	   } else {
         		  mk += 1;
         		  name = place + "/" + snif +"/" + mk;
         		  name = name.replaceAll(" ", "_");
         		  shape.getBooking_options().setGivenName(name);
         	   }
         	  }
            }
            Filter userPlaceEntityFilterByPlaceName = new  FilterPredicate("placeName",FilterOperator.EQUAL,place);
            Filter userPlaceEntityFilterByBranchName = new  FilterPredicate("placeBranchName",FilterOperator.EQUAL,snif);
            Filter userPlaceEntityFilterByID = new  FilterPredicate("placeUniqID",FilterOperator.EQUAL,placeID);
            Filter PlaceAndBranch = CompositeFilterOperator.and(userPlaceEntityFilterByPlaceName,userPlaceEntityFilterByBranchName,userPlaceEntityFilterByID);
	  		Query q_ = new Query("UserPlace").setFilter(PlaceAndBranch);
	  		PreparedQuery pq_ = datastore.prepare(q_);
	  		Entity userPlaceEntity = pq_.asSingleEntity();
	  		if (userPlaceEntity != null) {
	  		   gson = new Gson();
	  		   String canvasStateJSON = gson.toJson(CanvasObjectList);
	  		   String sid2ImageIDJSON = gson.toJson(sid2ImageID);
	  		   Text TcanvasStateJSON = new Text(canvasStateJSON);
	  		   Text Tsid2ImageIDJSON = new Text(sid2ImageIDJSON);
	  		   System.out.println("Canvas JSON:" + canvasStateJSON);

               Query csq = new Query("CanvasState").setAncestor(userPlaceEntity.getKey());
               PreparedQuery cspq = datastore.prepare(csq);
   	  		   Entity canvasState = cspq.asSingleEntity();
   	  		   if (canvasState == null) {
   	  			canvasState = new Entity("CanvasState",userPlaceEntity.getKey());
   	  		    canvasState.setProperty("DateCreated", date.toString());
   	  	        canvasState.setProperty("DateCreatedSec", date.getTime()/1000);
   	  	        canvasState.setProperty("logo", "");
   	  	        canvasState.setProperty("placePhone",SaveObject.getPlacePhone());
	            canvasState.setProperty("placeFax",SaveObject.getPlaceFax());
	            canvasState.setProperty("placeMail",SaveObject.getPlaceMail());
	            canvasState.setProperty("placeURL",SaveObject.getPlaceURL());
	            canvasState.setProperty("placeDescription",SaveObject.getPlaceDescription());
	            canvasState.setProperty("automatic_approval",SaveObject.isAutomatic_approval());
	            canvasState.setProperty("automaticApprovalList",gson.toJson(SaveObject.getAutomaticApprovalList()));
	            canvasState.setProperty("adminApprovalList",gson.toJson(SaveObject.getAdminApprovalList()));
	            canvasState.setProperty("placeEditList",gson.toJson(SaveObject.getPlaceEditList()));
	            canvasState.setProperty("closeDates",gson.toJson(SaveObject.getCloseDates()));
	            canvasState.setProperty("workinghours",gson.toJson(SaveObject.getWorkinghours()));
	            canvasState.setProperty("UTCoffcet",SaveObject.getUTCoffset());
	            canvasState.setProperty("bookingsCount",0);
   	  		   }
   	  		   
   	  		   if (canvasState.getProperty("bookingsCount")==null) {
   	  			canvasState.setProperty("bookingsCount",0);
   	  		   }
               canvasState.setProperty("username", username_email);
               canvasState.setProperty("usernameRandom", userRandom);
               canvasState.setProperty("placeName", place);
               canvasState.setProperty("placeBranchName", snif);
               canvasState.setProperty("UserPlaceDBKey", userPlaceEntity.getKey());
               canvasState.setProperty("shapesJSON", TcanvasStateJSON);
               canvasState.setProperty("sid2ImageIDJSON",Tsid2ImageIDJSON);
               canvasState.setProperty("placeUniqID", placeID);
               canvasState.setProperty("DateUpdated", date.toString());
  	  	       canvasState.setProperty("DateUpdatedSec", date.getTime()/1000);
  	  	       canvasState.setProperty("UTCoffcet", (double)  userPlaceEntity.getProperty("UTCoffcet"));
  	  	       canvasState.setProperty("mainFloorID",mainFloorID);
  	  	       userPlaceEntity.setProperty("mainFloorID",mainFloorID);

       
  	  	       // Configuration section

  	          canvasState.setProperty("address",SaveObject.getAddress());
  	          canvasState.setProperty("lat",SaveObject.getLat());
  	          canvasState.setProperty("lng",SaveObject.getLng());
  	          
  	        if(stage.equals("Configuration")) { 
  	          canvasState.setProperty("placePhone",SaveObject.getPlacePhone());
  	          canvasState.setProperty("placeFax",SaveObject.getPlaceFax());
  	          canvasState.setProperty("placeMail",SaveObject.getPlaceMail());
  	          canvasState.setProperty("placeURL",SaveObject.getPlaceURL());
  	          canvasState.setProperty("placeDescription",SaveObject.getPlaceDescription());
  	          canvasState.setProperty("automatic_approval",SaveObject.isAutomatic_approval());
  	          canvasState.setProperty("automaticApprovalList",gson.toJson(SaveObject.getAutomaticApprovalList()));
  	          canvasState.setProperty("adminApprovalList",gson.toJson(SaveObject.getAdminApprovalList()));
  	          canvasState.setProperty("placeEditList",gson.toJson(SaveObject.getPlaceEditList()));
  	          canvasState.setProperty("closeDates",gson.toJson(SaveObject.getCloseDates()));
  	          canvasState.setProperty("workinghours",gson.toJson(SaveObject.getWorkinghours()));
  	          canvasState.setProperty("UTCoffcet",SaveObject.getUTCoffset());
  	          
  	            List<AdminUser> placeEditList = SaveObject.getPlaceEditList();
  	            for (AdminUser auser : placeEditList) {
  	            	Filter UserExists__ = new  FilterPredicate("username",FilterOperator.EQUAL,auser.getMail());
  	      		    Query q__ = new Query("Users").setFilter(UserExists__);
  	      		    PreparedQuery pq__ = datastore.prepare(q__);
  	      		    Entity result__ = pq__.asSingleEntity();
  	      		    if (result__ != null) {
  	      		    	if(auser.isFull_access()) {
	  	      		    	List<String> fa_list__ = new ArrayList<String>();
		  	      		    if(result__.getProperty("PID_full_access")!=null) {
			  	      			fa_list__ = gson.fromJson((String)result__.getProperty("PID_full_access"),collectionType);
			  	      			
			  	      		} 
			  	      		if(!fa_list__.contains(placeID)) {
			  	      			fa_list__.add(placeID);
			  	      			result__.setProperty("PID_full_access",gson.toJson(fa_list__));
			  	      		}
  	      		    	}
  	      		    	if(auser.isEdit_place()) {
	  	      		    	List<String> ep_list__ = new ArrayList<String>();
		  	      		    if(result__.getProperty("PID_edit_place")!=null) {
			  	      			ep_list__ = gson.fromJson((String)result__.getProperty("PID_edit_place"),collectionType);
			  	      			
			  	      		} 
			  	      		if(!ep_list__.contains(placeID)) {
			  	      			ep_list__.add(placeID);
			  	      			result__.setProperty("PID_edit_place",gson.toJson(ep_list__));
			  	      		}
  	      		    	}	
  	      		    	if(auser.isMove_only()) {
	  	      		    	List<String> mo_list__ = new ArrayList<String>();
		  	      		    if(result__.getProperty("PID_move_only")!=null) {
			  	      			mo_list__ = gson.fromJson((String)result__.getProperty("PID_move_only"),collectionType);
			  	      			
			  	      		} 
			  	      		if(!mo_list__.contains(placeID)) {
			  	      			mo_list__.add(placeID);
			  	      			result__.setProperty("PID_move_only",gson.toJson(mo_list__));
			  	      		}
  	      		    	}	
  	      		    	if(auser.isBook_admin()) {
	  	      		    	List<String> ba_list__ = new ArrayList<String>();
		  	      		    if(result__.getProperty("PID_book_admin")!=null) {
			  	      			ba_list__ = gson.fromJson((String)result__.getProperty("PID_book_admin"),collectionType);
			  	      			
			  	      		} 
			  	      		if(!ba_list__.contains(placeID)) {
			  	      			ba_list__.add(placeID);
			  	      			result__.setProperty("PID_book_admin",gson.toJson(ba_list__));
			  	      		}
  	      		    	}
		  	      		datastore.put(result__);  	      		    	
  	      		    
  	      		    } else {
  	      		    	System.out.println("Admin User account doesnt exists:"+auser.getMail() );
  	      		    }
 
  	            }
           	    userPlaceEntity.setProperty("placeName", place);
           	    userPlaceEntity.setProperty("placeBranchName", snif);
           	    userPlaceEntity.setProperty("placeAddress", SaveObject.getAddress());
           	    userPlaceEntity.setProperty("UTCoffcet",SaveObject.getUTCoffset());
      		    userPlaceEntity.setProperty("placeLat", Double.parseDouble(SaveObject.getLat()));
      		    userPlaceEntity.setProperty("placeLng", Double.parseDouble(SaveObject.getLng()));
        		userPlaceEntity.setProperty("placePhone", SaveObject.getPlacePhone());
      	    	userPlaceEntity.setProperty("placeFax", SaveObject.getPlaceFax());    	   
              }  	  	 
  	          if(stage.equals("Configuration")) {
  	        	// Update Logo And photos
  	        	String logo = "logo";
  	        	String data64 = SaveObject.getLogosrc();
  	        	if(data64==null || data64.isEmpty()|| data64 == "") {
  	        		canvasState.setProperty("logo",""); 
  	        	} else {
	  	        	String fileName = userRandom+"/"+place+"/"+snif+"/"+placeID +"/"+"main"+"/"+logo+".png";
	  	        	System.out.println("Saving Logo:"+fileName);
	  	    		String[] SimageInfo = data64.split(",");
	  	            GcsFilename Sname = new GcsFilename("pp_images", fileName);
	  	            optionsBuilder.mimeType("image/png");
	  	            outputChannel = gcsService.createOrReplace(Sname, optionsBuilder.build());
	  	            copy(decodeBytes(SimageInfo[1]), Channels.newOutputStream(outputChannel));
	  	            canvasState.setProperty("logo",fileName);    
  	        	}
  		       } 
  	          
  	        List<String> prevPhotosList = new ArrayList<String>();
  	        List<String> photosList = new ArrayList<String>();
  	        
  	          if(stage.equals("Configuration")) {
  	  	          if(canvasState.getProperty("photos") != null) {
  	  	        	collectionType = new TypeToken<List<String>>(){}.getType();
  	  	        	prevPhotosList = gson.fromJson((String)canvasState.getProperty("photos"),collectionType);     	  
  	  	          }
  	  	          
  	  	          
	  	       for (JsonimgID_2_data imgID2byte64: SaveObject.getPlacePhotos()) {
	  	    	    // Save Photos
	  	        	String imgID = imgID2byte64.getImageID();
	  	        	Integer width = imgID2byte64.getWidth();
	  	        	Integer height = imgID2byte64.getHeight();
	  	        	if(prevPhotosList.indexOf(imgID) == -1) {
	  	        		// New image ID - considered as new image
		  	        	String data64 = imgID2byte64.getData64();
		  	        	String fileName = userRandom+"/"+place+"/"+snif+"/"+placeID+"/"+"main"+"/photos/"+imgID+".png";
		  	        	System.out.println("Saving Place Photo:"+fileName);
		  	    		String[] SimageInfo = data64.split(",");
		  	            GcsFilename Sname = new GcsFilename("pp_images", fileName);
		  	            optionsBuilder = new GcsFileOptions.Builder();
		  	            optionsBuilder.mimeType("image/png");
		  	            optionsBuilder.addUserMetadata("width", width.toString());
		  	            optionsBuilder.addUserMetadata("height" , height.toString());
		  	            outputChannel = gcsService.createOrReplace(Sname, optionsBuilder.build());
		  	            copy(decodeBytes(SimageInfo[1]), Channels.newOutputStream(outputChannel));
	  	        	}
	  	            photosList.add(imgID);
	  	        }	
	  	          for (String imgID:prevPhotosList) {
	  	        	  // Run on old photo ID's
	  	        	  int idx = photosList.indexOf(imgID);
	  	        	  if (idx == -1) {
	  	        		  // If ID not exists anymore , the image should be removed from the Cloud Storage
	  	        		  String fileName = userRandom+"/"+place+"/"+snif+"/"+placeID+"/"+"main"+"/photos/"+imgID+".png";
	  	        		  gcsService.delete(new GcsFilename("pp_images", fileName));
	  	        	  }
	  	          }
	  	        canvasState.setProperty("photos",gson.toJson(photosList));
  	          }

  	           SearchFabric searchIndexFabrix = new SearchFabric();
  	           searchIndexFabrix.CreatePlaceDocument(canvasState);
               datastore.put(canvasState);
               datastore.put(userPlaceEntity);
               
               Key canvasStateKey = canvasState.getKey();
             int k = 0;
             for (PPSubmitObject floor:CanvasObjectList) {  
            	 
               String floor_id = floor.getFloorid();
               for (CanvasShape shape : floor.getShapes()) {
            	   k += 1;
            	   ShapeBookingOptions bookingOptions = shape.getBooking_options();
            	   String sid = shape.getSid();

            	   Filter shapeSIODFilter = new  FilterPredicate("sid",FilterOperator.EQUAL,sid);
            	   Query sbq = new Query("Shapes").setFilter(shapeSIODFilter);
                   PreparedQuery sbpq = datastore.prepare(sbq);
       	  		   Entity shapeBooking = sbpq.asSingleEntity();
       	  		   if (shapeBooking == null) {
       	  			 shapeBooking = new Entity("Shapes",userPlaceEntity.getKey());
       	  		   }
            	   

            	   shapeBooking.setProperty("CanvasStateKey", canvasStateKey);
            	   shapeBooking.setProperty("floor_id",floor_id);
            	   shapeBooking.setProperty("sid", sid);
            	   shapeBooking.setProperty("name", bookingOptions.getGivenName());
            	   shapeBooking.setProperty("minP", bookingOptions.getMinPersons());
            	   shapeBooking.setProperty("maxP", bookingOptions.getMaxPersons());
            	   shapeBooking.setProperty("weekDays", gson.toJson(bookingOptions.getWeekDays()));
            	   shapeBooking.setProperty("timeRange", gson.toJson(bookingOptions.getTimeRange()));
            	   shapeBooking.setProperty("description", bookingOptions.getDescription());
            	   datastore.put(shapeBooking);
               }
               
             }
             
             txn.commit();
	  		}
		} else {
			// No user exists
		}
	}
	
	private void copy(byte[] Byteinput, OutputStream output) throws IOException {
		    try {
		      InputStream input = new ByteArrayInputStream(Byteinput);
		      byte[] buffer = new byte[BUFFER_SIZE];
		      int bytesRead = input.read(buffer);
		      while (bytesRead != -1) {
		        output.write(buffer, 0, bytesRead);
		        bytesRead = input.read(buffer);
		      }
		    } finally {
		      output.close();
		    }
		  }
    public byte[] decodeBytes(String mBytes)
     {
      return com.google.api.client.util.Base64.decodeBase64(mBytes);
     }
}
