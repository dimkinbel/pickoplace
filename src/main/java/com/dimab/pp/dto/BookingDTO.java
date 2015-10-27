package com.dimab.pp.dto;

import java.util.ArrayList;
import java.util.List;

public class BookingDTO {
   String pid;
   String bookID;
   Long UTCdate;
   Long time;
   Long period;
   PlaceInfo placeInfo = new PlaceInfo();
   String clientid;
   int weekday;
   int totalPersons;
   String textRequest;
   boolean waitingApproval = false;
   List<SingleShapeBookingResponse> shapesList = new ArrayList<SingleShapeBookingResponse>();
   PlaceRatingDTO rating = new PlaceRatingDTO();
 
public PlaceRatingDTO getRating() {
	return rating;
}
public void setRating(PlaceRatingDTO rating) {
	this.rating = rating;
}
public PlaceInfo getPlaceInfo() {
	return placeInfo;
}
public void setPlaceInfo(PlaceInfo placeInfo) {
	this.placeInfo = placeInfo;
}
public String getPid() {
	return pid;
}
public void setPid(String pid) {
	this.pid = pid;
}
public String getBookID() {
	return bookID;
}
public void setBookID(String bookID) {
	this.bookID = bookID;
}
public Long getUTCdate() {
	return UTCdate;
}
public void setUTCdate(Long uTCdate) {
	UTCdate = uTCdate;
}
public Long getTime() {
	return time;
}
public void setTime(Long time) {
	this.time = time;
}
public Long getPeriod() {
	return period;
}
public void setPeriod(Long period) {
	this.period = period;
}

public String getClientid() {
	return clientid;
}
public void setClientid(String clientid) {
	this.clientid = clientid;
}
public int getWeekday() {
	return weekday;
}
public void setWeekday(int weekday) {
	this.weekday = weekday;
}
public int getTotalPersons() {
	return totalPersons;
}
public void setTotalPersons(int totalPersons) {
	this.totalPersons = totalPersons;
}
public String getTextRequest() {
	return textRequest;
}
public void setTextRequest(String textRequest) {
	this.textRequest = textRequest;
}
public boolean isWaitingApproval() {
	return waitingApproval;
}
public void setWaitingApproval(boolean waitingApproval) {
	this.waitingApproval = waitingApproval;
}
public List<SingleShapeBookingResponse> getShapesList() {
	return shapesList;
}
public void setShapesList(List<SingleShapeBookingResponse> shapesList) {
	this.shapesList = shapesList;
}
   
}
