package com.dimab.pp.dto;

import java.util.ArrayList;
import java.util.List;

public class WizResultData {
	   List<FreePlaceInfo> places = new ArrayList<FreePlaceInfo>();
	   String cursor="";
	public List<FreePlaceInfo> getPlaces() {
		return places;
	}
	public void setPlaces(List<FreePlaceInfo> places) {
		this.places = places;
	}
	public String getCursor() {
		return cursor;
	}
	public void setCursor(String cursor) {
		this.cursor = cursor;
	}
	   
}
