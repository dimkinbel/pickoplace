package com.dimab.pp.dto;

public class AJAXFacebookResponse {
   String login;
   FacebookLoginResponse response = new FacebookLoginResponse();
public String getLogin() {
	return login;
}
public void setLogin(String login) {
	this.login = login;
}
public FacebookLoginResponse getResponse() {
	return response;
	
	
}
public void setResponse(FacebookLoginResponse response) {
	this.response = response;
}
   
}
