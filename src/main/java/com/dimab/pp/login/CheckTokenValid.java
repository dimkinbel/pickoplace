package com.dimab.pp.login;

import com.dimab.pp.login.dto.FBmeResponseJSON;
import com.dimab.pp.login.dto.GOOGmeResponseJSON;
import com.dimab.pp.login.dto.GenericUser;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

public class CheckTokenValid {
	String provider;
	String accessToken;
	String googleRefreshToken;

	public CheckTokenValid(HttpServletRequest request) {
		  HttpServletRequest req_ =   request;
		  HttpSession session = req_.getSession();
		 
		  this.provider = (String) session.getAttribute("provider");
		  this.accessToken = (String) session.getAttribute("access_token");
		  this.googleRefreshToken = (String) session.getAttribute("googleRefreshToken");
	}

  public GenericUser getUser() {

	  GenericUser userData = new GenericUser();
	  if(this.provider.equals("google")) {
		  GoogVerifyToken tokenVerifier = new GoogVerifyToken(this.accessToken,this.googleRefreshToken);
			 if(tokenVerifier.isValid()) {	 
				 GOOGmeResponseJSON guserData = tokenVerifier.getData();
				 userData.setGouser(guserData);
			 } else {
				 return null;
			 }		  
	  } else if (this.provider.equals("facebook")) {
		  FBVerifyToken tokenFactory = new FBVerifyToken();
		  FBmeResponseJSON fuserData = tokenFactory.getData(this.accessToken);
		  if(fuserData!=null) {
			  userData.setFbuser(fuserData);
		  } else {
			  return null;
		  }

	  } else if (this.provider.equals("ppuser")) {
		  PPuserLogin ppuserFactory = new PPuserLogin(this.accessToken);


		  if(ppuserFactory.getPpuser().getValid()) {
			  userData.setPpuser(ppuserFactory.getPpuser());
		  } else {
			  return null;
		  }

	  } else {
		  return null;
	  }
	  return userData;
  }
}
