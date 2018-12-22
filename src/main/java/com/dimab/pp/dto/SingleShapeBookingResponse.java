package com.dimab.pp.dto;

public class SingleShapeBookingResponse {
   String pid;
   String sid;
   int persons;
   ShapeInfo shapeInfo = new ShapeInfo ();
 
   
public ShapeInfo getShapeInfo() {
	return shapeInfo;
}
public void setShapeInfo(ShapeInfo shapeInfo) {
	this.shapeInfo = shapeInfo;
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
public int getPersons() {
	return persons;
}
public void setPersons(int persons) {
	this.persons = persons;
}

   
}
