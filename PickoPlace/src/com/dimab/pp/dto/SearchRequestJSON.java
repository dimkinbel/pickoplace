package com.dimab.pp.dto;

import com.google.appengine.api.search.Cursor;

public class SearchRequestJSON {
  String name = "";
  Double lat;
  Double lng;
  Integer radius;
  Cursor cursor;
  Integer searchLimit = -1;
  
public Integer getSearchLimit() {
	return searchLimit;
}
public void setSearchLimit(Integer searchLimit) {
	this.searchLimit = searchLimit;
}
public Cursor getCursor() {
	return cursor;
}
public void setCursor(Cursor cursor) {
	this.cursor = cursor;
}
public String getName() {
	return name;
}
public void setName(String name) {
	this.name = name;
}
public Double getLat() {
	return lat;
}
public void setLat(Double lat) {
	this.lat = lat;
}
public Double getLng() {
	return lng;
}
public void setLng(Double lng) {
	this.lng = lng;
}
public Integer getRadius() {
	return radius;
}
public void setRadius(Integer radius) {
	this.radius = radius;
}
  
  
}
