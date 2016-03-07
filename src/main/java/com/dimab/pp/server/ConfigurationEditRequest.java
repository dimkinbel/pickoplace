package com.dimab.pp.server;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.ArrayList; 
import java.util.Collections;
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
import com.dimab.pp.dto.*;
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
		GetAJAXimageJSONfromCSfactory csFactory = new GetAJAXimageJSONfromCSfactory();

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
			return;
		}
		 
		Filter placeIdFilter = new  FilterPredicate("placeUniqID",FilterOperator.EQUAL,placeIDvalue); 
		Query q = new Query("CanvasState").setFilter(placeIdFilter);
		PreparedQuery pq = datastore.prepare(q);
  		Entity userCanvasState = pq.asSingleEntity();
		ConfigurationObject configuration = new ConfigurationObject();
		AJAXImagesJSON CanvasStateEdit = new AJAXImagesJSON();

  		if (userCanvasState != null) { 
			List<AdminUser> placeEditList = new ArrayList<AdminUser>();
			if(userCanvasState.getProperty("placeEditList")!=null) {
				String placeEditListJSON = (String)userCanvasState.getProperty("placeEditList");
				Type collectionType = new TypeToken<List<AdminUser>>(){}.getType();
				placeEditList = JsonUtils.deserialize(placeEditListJSON, collectionType);
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
				                userCanvasState.setUnindexedProperty("placeEditList",JsonUtils.serialize(placeEditList));
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
		                userCanvasState.setUnindexedProperty("placeEditList",JsonUtils.serialize(placeEditList));
		                datastore.put(userCanvasState);
					}
				}
			} else {
				if(!username.equals((String)userCanvasState.getProperty("username"))) {
					String returnurl = "/welcome.jsp";
					response.addHeader("Access-Control-Allow-Origin", "*");
					response.sendRedirect(returnurl);
					return;
				} else {
					AdminUser adminAccess = new AdminUser();
	   	  		    adminAccess.setMail(username);
	   	  		    adminAccess.setFull_access(true);
	                adminAccess.setEdit_place(true);
	                adminAccess.setMove_only(true);
	                adminAccess.setBook_admin(true);
	                placeEditList.add(adminAccess);
	                userCanvasState.setUnindexedProperty("placeEditList",JsonUtils.serialize(placeEditList));
	                datastore.put(userCanvasState);
				}
			}
			txn.commit();

			String placeID = (String) userCanvasState.getProperty("placeUniqID");
			String usernameRandom =  (String)  userCanvasState.getProperty("usernameRandom");

			// Get canvas Data
			CanvasStateEdit = csFactory.getBaseData(userCanvasState, datastore);

			Type  collectionType = new TypeToken<List<String>>(){}.getType();
	  	    List<String> photosList = JsonUtils.deserialize((String)userCanvasState.getProperty("photos"),collectionType);
	  	    if(photosList!= null) {
		  	    for (String imgID : photosList) {
		  	    	String bucket = "pp_images"; 
					String photoFileName = usernameRandom +"/" +placeID+"/"+"main"+"/photos/"+imgID+".png";
					GcsFilename gcsFilename = new GcsFilename(bucket, photoFileName);
					ImagesService is = ImagesServiceFactory.getImagesService(); 
					String filename = String.format("/gs/%s/%s", gcsFilename.getBucketName(), gcsFilename.getObjectName());
			  	    GcsFileMetadata meta = gcsService.getMetadata(gcsFilename);
			  	    Integer width  = Integer.valueOf(meta.getOptions().getUserMetadata().get("width"));
			  	    Integer height = Integer.valueOf(meta.getOptions().getUserMetadata().get("height"));
			  	    String imgUrl = is.getServingUrl(ServingUrlOptions.Builder.withGoogleStorageFileName(filename));
			  	    if(width > height) {
			  	    	Double relation = (double) (width / height);
			  	    	Long new_width = Math.round(relation * 300);
			  	    	imgUrl = imgUrl + "=s" + new_width;
			  	    } else {
			  	        imgUrl = imgUrl + "=s300" ;
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

		configuration.UpdateDataFromAJAX(CanvasStateEdit);

		// Update Configuration section
		ConfigBookingProperties bookingProperties = JsonUtils.deserialize((String) userCanvasState.getProperty("bookingProperties"),ConfigBookingProperties.class);
		configuration.setBookingProperties(bookingProperties);
		Type  collectionType = new TypeToken<List<String>>(){}.getType();
		List<String> admins = JsonUtils.deserialize((String) userCanvasState.getProperty("adminList"),collectionType);;
		String Admin_username = (String)  userCanvasState.getProperty("Admin_username");
		String Admin_password =  (String)  userCanvasState.getProperty("Admin_password");
		configuration.getAdministration().setAdmins(admins);
		configuration.getAdministration().setAdminUsername(Admin_username);
		configuration.getAdministration().setAdminPassword(Admin_password);

  		request.setAttribute("configuration", configuration);
		RequestDispatcher dispathser  = request.getRequestDispatcher("/Place_Configuration.jsp");
		response.addHeader("Access-Control-Allow-Origin", "*");
		dispathser.forward(request, response);		
	}

}
