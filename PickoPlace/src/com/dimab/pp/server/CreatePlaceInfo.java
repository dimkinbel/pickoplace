package com.dimab.pp.server;

import java.io.IOException;
import java.util.Date;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.dimab.pp.functions.RandomStringGenerator;
import com.dimab.pp.login.CheckTokenValid;
import com.dimab.pp.login.GenericUser;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Transaction;
import com.google.appengine.api.datastore.TransactionOptions;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;


public class CreatePlaceInfo extends HttpServlet {
	private static final long serialVersionUID = 1L;
       

    public CreatePlaceInfo() {
        super();
        // TODO Auto-generated constructor stub
    }


	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		    
			DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
			TransactionOptions options = TransactionOptions.Builder.withXG(true);
			Transaction txn = datastore.beginTransaction(options);
			
			String username = new String();
			CheckTokenValid tokenValid = new CheckTokenValid(request);
			GenericUser genuser = tokenValid.getUser();
		if(genuser!=null) {
			username = genuser.getEmail();
			String placeName = request.getParameter("buisnessName");
			String placeBranchName = request.getParameter("branchName");
			String placeAddress = request.getParameter("buisnessAddress");
			String placeLat = request.getParameter("address_hidden_lat");
			String placeLng = request.getParameter("address_hidden_lng");
			String placePhone = request.getParameter("buisnessPhone");
			String placeFax = request.getParameter("buisnessFax");
			//Long time2000 = Long.valueOf(request.getParameter("timeat2000_hidden"));
			Double UTCoffcet = Double.valueOf(request.getParameter("UTCoffcet_hidden"));
			
			
			RandomStringGenerator randomGen = new RandomStringGenerator();
		    String Placerandom =  "PID_"+ randomGen.generateRandomString(12,RandomStringGenerator.Mode.ALPHANUMERIC);
			
			Filter UserExists = new  FilterPredicate("username",FilterOperator.EQUAL,username);
    		Query q = new Query("Users").setFilter(UserExists);
    		PreparedQuery pq = datastore.prepare(q);
    		Entity result = pq.asSingleEntity();
    		if (result != null) {
    			Key userKey = result.getKey();
    		    Entity userPlace = new Entity("UserPlace",userKey);
    		    String entityKey = KeyFactory.keyToString(userKey);
    		    userPlace.setProperty("userKey", entityKey);
    		    userPlace.setProperty("placeName", placeName);
    		    userPlace.setProperty("placeBranchName", placeBranchName);
    		    userPlace.setProperty("placeAddress", placeAddress);
    		    userPlace.setProperty("placeUniqID", Placerandom);
    		    //userPlace.setProperty("TimeAt2000", time2000);
    		    userPlace.setProperty("UTCoffcet",UTCoffcet);
    		    if (placeLat != null && !placeLat.isEmpty()) {
    		      userPlace.setProperty("placeLat", Double.parseDouble(placeLat));
    		      userPlace.setProperty("placeLng", Double.parseDouble(placeLng));
    		    } else {
      		      userPlace.setProperty("placeLat", null);
      		      userPlace.setProperty("placeLng", null);
    		    }
    		      userPlace.setProperty("placePhone", placePhone);
    		      userPlace.setProperty("placeFax", placeFax);
    		      
    		      Date date = new Date();
      			  result.setProperty("lastDateInSec", date.getTime()/1000);
      			  result.setProperty("lastDate",  date.toString());  
    		      datastore.put(userPlace);
    		      datastore.put(result);
    		  }
    		txn.commit();
    		
    		request.setAttribute("creatingFlow" , "true");
			request.setAttribute("placeName", placeName);
			request.setAttribute("placeBranchName", placeBranchName);
			request.setAttribute("placeAddress", placeAddress);
			request.setAttribute("placeUniqID", Placerandom);
			
			
			if (placeLat != null && !placeLat.isEmpty()) {
			  request.setAttribute("placeLat", Double.parseDouble(placeLat));
			  request.setAttribute("placeLng", Double.parseDouble(placeLng));	
			}
			RequestDispatcher dispathser  = request.getRequestDispatcher("/drawing.jsp");
			dispathser.forward(request, response);
    			
    	} else {
    		String returnurl = "http://pickoplace.com/welcome.jsp";
			response.sendRedirect(returnurl);
    	}
	}
}


