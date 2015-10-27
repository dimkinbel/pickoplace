package com.dimab.pp.login;

public class GenericUser {
	FBmeResponseJSON fbuser = new FBmeResponseJSON();
	GOOGmeResponseJSON gouser = new GOOGmeResponseJSON();
	boolean google = false;
	boolean facebook = false;
	
	public String getEmail() {
		if(google) {
			return gouser.getEmail();
		} else if (facebook) {
			return fbuser.getEmail();
		} else {
			return "__";
		}
	}
	public String getName(){
		if(google) {
			return gouser.getGiven_name();
		} else if (facebook) {
			return fbuser.getFirst_name();
		} else {
			return "__";
		}
	}
	public String getFamily(){
		if(google) {
			return gouser.getFamily_name();
		} else if (facebook) {
			return fbuser.getLast_name();
		} else {
			return "__";
		}
	}
	public FBmeResponseJSON getFbuser() {
		return fbuser;
	}
	public void setFbuser(FBmeResponseJSON fbuser) {
		this.fbuser = fbuser;
		this.facebook = true;
	}
	public GOOGmeResponseJSON getGouser() {
		return gouser;
	}
	public void setGouser(GOOGmeResponseJSON gouser) {
		this.gouser = gouser;
		this.google = true;
	}
	public boolean isGoogle() {
		return google;
	}
	public void setGoogle(boolean google) {
		this.google = google;
	}
	public boolean isFacebook() {
		return facebook;
	}
	public void setFacebook(boolean facebook) {
		this.facebook = facebook;
	}
	
	
}
