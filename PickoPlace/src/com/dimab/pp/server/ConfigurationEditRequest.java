package com.dimab.pp.server;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.dimab.pp.dto.AJAXImagesJSON;
import com.dimab.pp.dto.AdminUser;
import com.dimab.pp.dto.CanvasShape;
import com.dimab.pp.dto.JsonImageID_2_GCSurl;
import com.dimab.pp.dto.JsonSID_2_imgID;
import com.dimab.pp.dto.JsonimgID_2_data;
import com.dimab.pp.dto.PPSubmitObject;
import com.dimab.pp.dto.SingleTimeRange;
import com.dimab.pp.dto.WeekDayOpenClose;
import com.dimab.pp.dto.WeekDays;
import com.dimab.pp.dto.WorkingWeek;
import com.dimab.pp.login.CheckTokenValid;
import com.dimab.pp.login.GenericUser;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
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
import com.google.appengine.tools.cloudstorage.GcsFileMetadata;
import com.google.appengine.tools.cloudstorage.GcsFilename;
import com.google.appengine.tools.cloudstorage.GcsService;
import com.google.appengine.tools.cloudstorage.GcsServiceFactory;
import com.google.appengine.tools.cloudstorage.RetryParams;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;


public class ConfigurationEditRequest extends HttpServlet {
	private static final long serialVersionUID = 1L;
	  private final GcsService gcsService = GcsServiceFactory.createGcsService(new RetryParams.Builder()
      .initialRetryDelayMillis(10)
      .retryMaxAttempts(10)
      .totalRetryPeriodMillis(15000)
      .build());       

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		TransactionOptions options = TransactionOptions.Builder.withXG(true);
		Transaction txn = datastore.beginTransaction(options);
		
		String placeIDvalue = request.getParameter("placeIDvalue");
		
		String username = new String();
		CheckTokenValid tokenValid = new CheckTokenValid(request);
		try {
			GenericUser genuser = tokenValid.getUser();
			if(genuser==null) {
				String returnurl = "/welcome.jsp";
				response.addHeader("Access-Control-Allow-Origin", "*");
				response.sendRedirect(returnurl);
			} else {
				username = genuser.getEmail();
			}
		} catch (NullPointerException e) {
			String returnurl = "/welcome.jsp";
			response.addHeader("Access-Control-Allow-Origin", "*");
			response.sendRedirect(returnurl);
		}
		 
		Filter placeIdFilter = new  FilterPredicate("placeUniqID",FilterOperator.EQUAL,placeIDvalue); 
		Query q = new Query("CanvasState").setFilter(placeIdFilter);
		PreparedQuery pq = datastore.prepare(q);
  		Entity userCanvasState = pq.asSingleEntity();
  		AJAXImagesJSON CanvasStateEdit = new AJAXImagesJSON();
  		
