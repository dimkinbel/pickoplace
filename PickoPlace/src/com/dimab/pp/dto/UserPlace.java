package com.dimab.pp.dto;

public class UserPlace {
	   String userRand;
	   String place;
	   String branch;
	   String Address;
	   Double Lat;
	   Double Lng;
	   String overviewCloudURL;
	   String PlaceID;
	   int shapesCount;
	   int floors;
	   
	public int getFloors() {
		return floors;
	}
	public void setFloors(int floors) {
		this.floors = floors;
	}
	public String getUserRand() {
		return userRand;
	}
	public void setUserRand(String userRand) {
		this.userRand = userRand;
	}
	public String getPlaceID() {
		return PlaceID;
	}
	public void setPlaceID(String placeID) {
		PlaceID = placeID;
	}
	public String getOverviewCloudURL() {
		return overviewCloudURL;
	}
	public void setOverviewCloudURL(String overviewCloudURL) {
		this.overviewCloudURL = overviewCloudURL;
	}
	public String getPlace() {
		return place;
	}
	public void setPlace(String place) {
		this.place = place;
	}
	public String getBranch() {
		return branch;
	}
	public void setBranch(String branch) {
		this.branch = branch;
	}
	public String getAddress() {
		return Address;
	}
	public void setAddress(String address) {
		Address = address;
	}
	public Double getLat() {
		return Lat;
	}
	public void setLat(Double lat) {
		Lat = lat;
	}
	public Double getLng() {
		return Lng;
	}
	public void setLng(Double lng) {
		Lng = lng;
	}
	public int getShapesCount() {
		return shapesCount;
	}
	public void setShapesCount(int shapesCount) {
		this.shapesCount = shapesCount;
	}
	
}
