package com.dimab.pp.dto;

public class ClientBookingHistoryRequestDTO {
   String clientID;
   int fromNum;
   int maxBookings;
   boolean future;// Retrieve future bookings , or history ones
   
public int getFromNum() {
	return fromNum;
}
public void setFromNum(int fromNum) {
	this.fromNum = fromNum;
}
public String getClientID() {
	return clientID;
}
public void setClientID(String clientID) {
	this.clientID = clientID;
}
public int getMaxBookings() {
	return maxBookings;
}
public void setMaxBookings(int maxBookings) {
	this.maxBookings = maxBookings;
}
public boolean isFuture() {
	return future;
}
public void setFuture(boolean future) {
	this.future = future;
}
   
}
