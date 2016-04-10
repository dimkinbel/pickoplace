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
import com.dimab.pp.dto.AdminUser;
import com.dimab.pp.dto.UserPlace;
import com.dimab.pp.login.CheckTokenValid;
import com.dimab.pp.login.dto.GenericUser;
import com.dimab.pp.search.SearchFabric;
import com.google.appengine.api.datastore.*;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.appengine.tools.cloudstorage.GcsFilename;
import com.google.appengine.tools.cloudstorage.GcsService;
import com.google.appengine.tools.cloudstorage.GcsServiceFactory;
import com.google.appengine.tools.cloudstorage.ListItem;
import com.google.appengine.tools.cloudstorage.ListOptions;
import com.google.appengine.tools.cloudstorage.ListResult;
import com.google.appengine.tools.cloudstorage.RetryParams;
import com.google.gson.reflect.TypeToken;

public class DeletePlaceData extends HttpServlet {
	private static final long serialVersionUID = 1L;

    public DeletePlaceData() {
        super();
        // TODO Auto-generated constructor stub
    }

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		TransactionOptions options = TransactionOptions.Builder.withXG(true);
		Transaction txn = datastore.beginTransaction(options);
		Map <String , String> map = new HashMap<String , String>();
		map.put("removed", "incomplete");
		
