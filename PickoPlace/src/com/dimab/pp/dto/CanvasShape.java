package com.dimab.pp.dto;

import com.dimab.pp.dto.ShapeBookingOptions;
import com.dimab.pp.dto.ShapeOptions;

public class CanvasShape {
   double w;
   double h;
   double x;
   double y;
   int rotate;
   int angle;
   String type = new String();
   String prevMX = new String();
   String prevMY = new String();
   ShapeOptions options = new ShapeOptions();
   ShapeBookingOptions booking_options = new ShapeBookingOptions();
   String sid = new String();

   
public ShapeBookingOptions getBooking_options() {
	return booking_options;
}
public void setBooking_options(ShapeBookingOptions booking_options) {
	this.booking_options = booking_options;
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
public int getRotate() {
	return rotate;
}
public void setRotate(int rotate) {
	this.rotate = rotate;
}
public int getAngle() {
	return angle;
}
public void setAngle(int angle) {
	this.angle = angle;
}
public String getType() {
	return type;
}
public void setType(String type) {
	this.type = type;
}
public String getPrevMX() {
	return prevMX;
}
public void setPrevMX(String prevMX) {
	this.prevMX = prevMX;
}
public String getPrevMY() {
	return prevMY;
}
public void setPrevMY(String prevMY) {
	this.prevMY = prevMY;
}
public ShapeOptions getOptions() {
	return options;
}
public void setOptions(ShapeOptions options) {
	this.options = options;
}
public String getSid() {
	return sid;
}
public void setSid(String sid) {
	this.sid = sid;
}
   
}

