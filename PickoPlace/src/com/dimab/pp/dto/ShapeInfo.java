package com.dimab.pp.dto;

public class ShapeInfo {
 String pid;
 String sid;
 String floorid;
 String name;
 String floorname = new String();
 String overviewURL = new String();
 String type = new String();
 String imgID = new String();
 double w;
 double h;
 double x;
 double y;
 double angle;
 ShapeOptions options = new ShapeOptions();
 int min;
 int max;
 
public String getName() {
	return name;
}
public void setName(String name) {
	this.name = name;
}
public String getFloorname() {
	return floorname;
}
public void setFloorname(String floorname) {
	this.floorname = floorname;
}
public ShapeOptions getOptions() {
	return options;
}
public void setOptions(ShapeOptions options) {
	this.options = options;
}
public String getPid() {
	return pid;
}
public void setPid(String pid) {
	this.pid = pid;
}
public String getSid() {
	return sid;
}
public void setSid(String sid) {
	this.sid = sid;
}
public String getFloorid() {
	return floorid;
}
public void setFloorid(String floorid) {
	this.floorid = floorid;
}
public String getOverviewURL() {
	return overviewURL;
}
public void setOverviewURL(String overviewURL) {
	this.overviewURL = overviewURL;
}
public String getType() {
	return type;
}
public void setType(String type) {
	this.type = type;
}
public String getImgID() {
	return imgID;
}
public void setImgID(String imgID) {
	this.imgID = imgID;
}
public double getW() {
	return w;
}
public void setW(double w) {
	this.w = w;
}
public double getH() {
	return h;
}
public void setH(double h) {
	this.h = h;
}
public double getX() {
	return x;
}
public void setX(double x) {
	this.x = x;
}
public double getY() {
	return y;
}
public void setY(double y) {
	this.y = y;
}
public double getAngle() {
	return angle;
}
public void setAngle(double angle) {
	this.angle = angle;
}
public int getMin() {
	return min;
}
public void setMin(int min) {
	this.min = min;
}
public int getMax() {
	return max;
}
public void setMax(int max) {
	this.max = max;
}
 
}
