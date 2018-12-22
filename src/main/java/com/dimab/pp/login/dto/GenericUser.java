package com.dimab.pp.login.dto;

import com.dimab.pp.dto.AdminSetUser;

public class GenericUser {
	FBmeResponseJSON fbuser = new FBmeResponseJSON();
	GOOGmeResponseJSON gouser = new GOOGmeResponseJSON();
	PPuser ppuser = new PPuser();
	boolean pptype = false;
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
		} else if(pptype) {
			return ppuser.getEmail();
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
		} else if(pptype) {
			return ppuser.getName();
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
		} else if(pptype) {
			return ppuser.getLastName();
		} else {
			return "__";
		}
	}
	public PPuser getPpuser() {
		return ppuser;
	}

	public void setPpuser(PPuser ppuser) {
		this.ppuser = ppuser;
		this.admin = false;
		this.facebook = false;
		this.google = false;
		this.pptype = true;
	}

	public boolean isPptype() {
		return pptype;
	}

	public void setPptype(boolean pptype) {
		this.pptype = pptype;
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
		this.pptype = false;
	}

	public FBmeResponseJSON getFbuser() {
		return fbuser;
	}
	public void setFbuser(FBmeResponseJSON fbuser) {
		this.fbuser = fbuser;
		this.facebook = true;
		this.google = false;
		this.admin = false;
		this.pptype = false;
	}
	public GOOGmeResponseJSON getGouser() {
		return gouser;
	}
	public void setGouser(GOOGmeResponseJSON gouser) {
		this.gouser = gouser;
		this.google = true;
		this.facebook = false;
		this.admin = false;
		this.pptype = false;
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
