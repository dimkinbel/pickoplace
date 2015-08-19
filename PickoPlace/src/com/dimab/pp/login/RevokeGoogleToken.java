package com.dimab.pp.login;

import java.io.IOException;

import com.google.api.client.http.GenericUrl;
import com.google.api.client.http.HttpResponse;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;

public class RevokeGoogleToken {
	private static final HttpTransport TRANSPORT = new NetHttpTransport();
	public void revoke(String access_token) {
	    // Only disconnect a connected user.

	    try {
	      System.out.println("ACCESS TOKEN:"+access_token);
	      // Execute HTTP GET request to revoke current token.
	      HttpResponse revokeResponse = TRANSPORT.createRequestFactory()
	          .buildGetRequest(new GenericUrl(
	              String.format(
	                  "https://accounts.google.com/o/oauth2/revoke?token=%s",
	                  access_token))).execute();

	    } catch (IOException e) {
	      // For whatever reason, the given token was invalid.

	    }		
	}

}
