package com.dimab.pp.dto;

public class JsonSID_2_imgID {
	   String sid = "";
	   String imageID = "";
	public String getSid() {
		return sid;
	}
	public void setSid(String sid) {
		this.sid = sid;
	}
	public String getImageID() {
		return imageID;
	}
	public void setImageID(String imageID) {
		this.imageID = imageID;
	}
	@Override
	public String toString() {
		return "{"+ this.sid + ":" + this.imageID + "}";
	}
	
	   
}