  		if (userCanvasState != null) {
  			Gson gson = new Gson();
			List<AdminUser> placeEditList = new ArrayList<AdminUser>();
			if(userCanvasState.getProperty("placeEditList")!=null) {
				String placeEditListJSON = (String)userCanvasState.getProperty("placeEditList");
				Type collectionType = new TypeToken<List<AdminUser>>(){}.getType();
				placeEditList = gson.fromJson(placeEditListJSON, collectionType);
				if(placeEditList.size() > 0) {
					Boolean fullAccessApproved = false;
					for(AdminUser user_ : placeEditList) {
						if(user_.getMail().equals(username)) {
							if(user_.isFull_access()) {
								fullAccessApproved = true;
							}
						}
					}
					if(!fullAccessApproved ){
						 if(username.equals((String)userCanvasState.getProperty("username"))) {
							    AdminUser adminAccess = new AdminUser();
				   	  		    adminAccess.setMail(username);
				   	  		    adminAccess.setFull_access(true);
				                adminAccess.setEdit_place(true);
				                adminAccess.setMove_only(true);
				                adminAccess.setBook_admin(true);
				                placeEditList.add(adminAccess);
				                userCanvasState.setUnindexedProperty("placeEditList",gson.toJson(placeEditList));
				                datastore.put(userCanvasState);
						} else {
							System.out.println("No full_name access in list");
							String returnurl = "/welcome.jsp";
							response.addHeader("Access-Control-Allow-Origin", "*");
							response.sendRedirect(returnurl);
						}
					}
				} else {
					System.out.println("Admin List zero");
					if(!username.equals((String)userCanvasState.getProperty("username"))) {
						String returnurl = "/welcome.jsp";
						response.addHeader("Access-Control-Allow-Origin", "*");
						response.sendRedirect(returnurl);
					} else {
						AdminUser adminAccess = new AdminUser();
		   	  		    adminAccess.setMail(username);
		   	  		    adminAccess.setFull_access(true);
		                adminAccess.setEdit_place(true);
		                adminAccess.setMove_only(true);
		                adminAccess.setBook_admin(true);
		                placeEditList.add(adminAccess);
		                userCanvasState.setUnindexedProperty("placeEditList",gson.toJson(placeEditList));
		                datastore.put(userCanvasState);
					}
				}
			} else {
				if(!username.equals((String)userCanvasState.getProperty("username"))) {
					String returnurl = "/welcome.jsp";
					response.addHeader("Access-Control-Allow-Origin", "*");
					response.sendRedirect(returnurl);
				} else {
					AdminUser adminAccess = new AdminUser();
	   	  		    adminAccess.setMail(username);
	   	  		    adminAccess.setFull_access(true);
	                adminAccess.setEdit_place(true);
	                adminAccess.setMove_only(true);
	                adminAccess.setBook_admin(true);
	                placeEditList.add(adminAccess);
	                userCanvasState.setUnindexedProperty("placeEditList",gson.toJson(placeEditList));
	                datastore.put(userCanvasState);
				}
			}
			txn.commit();
  			
  			String shapesJSON =  ((Text) userCanvasState.getProperty("shapesJSON")).getValue();
  			String sid2ImageIDJSON =  ((Text) userCanvasState.getProperty("sid2ImageIDJSON")).getValue();
  			String placeID = (String) userCanvasState.getProperty("placeUniqID");
  			String placeName = (String) userCanvasState.getProperty("placeName");
  			String placeBranchName = (String)  userCanvasState.getProperty("placeBranchName");
  			String usernameRandom =  (String)  userCanvasState.getProperty("usernameRandom");
  			double UTCoffcet = 0;
  			if (userCanvasState.getProperty("UTCoffcet") == null) {
  				UTCoffcet = (double) 0;
  			} else {
  				UTCoffcet = (double) userCanvasState.getProperty("UTCoffcet");
  				
  			}
  			
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
			if (userCanvasState.getProperty("address") != null) {
				address    = (String)userCanvasState.getProperty("address");
			} else {
				address = "";
			}
			String lat ;
			if(userCanvasState.getProperty("lat") != null) {
				lat        = (String)userCanvasState.getProperty("lat");
			} else {
				lat        = "";
			}
			String lng ;
			if(userCanvasState.getProperty("lng") != null) {
				lng        = (String)userCanvasState.getProperty("lng");
			} else {
				lng        = "";
			}			
			String placePhone ;
			if (userCanvasState.getProperty("placePhone")!= null) {
				placePhone = (String)userCanvasState.getProperty("placePhone");
			} else {
				placePhone = "";
			}
			String placeFax;
			if (userCanvasState.getProperty("placeFax")!= null) {
				placeFax   = (String)userCanvasState.getProperty("placeFax");
			} else {
				placeFax   = "";
			}
			String placeMail ;
			if (userCanvasState.getProperty("placeMail") != null) {
				placeMail  = (String)userCanvasState.getProperty("placeMail");
			} else {
				placeMail  = "";
			}
			String placeURL ;
			if (userCanvasState.getProperty("placeURL") != null) {
				placeURL   = (String)userCanvasState.getProperty("placeURL");
			} else {
				placeURL   = "";
			}
			String placeDescription  = "";
			if (userCanvasState.getProperty("placeDescription") != null) {
				placeDescription  = (String)userCanvasState.getProperty("placeDescription");
			}
			boolean automatic_approval = true;
			if (userCanvasState.getProperty("automatic_approval") != null) {
				automatic_approval = (boolean)userCanvasState.getProperty("automatic_approval");
			}
			List<String> automaticApprovalList = new ArrayList<String>();			
			if (userCanvasState.getProperty("automaticApprovalList") != null) {
				String automaticApprovalListJSON = (String)userCanvasState.getProperty("automaticApprovalList");
				collectionType = new TypeToken<List<String>>(){}.getType();
				automaticApprovalList = gson.fromJson(automaticApprovalListJSON, collectionType);				
			}
			List<String> adminApprovalList = new ArrayList<String>();
			if(userCanvasState.getProperty("adminApprovalList")!=null) {
				String adminApprovalListJSON = (String)userCanvasState.getProperty("adminApprovalList");
				collectionType = new TypeToken<List<String>>(){}.getType();
				adminApprovalList = gson.fromJson(adminApprovalListJSON, collectionType);
			}

			List<Integer> closeDates =  new ArrayList<Integer>();
			if (userCanvasState.getProperty("closeDates")!=null) {
				String closeDatesJSON = (String)userCanvasState.getProperty("closeDates");
				collectionType = new TypeToken<List<Integer>>(){}.getType();
				closeDates = gson.fromJson(closeDatesJSON, collectionType);
			}
			Collections.sort(closeDates);
			WorkingWeek workinghours =  new WorkingWeek();
			if(userCanvasState.getProperty("workinghours")!=null) {
				String workinghoursJSON = (String)userCanvasState.getProperty("workinghours");
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
			if (userCanvasState.getProperty("logo")!= null && !((String)userCanvasState.getProperty("logo")).isEmpty() && (String)userCanvasState.getProperty("logo")!= ""){
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
	  	    
	  	    collectionType = new TypeToken<List<String>>(){}.getType();
	  	    List<String> photosList = gson.fromJson((String)userCanvasState.getProperty("photos"),collectionType);
	  	    if(photosList!= null) {
		  	    for (String imgID : photosList) {
		  	    	String bucket = "pp_images"; 
					String photoFileName = usernameRandom +"/"+placeName+"/"+placeBranchName+"/"+placeID+"/"+"main"+"/photos/"+imgID+".png";
					GcsFilename gcsFilename = new GcsFilename(bucket, photoFileName);
					ImagesService is = ImagesServiceFactory.getImagesService(); 
					String filename = String.format("/gs/%s/%s", gcsFilename.getBucketName(), gcsFilename.getObjectName());
			  	    GcsFileMetadata meta = gcsService.getMetadata(gcsFilename);
			  	    Integer width  = Integer.valueOf(meta.getOptions().getUserMetadata().get("width"));
			  	    Integer height = Integer.valueOf(meta.getOptions().getUserMetadata().get("height"));
			  	    String imgUrl = is.getServingUrl(ServingUrlOptions.Builder.withGoogleStorageFileName(filename));
			  	    if(width > height) {
			  	    	Double relation = (double) (width / height);
			  	    	Long new_width = Math.round(relation * 150);
			  	    	imgUrl = imgUrl + "=s" + new_width;
			  	    } else {
			  	        imgUrl = imgUrl + "=s150" ; 
			  	    }
			  	  JsonimgID_2_data imgID2byte64 = new JsonimgID_2_data();
	              imgID2byte64.setData64(imgUrl);
	              imgID2byte64.setImageID(imgID);
	              imgID2byte64.setHeight(height);
	              imgID2byte64.setWidth(width);
	              CanvasStateEdit.getPlacePhotos().add(imgID2byte64);              
		  	    } 
	  	    } 
  		}  
  		

  		request.setAttribute("canvasEditPlace", CanvasStateEdit);
		RequestDispatcher dispathser  = request.getRequestDispatcher("/Place_Configuration.jsp");
		response.addHeader("Access-Control-Allow-Origin", "*");
		dispathser.forward(request, response);		
	}

}
