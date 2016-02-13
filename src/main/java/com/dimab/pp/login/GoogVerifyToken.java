package com.dimab.pp.login;
 
import java.io.FileReader;
import java.io.IOException; 
import java.io.Reader;



import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URL;

import com.dimab.pickoplace.utils.JsonUtils;
import com.google.api.client.auth.oauth2.TokenResponseException;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeTokenRequest;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.oauth2.Oauth2;
import com.google.api.services.oauth2.model.Tokeninfo;
import com.google.appengine.api.urlfetch.HTTPHeader;
import com.google.appengine.api.urlfetch.HTTPMethod;
import com.google.appengine.api.urlfetch.HTTPRequest;
import com.google.appengine.api.urlfetch.HTTPResponse;
import com.google.appengine.api.urlfetch.URLFetchServiceFactory;
 

public class GoogVerifyToken {
	private static final HttpTransport TRANSPORT = new NetHttpTransport();   
	private static final JacksonFactory JSON_FACTORY = new JacksonFactory();
	private static GoogleClientSecrets clientSecrets;


    HTTPRequest req_;
    HTTPResponse resp_ ;
   


	  static {
		    try {
		      Reader reader = new FileReader("admin/client_secrets.json");
		      clientSecrets = GoogleClientSecrets.load(JSON_FACTORY, reader);
		    } catch (IOException e) {
		      throw new Error("No client_secrets.json found", e);
		    }
		  }	
		  
	private static final String CLIENT_ID = clientSecrets.getWeb().getClientId();
	private static final String CLIENT_SECRET = clientSecrets.getWeb().getClientSecret();
	private static final String APPLICATION_NAME = "PickoPlace";
	
	public GoogVerifyToken(String token) {
		super();
	    String json ="{}"; 
	    URL url;
		try {
			url = new URL("https://www.googleapis.com/oauth2/v1/userinfo?access_token="+token);
		    req_ = new HTTPRequest(url, HTTPMethod.GET);
		    req_.addHeader(new HTTPHeader("Content-Type","application/json")); 
		 // req_.addHeader(new HTTPHeader("Authorization", "key=AIzaSyDVl5KlOhHdxlat0OOn0cNZ7k9Y_AVyM3g"));
		    req_.setPayload(json.getBytes("UTF-8"));
		    resp_ = URLFetchServiceFactory.getURLFetchService().fetch(req_);
		} catch (MalformedURLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			resp_ = null;
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			resp_ = null;
		}

	}
	public boolean isValid()  { 
		 if(resp_.getResponseCode()==200) {
			 return true;
		 } else {
			 return false;
		 }
		
	}
	
	public GOOGmeResponseJSON getData() {
		GOOGmeResponseJSON gojson = new GOOGmeResponseJSON();
		
	    if(resp_!=null && this.isValid()) {
		    String responseString;
			try {
				responseString = new String(resp_.getContent(),"UTF-8");
				gojson = JsonUtils.deserialize(responseString, GOOGmeResponseJSON.class);
				return gojson;
			} catch (UnsupportedEncodingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				return null;
			}
	    } else {
	    	return null;
	    }

	}

	
	 public boolean isTokenValidByCode(String code) {
		 try {
			GoogleTokenResponse tokenResponse =
			            new GoogleAuthorizationCodeTokenRequest(TRANSPORT, JSON_FACTORY,
			                CLIENT_ID, CLIENT_SECRET, code, "postmessage").execute();
			String accessToken = tokenResponse.getAccessToken();
			return isTokenValid(accessToken) ;
		} catch (TokenResponseException e) {
	        System.out.println("ERROR-isTokenValidByCode: Failed to upgrade the authorization code.");
	        return false;
	      } catch (IOException e) {
	        System.out.println("ERROR-isTokenValidByCode: to read token data from Google.");
	        return false;
	      }		 
	 }
	public boolean isTokenValid(String accessToken) {
		 try {
		GoogleCredential credential = new GoogleCredential().setAccessToken(accessToken);
		Oauth2 oauth2 = new Oauth2.Builder(
                TRANSPORT, JSON_FACTORY, credential).build();
            Tokeninfo tokenInfo = oauth2.tokeninfo()
                .setAccessToken(accessToken).execute();
		       if (!tokenInfo.getIssuedTo().equals(CLIENT_ID)) {
		                System.out.println("ERROR-isTokenValid: Access Token not meant for this app.");
		                return false;
		       } else {
		                System.out.println("isTokenValid: Access Token is valid.");
		                return true;
		      }
		 } catch (TokenResponseException e) {
		        System.out.println("ERROR-isTokenValid: Failed to upgrade the authorization code.");
		        return false;
		      } catch (IOException e) {
		        System.out.println("ERROR-isTokenValid:Failed to read token data from Google.");
		        return false;
		      }	
	}
	
	public Tokeninfo getTokenByCode(String code) {
		System.out.println(code);
		 try {
			GoogleTokenResponse tokenResponse =
			            new GoogleAuthorizationCodeTokenRequest(TRANSPORT, JSON_FACTORY,
			                CLIENT_ID, CLIENT_SECRET, code, "postmessage").execute();
			String accessToken = tokenResponse.getAccessToken();
			return getTokenByAccessToken(accessToken) ;
		} catch (TokenResponseException e) {
	        System.out.println("ERROR-getTokenByCode: Failed to upgrade the authorization code.");
	        return null;
	      } catch (IOException e) {
	        System.out.println("ERROR-getTokenByCode: to read token data from Google.");
	        return null;
	      }		 
	 }
	public Tokeninfo getTokenByAccessToken(String accessToken) {
		 try {
				GoogleCredential credential = new GoogleCredential().setAccessToken(accessToken);
				Oauth2 oauth2 = new Oauth2.Builder(
		                TRANSPORT, JSON_FACTORY, credential).build();
		            Tokeninfo tokenInfo = oauth2.tokeninfo()
		                .setAccessToken(accessToken).execute();
                    return tokenInfo;
				 } catch (TokenResponseException e) {
				        System.out.println("ERROR-getTokenByAccessToken: Failed to upgrade the authorization code.");
				        return null;
				      } catch (IOException e) {
				        System.out.println("ERROR-getTokenByAccessToken:Failed to read token data from Google.");
				        return null;
				      }	
	}
}
