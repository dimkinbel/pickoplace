package com.dimab.pp.dto;

import java.util.ArrayList;
import java.util.List;

public class PlaceInfo {
	//   String pid;
	//   String placeName;//
	//   String branchName;//	   
	//   String placeAddress = new String();
	//   String lat  = new String();
	//   String lng  = new String();
	//   String placeOverviewURL = new String();
	   UserPlace userPlace = new UserPlace();
	   String placeLogo = new String();
	   String placeSiteURL = new String();
	   double placeOffcet;
	   String mainFloorID = new String();
	   String mainFloorName = new String();
	   String placeMail = new String();
	   String placePhone = new String();
	   String description = "";
	   List<String> type = new ArrayList<String>();
	   List<String> subtype = new ArrayList<String>();		
	   WorkingWeek weekdaysObject  = new WorkingWeek();
       List<JsonimgID_2_data> placeImageThumbnails = new ArrayList<JsonimgID_2_data>();
       PlaceRatingSummary ratingSummary;
       

	public PlaceRatingSummary getRatingSummary() {
		return ratingSummary;
	}

	public void setRatingSummary(PlaceRatingSummary ratingSummary) {
		this.ratingSummary = ratingSummary;
	}

 

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public List<String> getType() {
		return type;
	}

	public void setType(List<String> type) {
		this.type = type;
	}

	public List<String> getSubtype() {
		return subtype;
	}

	public void setSubtype(List<String> subtype) {
		this.subtype = subtype;
	}

	public WorkingWeek getWeekdaysObject() {
		return weekdaysObject;
	}

	public void setWeekdaysObject(WorkingWeek weekdaysObject) {
		this.weekdaysObject = weekdaysObject;
	}

	public PlaceRatingSummary getRating() {
		return ratingSummary;
	}

	public void setRating(PlaceRatingSummary rating) {
		this.ratingSummary = rating;
	}

	public List<JsonimgID_2_data> getPlaceImageThumbnails() {
		return placeImageThumbnails;
	}

	public void setPlaceImageThumbnails(List<JsonimgID_2_data> placeImageThumbnails) {
		this.placeImageThumbnails = placeImageThumbnails;
	}

	public String getPlaceMail() {
		return placeMail;
	}

	public void setPlaceMail(String placeMail) {
		this.placeMail = placeMail;
	}

	public String getPlacePhone() {
		return placePhone;
	}

	public void setPlacePhone(String placePhone) {
		this.placePhone = placePhone;
	}

	public String getMainFloorID() {
		return mainFloorID;
	}

	public void setMainFloorID(String mainFloorID) {
		this.mainFloorID = mainFloorID;
	}

	public String getMainFloorName() {
		return mainFloorName;
	}

	public void setMainFloorName(String mainFloorName) {
		this.mainFloorName = mainFloorName;
	}

	public UserPlace getUserPlace() {
		return userPlace;
	}

	public void setUserPlace(UserPlace userPlace) {
		this.userPlace = userPlace;
	}

	public double getPlaceOffcet() {
		return placeOffcet;
	}

	public void setPlaceOffcet(double placeOffcet) {
		this.placeOffcet = placeOffcet;
	}

	public String getPlaceLogo() {
		return placeLogo;
	}
	public void setPlaceLogo(String placeLogo) {
		this.placeLogo = placeLogo;
	}
	public String getPlaceSiteURL() {
		return placeSiteURL;
	}
	public void setPlaceSiteURL(String placeSiteURL) {
		this.placeSiteURL = placeSiteURL;
	}
	   
}
