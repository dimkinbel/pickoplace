package com.dimab.pp.login;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

public class CheckTokenValid {
	String provider;
	String accessToken;
	public CheckTokenValid(HttpServletRequest request) {
		  HttpServletRequest req_ = (HttpServletRequest) request;
		  HttpSession session = req_.getSession();
		 
		  this.provider = (String) session.getAttribute("provider");
		  this.accessToken = (String) session.getAttribute(SetSessionTokenProvider.ACCESS_TOKEN_SESSION_KEY);
	}
  public GenericUser getUser() {

	  GenericUser userData = new GenericUser();
	  if(this.provider.equals("google")) {
		  GoogVerifyToken tokenVerifier = new GoogVerifyToken(this.accessToken);
			 if(tokenVerifier.isValid()) {	 
				 GOOGmeResponseJSON guserData = tokenVerifier.getData();
				 userData.setGouser(guserData);
			 } else {
				 return null;
			 }		  
	  } else if (this.provider.equals("facebook")) {
		  FBVerifyToken tokenFactory = new FBVerifyToken(this.accessToken);
			 if(tokenFactory.isValid()) {
			       FBmeResponseJSON fuserData = tokenFactory.getData();
			       userData.setFbuser(fuserData);
			 } else {
				 return null;
			 }
	  } else {
		  return null;
	  }
	  return userData;
  }
}
