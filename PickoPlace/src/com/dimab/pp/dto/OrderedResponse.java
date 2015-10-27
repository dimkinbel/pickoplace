package com.dimab.pp.dto;

import java.util.ArrayList;
import java.util.List;

public class OrderedResponse {
  String pid;
  Long   date1970;
  Long   period;
  int clientOffset;// Offset sent by client browser: In Israel is 2
  double placeOffset;
  List<SingleTimeRangeLong> placeOpen = new ArrayList<SingleTimeRangeLong>();
  List<BookingSingleShapeList> shapesBooked = new ArrayList<BookingSingleShapeList>();

  
public int getClientOffset() {
	return clientOffset;
}
public void setClientOffset(int clientOffset) {
	this.clientOffset = clientOffset;
}
public double getPlaceOffset() {
	return placeOffset;
}
public void setPlaceOffset(double placeOffset) {
	this.placeOffset = placeOffset;
}
public Long getPeriod() {
	return period;
}
public void setPeriod(Long period) {
	this.period = period;
}
public String getPid() {
	return pid;
}
public void setPid(String pid) {
	this.pid = pid;
}
public Long getDate1970() {
	return date1970;
}
public void setDate1970(Long date1970) {
	this.date1970 = date1970;
}
public List<SingleTimeRangeLong> getPlaceOpen() {
	return placeOpen;
}
public void setPlaceOpen(List<SingleTimeRangeLong> placeOpen) {
	this.placeOpen = placeOpen;
}
public List<BookingSingleShapeList> getShapesBooked() {
	return shapesBooked;
}
public void setShapesBooked(List<BookingSingleShapeList> shapesBooked) {
	this.shapesBooked = shapesBooked;
}
  
}
