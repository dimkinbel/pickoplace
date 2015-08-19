package com.dimab.pp.dto;

import java.util.ArrayList;
import java.util.List;

public class WelcomePageData {
	   List<PlaceInfo> places = new ArrayList<PlaceInfo>();
	   String cursor="";
	public List<PlaceInfo> getPlaces() {
		return places;
	}
	public void setPlaces(List<PlaceInfo> places) {
		this.places = places;
	}
	public String getCursor() {
		return cursor;
	}
	public void setCursor(String cursor) {
		this.cursor = cursor;
	}


}
