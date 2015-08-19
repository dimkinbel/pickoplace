package com.dimab.pp.dto;

import java.util.ArrayList;
import java.util.List;

public class PPSubmitObject {
   String username = new String();
   String place = new String();
   String snif = new String();
   String allImageSrc;
   String background;
   String floor_name;
   String floorid;
   boolean mainfloor;
   CanvasState state = new CanvasState();
   List<CanvasShape> shapes = new ArrayList<CanvasShape>();
   
 
public boolean isMainfloor() {
	return mainfloor;
}
public void setMainfloor(boolean mainfloor) {
	this.mainfloor = mainfloor;
}
public String getFloorid() {
	return floorid;
}
public void setFloorid(String floorid) {
	this.floorid = floorid;
}
public String getAllImageSrc() {
	return allImageSrc;
}
public void setAllImageSrc(String allImageSrc) {
	this.allImageSrc = allImageSrc;
}
public String getBackground() {
	return background;
}
public void setBackground(String background) {
	this.background = background;
}
public String getFloor_name() {
	return floor_name;
}
public void setFloor_name(String floor_name) {
	this.floor_name = floor_name;
}
public CanvasState getState() {
	return state;
}
public void setState(CanvasState state) {
	this.state = state;
}
public List<CanvasShape> getShapes() {
	return shapes;
}
public void setShapes(List<CanvasShape> shapes) {
	this.shapes = shapes;
}
public String getUsername() {
	return username;
}
public void setUsername(String username) {
	this.username = username;
}
public String getPlace() {
	return place;
}
public void setPlace(String place) {
	this.place = place;
}
public String getSnif() {
	return snif;
}
public void setSnif(String snif) {
	this.snif = snif;
}
   
}
