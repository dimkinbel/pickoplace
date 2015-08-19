package com.dimab.pp.dto;

public class SearchRequestJSON {
  String name = "";
  Double lat;
  Double lng;
  Integer radius;
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