		Date date = new Date();
		
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
			return;
		} else {
			username_email = genuser.getEmail();
 
			String placeID = request.getParameter("placeid");
			System.out.println(placeID);
			Filter pidFilter = new  FilterPredicate("placeUniqID",FilterOperator.EQUAL,placeID);
			Query sq_ = new Query("CanvasState").setFilter(pidFilter);
			PreparedQuery psq_ = datastore.prepare(sq_);
	  		Entity canvasEntity = psq_.asSingleEntity();
	  		String canvasAdmin = (String)canvasEntity.getProperty("username");
	  		String address = (String)canvasEntity.getProperty("address");
	  		String placeEditList_str = (String) canvasEntity.getProperty("placeEditList");
	  		String placeName = (String) canvasEntity.getProperty("placeName");
	  		String branchName = (String) canvasEntity.getProperty("placeBranchName");
	  		String adminID =  (String) canvasEntity.getProperty("usernameRandom");
	  		
 
	  		
	  		Type placeEditType = new TypeToken<List<AdminUser>>(){}.getType();
	  		List<AdminUser> placeEditList  = JsonUtils.deserialize(placeEditList_str, placeEditType);
	  		boolean RemovalAllowedbyUser = false;
	  		if(!username_email.equals(canvasAdmin)) {
	  			System.out.println("Requested user '"+username_email+"' is different from ADMIN user '"+canvasAdmin+"'");
	  			for (AdminUser adminObj : placeEditList) {
	  				if(adminObj.getMail().equals(username_email)) {
	  					if(adminObj.isFull_access() ) {
	  						RemovalAllowedbyUser = true;
	  					}
	  				}
	  			}
	  			// In all other cases Removal is not allowed by User requested
	  		} else {
	  			 RemovalAllowedbyUser = true;
	  		}
	  		if(RemovalAllowedbyUser) {
	  			// Remove from User lists
	  			for (AdminUser adminObj : placeEditList) {
	  				Filter UserExists = new  FilterPredicate("username",FilterOperator.EQUAL,adminObj.getMail());
	  				Query q = new Query("Users").setFilter(UserExists);
	  				PreparedQuery pq = datastore.prepare(q);
	  				Entity result = pq.asSingleEntity();
	  				if (result != null) { 
	  					Type collectionType = new TypeToken<List<String>>(){}.getType();
	  					List<String> fa_list = new ArrayList<String>();
	  					List<String> ep_list = new ArrayList<String>();
	  					List<String> mo_list = new ArrayList<String>();
	  					List<String> ba_list = new ArrayList<String>();
	  					if(result.getProperty("PID_full_access")!=null) {
	  						fa_list = JsonUtils.deserialize(((Text)result.getProperty("PID_full_access")).getValue(),collectionType);
	  						if(fa_list.contains(placeID)) {
		  						fa_list.remove(placeID);
		  						result.setUnindexedProperty("PID_full_access",new Text(JsonUtils.serialize(fa_list)));
		  					}
	  					} 
	  					if(result.getProperty("PID_edit_place")!=null) {
	  						ep_list = JsonUtils.deserialize(((Text)result.getProperty("PID_edit_place")).getValue(),collectionType);
	  						if(ep_list.contains(placeID)) {
		  						ep_list.remove(placeID);
		  						result.setUnindexedProperty("PID_edit_place",new Text(JsonUtils.serialize(ep_list)));
		  					}
	  					}
	  					if(result.getProperty("PID_move_only")!=null) {
	  						mo_list = JsonUtils.deserialize(((Text)result.getProperty("PID_move_only")).getValue(),collectionType);
	  						if(mo_list.contains(placeID)) {
		  						mo_list.remove(placeID);
		  						result.setUnindexedProperty("PID_move_only",new Text(JsonUtils.serialize(mo_list)));
		  					}
	  					}
	  					if(result.getProperty("PID_book_admin")!=null) {
	  						ba_list = JsonUtils.deserialize(((Text)result.getProperty("PID_book_admin")).getValue(),collectionType);
	  						if(ba_list.contains(placeID)) {
		  						ba_list.remove(placeID);
		  						result.setUnindexedProperty("PID_book_admin",new Text(JsonUtils.serialize(ba_list)));
		  					}
	  					}
 
	  					datastore.put(result);
	  				}
	  				
	  			}
	  			// Removing cloud files
	  			GcsService gcsService = GcsServiceFactory.createGcsService(RetryParams.getDefaultInstance());
	  			ListOptions.Builder b = new ListOptions.Builder();
	  			b.setRecursive(true);
	  			b.setPrefix(adminID+"/"+placeID);
	  			ListResult result = gcsService.list("pp_images", b.build());
	  			while (result.hasNext()){
	  			    ListItem l = result.next();
	  			    String name = l.getName();
	  			    System.out.println("Removing next Cloud files: " + name);
	  			    GcsFilename oname = new GcsFilename("pp_images", name);
	    			gcsService.delete(oname);
	  			}
	  			// Remove FreePlace JSON
 
		  		 String bucketName = "pp_free_place_json";
		  		 UserPlace userPlace = new UserPlace();
		  		 userPlace.setPlace(placeName);
		  		 userPlace.setBranch(branchName);
		  		 userPlace.setAddress(address);
		 	     String placeNameChar = userPlace.getPlaceNameClean();
		 	     String placeBranchChar = userPlace.getBranchClean();
		 	     String addrChar = userPlace.getAddressClean();
		 	     String fileName =  placeID+"/"+"json_free_map.json";
		 	     System.out.println("JSONDELETE:"+fileName);
		 	     GcsFilename oname = new GcsFilename(bucketName, fileName);
    			 gcsService.delete(oname);
 
	  			//Removing "UserPlace" entity
				Query upsq = new Query("UserPlace").setFilter(pidFilter);
				PreparedQuery upspq = datastore.prepare(upsq);
		  		Entity userPlaceEntity = upspq.asSingleEntity();
		  		Key userPlaceKey = userPlaceEntity.getKey();
		  		if(userPlaceEntity!=null) {			  		
			  		System.out.println("Removing 'UserPlace' entity:"+userPlaceKey.toString());
	                datastore.delete(userPlaceEntity.getKey());
		  		}
                
	  			//Removing "Shapes" Datastore entity
	  			Query shapesQuery = new Query("Shapes").setAncestor(userPlaceKey);  
	  			PreparedQuery pq = datastore.prepare(shapesQuery);
	  			for (Entity shapeEntity : pq.asIterable()) {
	  				System.out.println("Removing 'Shapes' entity:"+shapeEntity.getKey().toString());
	  				datastore.delete(shapeEntity.getKey());
	  			}
	  			
	  		   //Removing "ShapeOrdersList" entity
	  			pidFilter = new  FilterPredicate("pid",FilterOperator.EQUAL,placeID);
				Query sosq = new Query("ShapeOrdersList").setFilter(pidFilter);
				PreparedQuery sopq = datastore.prepare(sosq);
	  			for (Entity shapeOrderEntity : sopq.asIterable()) {
	  				System.out.println("Removing 'ShapeOrdersList' entity:"+shapeOrderEntity.getKey().toString());
	  				datastore.delete(shapeOrderEntity.getKey());
	  			}

	  			
 	  		   //Removing "BookingOrders" entity
                pidFilter = new  FilterPredicate("pid",FilterOperator.EQUAL,placeID);
 				sosq = new Query("BookingOrders").setFilter(pidFilter);
 				sopq = datastore.prepare(sosq);
 	  			for (Entity BookingOrdersEntity : sopq.asIterable()) {
 	  				System.out.println("Removing 'BookingOrders' entity:"+BookingOrdersEntity.getKey().toString());
 	  				datastore.delete(BookingOrdersEntity.getKey());
 	  			}	
 	  			//Removing "CanvasState" entity
 	  			System.out.println("Removing 'CanvasState' entity:"+canvasEntity.getKey().toString());
 	  			datastore.delete(canvasEntity.getKey());
 	  			map.put("removed", "removed");
 	  			
  	  		   //Removing "IFrames" entity
                pidFilter = new  FilterPredicate("pid",FilterOperator.EQUAL,placeID);
 				sosq = new Query("IFrames").setFilter(pidFilter);
 				sopq = datastore.prepare(sosq);
 	  			for (Entity BookingOrdersEntity : sopq.asIterable()) {
 	  				System.out.println("Removing 'BookingOrders' entity:"+BookingOrdersEntity.getKey().toString());
 	  				datastore.delete(BookingOrdersEntity.getKey());
 	  			}	
 	  			
 	  			SearchFabric searchIndexFabrix = new SearchFabric();
   	            searchIndexFabrix.deletePlaceDocument(placeID);
	  		} else {
	  			map.put("removed", "not_allowed");
	  		}	  		
		} 
		txn.commit();
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(JsonUtils.serialize(map));
	}

}
