package com.dimab.pp.server;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.dimab.pickoplace.utils.JsonUtils;
import com.dimab.pp.functions.RandomStringGenerator;
import com.google.appengine.api.datastore.*;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;



public class UserLoginLogout extends HttpServlet {
	private static final long serialVersionUID = 1L;
    
    /**
     * @see HttpServlet#HttpServlet()
     */
    public UserLoginLogout() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        UserService userService = UserServiceFactory.getUserService();
        HttpSession session = req.getSession();
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		TransactionOptions options = TransactionOptions.Builder.withXG(true);
		Transaction txn = datastore.beginTransaction(options); 
        String returnurl = (String) session.getAttribute("urlreturn");
        
        System.out.println(returnurl);
        resp.setContentType("text/html");
        if (req.getUserPrincipal() != null) {
            System.out.println("User Login:"+req.getUserPrincipal().getName());
            String userGMail = req.getUserPrincipal().getName();
  
            Filter UserExists = new  FilterPredicate("username",FilterOperator.EQUAL,userGMail);
    		Query q = new Query("Users").setFilter(UserExists);
    		PreparedQuery pq = datastore.prepare(q);
    		Entity result = pq.asSingleEntity();
    		if (result == null) {
    			     // First Username login
    			Date date = new Date();
    			Entity userEntity = new Entity("Users");
    			RandomStringGenerator randomGen = new RandomStringGenerator();
    		    String random =  randomGen.generateRandomString(10,RandomStringGenerator.Mode.ALPHANUMERIC);
    			userEntity.setProperty("username", userGMail);
    			userEntity.setProperty("LoggedBy","Google");
    			userEntity.setProperty("UserID", random);
    			userEntity.setUnindexedProperty("firstEntry", date.toString());
    			userEntity.setUnindexedProperty("lastDateInSec", date.getTime()/1000);
    			userEntity.setUnindexedProperty("lastDate",  date.toString());
    			
                List<String> pids = new ArrayList<String>();
    			userEntity.setUnindexedProperty("PID_full_access", new Text(JsonUtils.serialize(pids)));
    			userEntity.setUnindexedProperty("PID_book_admin", new Text(JsonUtils.serialize(pids)));
    			datastore.put(userEntity);
    		} else {
    			// User Not first login
    			Date date = new Date();
    			result.setProperty("LoggedBy","Google");
    			result.setUnindexedProperty("firstEntry", date.toString());
    			result.setUnindexedProperty("lastDateInSec", date.getTime()/1000);
    			result.setUnindexedProperty("lastDate",  date.toString());  
    			datastore.put(result);
    		}
    		        
        } else {
        	String userEmailsession = (String) session.getAttribute("userEmail");
            System.out.println("User Logout:"+ userEmailsession);
            Filter UserExists = new  FilterPredicate("username",FilterOperator.EQUAL,userEmailsession);
    		Query q = new Query("Users").setFilter(UserExists);
    		PreparedQuery pq = datastore.prepare(q);
    		Entity result = pq.asSingleEntity();
    		if (result != null) {
    			Date date = new Date();
    			result.setUnindexedProperty("lastDateInSec", date.getTime()/1000);
    			result.setUnindexedProperty("lastDate",  date.toString());   
    			datastore.put(result);
    		} 
    		returnurl = "/welcome.jsp";
    		resp.addHeader("Access-Control-Allow-Origin", "*");
        }	
        txn.commit();
        resp.sendRedirect(returnurl);	
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

}
