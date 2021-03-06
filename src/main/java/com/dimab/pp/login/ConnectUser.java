package com.dimab.pp.login;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.dimab.pickoplace.utils.JsonUtils;
import com.dimab.pp.functions.RandomStringGenerator;
import com.dimab.pp.login.dto.FBmeResponseJSON;
import com.dimab.pp.login.dto.GOOGmeResponseJSON;
import com.dimab.pp.login.dto.PPuser;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeTokenRequest;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.appengine.api.datastore.*;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;

//import org.apache.log4j.BasicConfigurator;







import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.FileReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class ConnectUser extends HttpServlet {
	private static final long serialVersionUID = 1L;
	  private static final HttpTransport TRANSPORT = new NetHttpTransport();

	  /*
	   * Default JSON factory to use to deserialize JSON.
	   */
	  private static final JacksonFactory JSON_FACTORY = new JacksonFactory();



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
      
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ConnectUser() {
        super();
        // TODO Auto-generated constructor stub
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
         response.setContentType("application/json");
         Map <String , Object> map = new HashMap<String , Object>();
         map.put("phone",true);
         String accessToken = request.getParameter("access_token");
         String provider = request.getParameter("provider");
         String gcode = request.getParameter("code");
		 String ppmail = request.getParameter("email");
		 String pppassword =  request.getParameter("password");
         System.out.println("CONNECT USER: ");
         System.out.println("    provider: "+provider);
         System.out.println("    accessToken: "+accessToken);
         System.out.println("    code: "+gcode);
		 System.out.println("    ppmail: "+ppmail);
		 System.out.println("    pppassword: "+pppassword);

        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
 		TransactionOptions options = TransactionOptions.Builder.withXG(true);
 		Transaction txn = datastore.beginTransaction(options);
 		 

		HttpServletRequest req_ = (HttpServletRequest) request;
		HttpSession session = req_.getSession();
		String Sprovider = (String) session.getAttribute("provider");
		String Stoken = (String) session.getAttribute("access_token");
		if(provider.equals("ppuser")) {

			if(accessToken == null || accessToken.isEmpty()) {
				// PPuser Log in
				PPuser ppuser = new PPuser();
				ppuser.setEmail(ppmail);
				ppuser.setPassword(pppassword);
				PPuserLogin ppuserFactory = new PPuserLogin();
				ppuser = ppuserFactory.login(datastore,txn,request,ppuser);
				if(ppuser.getValid()) {
					map.put("valid", true);
					map.put("provider", "ppuser");
					map.put("ppuser", JsonUtils.serialize(ppuser));
				} else {
					map.put("valid", false);
					map.put("reason", "WRONG_CREDENTIALS");
				}
			} else {
				// PPuser verify access_token
				PPuserLogin ppuserFactory = new PPuserLogin(accessToken);

				if(ppuserFactory.getPpuser().getValid()) {
					map.put("valid", true);
					map.put("provider", "ppuser");
					map.put("ppuser", JsonUtils.serialize(ppuserFactory.getPpuser()));
				} else {
					map.put("valid", false);
					map.put("reason", "NOT_VALID_TOKEN");
				}

			}
		} else if(provider.equals("google")) {
			System.out.println(CLIENT_ID);
			System.out.println(CLIENT_SECRET);

	        GoogleTokenResponse tokenResponse =
	                new GoogleAuthorizationCodeTokenRequest(TRANSPORT, JSON_FACTORY,
	                    CLIENT_ID, CLIENT_SECRET, gcode, "postmessage").execute();
	        accessToken =  tokenResponse.getAccessToken();
            String refreshToken = tokenResponse.getRefreshToken();

	        System.out.println("GOOGLE ACCESS-TOKEN:" +accessToken);
			System.out.println("GOOGLE REFRESH-TOKEN:"+tokenResponse.getRefreshToken());
	    	
	    	GoogVerifyToken tokenVerifier = new GoogVerifyToken(accessToken,refreshToken);
			 if(tokenVerifier.isValid()) {
				 request.getSession().setAttribute("provider", provider);
				 request.getSession().setAttribute("access_token", accessToken);
				 request.getSession().setAttribute("userEmail", tokenVerifier.getData().getEmail());
				 if(refreshToken != null && !refreshToken.isEmpty()) {
					 request.getSession().setAttribute("googleRefreshToken", refreshToken);
				 }
				 
				 GOOGmeResponseJSON userData = tokenVerifier.getData();
				 
			  
			    Filter UserExists = new  FilterPredicate("username",FilterOperator.EQUAL,userData.getEmail());
			    Query q = new Query("Users").setFilter(UserExists);
			    PreparedQuery pq = datastore.prepare(q);
			    Entity result = pq.asSingleEntity();
			    if (result == null) {
			    	     // First Username login
			    	Date date = new Date();
			    	Entity userEntity = new Entity("Users");
			    	RandomStringGenerator randomGen = new RandomStringGenerator();
			        String random =  randomGen.generateRandomString(10,RandomStringGenerator.Mode.ALPHANUMERIC);
			    	userEntity.setProperty("username", userData.getEmail());
			    	userEntity.setProperty("LoggedBy","Google");
			    	userEntity.setProperty("UserID", random);
			    	userEntity.setProperty("emailsend", true);
					if(refreshToken != null && !refreshToken.isEmpty()) {
						userEntity.setUnindexedProperty("googleRefreshToken", refreshToken);
					}

			    	userEntity.setUnindexedProperty("firstEntry", date.toString());
			    	userEntity.setUnindexedProperty("lastDateInSec", date.getTime()/1000);
			    	userEntity.setUnindexedProperty("lastDate",  date.toString());
			    	
			        List<String> pids = new ArrayList<String>();
			    	userEntity.setUnindexedProperty("PID_full_access",new Text( JsonUtils.serialize(pids)));
			    	userEntity.setUnindexedProperty("PID_book_admin",new Text( JsonUtils.serialize(pids)));
			    	userEntity.setUnindexedProperty("phone", "");
			    	map.put("phone",false);
			    	datastore.put(userEntity);
			    } else {
			    	// User Not first login
			    	Date date = new Date();
			    	result.setProperty("LoggedBy","Google");
			    	result.setUnindexedProperty("lastDateInSec", date.getTime()/1000);
			    	result.setUnindexedProperty("lastDate",  date.toString());
					if(refreshToken != null && !refreshToken.isEmpty()) {
						result.setUnindexedProperty("googleRefreshToken", refreshToken);
					} else {
						// Check old refresh token exists
						if(result.getProperty("googleRefreshToken")!= null) {
							refreshToken = (String)result.getProperty("googleRefreshToken");
							request.getSession().setAttribute("googleRefreshToken", refreshToken);
						}
					}
			    	if(result.getProperty("emailsend")==null) {
			    		result.setProperty("emailsend", true);
			    	}

					map = isDatabasePhoneValid(map,result,request);
			    	datastore.put(result);
			    }
				 txn.commit();

				 map.put("valid",true);
				 map.put("provider", "GOOG");
				 map.put("userData", userData);
			 } else {
				 map.put("valid",false);
			 }	    	
	    } else {
	    	// FACEBOOK
			 FBVerifyToken tokenFactory = new FBVerifyToken(accessToken);
			 request.getSession().setAttribute("access_token", tokenFactory.getLongLiveToken());
		     request.getSession().setAttribute("provider", provider);

             if(!tokenFactory.getLongLiveToken().isEmpty()) {

				 if (Sprovider != null && Sprovider.equals("google") && Stoken != null) {
					 System.out.println("Disonnecting GOOGLE token:" + Stoken);
					 RevokeGoogleToken googleRevokeFactory = new RevokeGoogleToken();
					 googleRevokeFactory.revoke(Stoken);
				 }

				 FBmeResponseJSON userData = tokenFactory.getData(tokenFactory.getLongLiveToken());
				 request.getSession().setAttribute("userEmail", userData.getEmail());

				 Filter UserExists = new FilterPredicate("username", FilterOperator.EQUAL, userData.getEmail());
				 Query q = new Query("Users").setFilter(UserExists);
				 PreparedQuery pq = datastore.prepare(q);
				 Entity result = pq.asSingleEntity();
				 if (result == null) {
					 // First Username login
					 Date date = new Date();
					 Entity userEntity = new Entity("Users");
					 RandomStringGenerator randomGen = new RandomStringGenerator();
					 String random = randomGen.generateRandomString(10, RandomStringGenerator.Mode.ALPHANUMERIC);
					 userEntity.setProperty("username", userData.getEmail());
					 userEntity.setProperty("LoggedBy", "Facebook");
					 userEntity.setProperty("UserID", random);
					 userEntity.setProperty("emailsend", true);
					 userEntity.setUnindexedProperty("firstEntry", date.toString());
					 userEntity.setUnindexedProperty("lastDateInSec", date.getTime() / 1000);
					 userEntity.setUnindexedProperty("lastDate", date.toString());
					 userEntity.setUnindexedProperty("phone", "");
					 map.put("phone", false);

					 datastore.put(userEntity);
				 } else {
					 // User Not first login
					 Date date = new Date();

					 result.setProperty("LoggedBy", "Facebook");
					 result.setUnindexedProperty("lastDateInSec", date.getTime() / 1000);
					 result.setUnindexedProperty("lastDate", date.toString());

					 if (result.getProperty("emailsend") == null) {
						 result.setProperty("emailsend", true);
					 }
					 map = isDatabasePhoneValid(map,result,request);

					 datastore.put(result);
				 }
				 txn.commit();
				 map.put("valid", true);
				 map.put("provider", "FB");
				 map.put("userData", userData);
			 } else {
				 map.put("valid", false);
			 }

	    }
		  


	   
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(JsonUtils.serialize(map));
	      

/*      ByteArrayOutputStream resultStream = new ByteArrayOutputStream();
      getContent(request.getInputStream(), resultStream);
      String code = new String(resultStream.toByteArray(), "UTF-8");

      try {
        // Upgrade the authorization code into an access and refresh token.
        GoogleTokenResponse tokenResponse =
            new GoogleAuthorizationCodeTokenRequest(TRANSPORT, JSON_FACTORY,
                CLIENT_ID, CLIENT_SECRET, code, "postmessage").execute();
      //  tokenResponse.getAccessToken();
        // You can read the Google user ID in the ID token.
        // This sample does not use the user ID.
        GoogleIdToken idToken = tokenResponse.parseIdToken();
        String gplusId = idToken.getPayload().getSubject();

        // Store the token in the session for later use.
        request.getSession().setAttribute("token", tokenResponse.toString());
        System.out.println("CONNECT TOKEN:"+ tokenResponse.toString());
        response.setStatus(HttpServletResponse.SC_OK);
        response.getWriter().print(GSON.toJson("Successfully connected user."));
      } catch (TokenResponseException e) {
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        response.getWriter().print(GSON.toJson("Failed to upgrade the authorization code."));
      } catch (IOException e) {
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        response.getWriter().print(GSON.toJson("Failed to read token data from Google. " +
            e.getMessage()));
      }
      */
    }
    /*
     * Read the content of an InputStream.
     *
     * @param inputStream the InputStream to be read.
     * @return the content of the InputStream as a ByteArrayOutputStream.
     * @throws IOException
     */
    static void getContent(InputStream inputStream, ByteArrayOutputStream outputStream)
        throws IOException {
      // Read the response into a buffered stream
      BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
      int readChar;
      while ((readChar = reader.read()) != -1) {
        outputStream.write(readChar);
      }
      reader.close();
    }
	public  Map<String,Object> isDatabasePhoneValid ( Map<String , Object> map_ , Entity userEntity , HttpServletRequest request) {
		Map<String , Object> map = map_;
		if (userEntity.getProperty("phone") != null) {
			String phone = (String) userEntity.getProperty("phone");
			if (phone.isEmpty()) {
				map.put("phone", false);
			} else {
				if (userEntity.getProperty("phoneValid") != null) {
					Boolean phoneVerified = (boolean) userEntity.getProperty("phoneValid");
					if (!phoneVerified) {
						map.put("phone", false);
					} else {
						request.getSession().setAttribute("phone", phone);
						System.out.println(phone);
					}
				} else {
					map.put("phone", false);
				}
			}
		} else {
			userEntity.setUnindexedProperty("phone", "");
			map.put("phone", false);
		}
		return map;
	}
  }
