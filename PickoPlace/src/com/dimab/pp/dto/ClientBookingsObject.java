package com.dimab.pp.dto;

import java.util.ArrayList;
import java.util.List;

public class ClientBookingsObject {
   boolean logged;
   String clientID;
   int totalBookings;
   List<BookingDTO> bookings = new ArrayList<BookingDTO>();
   List<JsonImageID_2_GCSurl> JSONimageID2url = new ArrayList<JsonImageID_2_GCSurl>();
   List<JsonSID_2_imgID> JSONSIDlinks = new ArrayList<JsonSID_2_imgID>();
   
public boolean isLogged() {
	return logged;
}
public void setLogged(boolean logged) {
	this.logged = logged;
}
public List<JsonImageID_2_GCSurl> getJSONimageID2url() {
	return JSONimageID2url;
}
public void setJSONimageID2url(List<JsonImageID_2_GCSurl> jSONimageID2url) {
	JSONimageID2url = jSONimageID2url;
}
public List<JsonSID_2_imgID> getJSONSIDlinks() {
	return JSONSIDlinks;
}
public void setJSONSIDlinks(List<JsonSID_2_imgID> jSONSIDlinks) {
	JSONSIDlinks = jSONSIDlinks;
}
public String getClientID() {
	return clientID;
}
public void setClientID(String clientID) {
	this.clientID = clientID;
}
public int getTotalBookings() {
	return totalBookings;
}
public void setTotalBookings(int totalBookings) {
	this.totalBookings = totalBookings;
}
public List<BookingDTO> getBookings() {
	return bookings;
}
public void setBookings(List<BookingDTO> bookings) {
	this.bookings = bookings;
}
   
}
