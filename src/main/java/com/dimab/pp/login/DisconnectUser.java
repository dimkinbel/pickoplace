package com.dimab.pp.login;

import com.dimab.pickoplace.entity.EntityKind;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.appengine.api.datastore.*;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

//import org.apache.log4j.BasicConfigurator;

public class DisconnectUser extends HttpServlet {
	private static final long serialVersionUID = 1L;
	  private static final HttpTransport TRANSPORT = new NetHttpTransport();

	  /*
	   * Default JSON factory to use to deserialize JSON.
	   */
	  private static final JacksonFactory JSON_FACTORY = new JacksonFactory();

	  /*
	   * Gson object to serialize JSON responses to requests to this servlet.
	   */
	  private static final Gson GSON = new Gson();

	  /*
	   * Creates a client secrets object from the client_secrets.json file.
	   */
	  private static GoogleClientSecrets clientSecrets;

	  static {
	    try {
	      Reader reader = new FileReader("admin/client_secrets.json");
	      clientSecrets = GoogleClientSecrets.load(JSON_FACTORY, reader);
	    } catch (IOException e) {
	      throw new Error("No client_secrets.json found", e);
	    }
	  }

	  /*
	   * This is the Client ID that you generated in the API Console.
	   */
	  private static final String CLIENT_ID = clientSecrets.getWeb().getClientId();

	  /*
	   * This is the Client Secret that you generated in the API Console.
	   */
	  private static final String CLIENT_SECRET = clientSecrets.getWeb().getClientSecret();

	  /*
	   * Optionally replace this with your application's name.
	   */
	  private static final String APPLICATION_NAME = "PickoPlace";
    
    public DisconnectUser() {
        super();
        // TODO Auto-generated constructor stub
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response)  throws ServletException, IOException {
          response.setContentType("application/json");
          Map <String , Object> map = new HashMap<String , Object>();
          
          String accessToken = request.getParameter("access_token");
          String provider = request.getParameter("provider");

          
          DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
  		  TransactionOptions options = TransactionOptions.Builder.withXG(true);
  		  Transaction txn = datastore.beginTransaction(options);


 		  HttpServletRequest req_ = (HttpServletRequest) request;
 		  HttpSession session = req_.getSession();
 		  String Sprovider = (String) session.getAttribute("provider");
 		  String Stoken = (String) session.getAttribute("access_token");
 		
 	    if(provider.equals("google")) {        
			System.out.println("Disonnecting GOOGLE token:"+Stoken);
		    RevokeGoogleToken googleRevokeFactory = new RevokeGoogleToken();
		    googleRevokeFactory.revoke(accessToken);

        } else {
        	
        }

    	String userEmailsession = (String) session.getAttribute("userEmail");
    	
    	if(userEmailsession != null) {
	        System.out.println("User Logout:"+ userEmailsession);
	        Filter UserExists = new  FilterPredicate("username",FilterOperator.EQUAL,userEmailsession);
			Query q = new Query(EntityKind.Users).setFilter(UserExists);
			PreparedQuery pq = datastore.prepare(q);
			Entity result = pq.asSingleEntity();
			if (result != null) {
				Date date = new Date();
				result.setUnindexedProperty("lastDateInSec", date.getTime()/1000);
				result.setUnindexedProperty("lastDate",  date.toString());   
				datastore.put(result);
			} 
	 	    
	 	    txn.commit();
	  	    map.put("disconnected",true);
	 	    map.put("user",userEmailsession);
    	} else {
    	    map.put("disconnected",false);
    	 	map.put("reason","no_session_user");
    	}

 	   
 	    request.getSession().removeAttribute("access_token");
   	    request.getSession().removeAttribute("provider");
   	    
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(new Gson().toJson(map));
	      
    }
}
