package com.dimab.pp.login.dto;

import com.dimab.pp.dto.AdminSetUser;

public class GenericUser {
	FBmeResponseJSON fbuser = new FBmeResponseJSON();
	GOOGmeResponseJSON gouser = new GOOGmeResponseJSON();
	boolean google = false;
	boolean facebook = false;
	boolean admin = false;
	AdminSetUser aduser = new AdminSetUser();
	
	public String getEmail() {
		if(google) {
			return gouser.getEmail();
		} else if (facebook) {
			return fbuser.getEmail();
		} else if (admin) {
			return aduser.getEmail();
		} else {
			return "__";
		}
	}
	public String getName(){
		if(google) {
			return gouser.getGiven_name();
		} else if (facebook) {
			return fbuser.getFirst_name();
		} else if (admin) {
			return aduser.getName();
		} else {
			return "__";
		}
	}
	public String getFamily(){
		if(google) {
			return gouser.getFamily_name();
		} else if (facebook) {
			return fbuser.getLast_name();
		} else if (admin) {
			return aduser.getFamily();
		} else {
			return "__";
		}
	}

	public boolean isAdmin() {
		return admin;
	}

	public void setAdmin(boolean admin) {
		this.admin = admin;
	}

	public AdminSetUser getAduser() {
		return aduser;
	}

	public void setAduser(AdminSetUser aduser) {
		this.aduser = aduser;
		this.admin = true;
		this.facebook = false;
		this.google = false;
	}

	public FBmeResponseJSON getFbuser() {
		return fbuser;
	}
	public void setFbuser(FBmeResponseJSON fbuser) {
		this.fbuser = fbuser;
		this.facebook = true;
		this.google = false;
		this.admin = false;
	}
	public GOOGmeResponseJSON getGouser() {
		return gouser;
	}
	public void setGouser(GOOGmeResponseJSON gouser) {
		this.gouser = gouser;
		this.google = true;
		this.facebook = false;
		this.admin = false;
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
