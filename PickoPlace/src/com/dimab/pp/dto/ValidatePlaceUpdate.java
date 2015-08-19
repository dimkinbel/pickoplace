package com.dimab.pp.dto;

public class ValidatePlaceUpdate {
   String placeName;
   String branchName;
   String placeID;
   
@Override
public String toString() {
	// TODO Auto-generated method stub
	return "ValidatePlaceUpdate: " + this.placeName + "," + this.branchName + "," + this.placeID;
}
public String getPlaceName() {
	return placeName;
}
public void setPlaceName(String placeName) {
	this.placeName = placeName;
}
public String getBranchName() {
	return branchName;
}
public void setBranchName(String branchName) {
	this.branchName = branchName;
}
public String getPlaceID() {
	return placeID;
}
public void setPlaceID(String placeID) {
	this.placeID = placeID;
}
   
}
