package com.dimab.pp.account;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.List;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


import com.dimab.pickoplace.utils.JsonUtils;
import com.dimab.pp.dto.PPSubmitObject;
import com.dimab.pp.dto.UserAccountData;
import com.dimab.pp.dto.UserPlace;
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
import com.google.appengine.api.images.ImagesService;
import com.google.appengine.api.images.ImagesServiceFactory;
import com.google.appengine.api.images.ServingUrlOptions;
import com.google.appengine.tools.cloudstorage.GcsFilename; 
import com.google.gson.reflect.TypeToken;


public class GoToAccont extends HttpServlet {
	private static final long serialVersionUID = 1L;

    public GoToAccont() {
        super();
    }
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

		String username = new String();
		CheckTokenValid tokenValid = new CheckTokenValid(request);
		GenericUser genuser = tokenValid.getUser();
		if(genuser!=null) {
			username = genuser.getEmail();
			System.out.println("GENERIC USER-EMAIL:"+username);
			UserAccountData accountObjectToJSP = new UserAccountData();
			Filter usernameFilter = new  FilterPredicate("username",FilterOperator.EQUAL,username);
			Query q = new Query("CanvasState").setFilter(usernameFilter);
			PreparedQuery pq = datastore.prepare(q);

			for (Entity userCanvasState : pq.asIterable()) {
				String userRnd = (String) userCanvasState.getProperty("usernameRandom");
				String placeName = (String) userCanvasState.getProperty("placeName");
				String placeBranchName = (String) userCanvasState.getProperty("placeBranchName");
				String placeID = (String) userCanvasState.getProperty("placeUniqID");
				String mainFloorID = (String) userCanvasState.getProperty("mainFloorID");
				String Address = (String) userCanvasState.getProperty("address");
				String Lat = (String) userCanvasState.getProperty("lat");
				String Lng = (String) userCanvasState.getProperty("lng");
				// Create place object to pass to JSP
				UserPlace userPlace = new UserPlace();

				//----------------------------------------------------------------

				// Get serving Overview URL;
				String fileName_ = userRnd +"/"+   placeID+"/"+"main"+"/"+mainFloorID +"/overview.png";


				String bucket = "pp_images";
				GcsFilename gcsFilename = new GcsFilename(bucket, fileName_);
				ImagesService is = ImagesServiceFactory.getImagesService();
				String filename = String.format("/gs/%s/%s", gcsFilename.getBucketName(), gcsFilename.getObjectName());
				System.out.println(filename);
				String servingUrl = is.getServingUrl(ServingUrlOptions.Builder.withGoogleStorageFileName(filename));
				servingUrl = servingUrl + "=s190";
				userPlace.setOverviewCloudURL(servingUrl);
				userPlace.setAddress(Address);
				userPlace.setLat(Double.parseDouble(Lat));
				userPlace.setLng(Double.parseDouble(Lng));
				userPlace.setPlace(placeName);
				userPlace.setBranch(placeBranchName);
				userPlace.setPlaceID(placeID);
				// Get shapesJSON to count Shapes
				String shapesJSON =  ((Text) userCanvasState.getProperty("shapesJSON")).getValue();
				Type CanvasListcollectionType = new TypeToken<List<PPSubmitObject>>(){}.getType();
				List<PPSubmitObject> floors = JsonUtils.deserialize(shapesJSON, CanvasListcollectionType);
				int shapesCount = 0;
				for (PPSubmitObject floor : floors) {
					shapesCount += floor.getShapes().size();
				}
				userPlace.setShapesCount(shapesCount);
				userPlace.setFloors(floors.size());
				accountObjectToJSP.getPlaces().add(userPlace);

			}
			request.setAttribute("userPlaces", accountObjectToJSP);
			RequestDispatcher dispathser  = request.getRequestDispatcher("user_account.jsp");
			dispathser.forward(request, response);
		} else {
			String returnurl = "/welcome.jsp";
			response.addHeader("Access-Control-Allow-Origin", "*");
			response.sendRedirect(returnurl);
		}
	}
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

	}

}
