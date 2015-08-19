package com.dimab.pp.dto;

public class BookingRequest {
  String pid;
  String sid;
  String testID;
  String bookID;
  Long dateSeconds;
  Integer time;
  Integer period;
  int persons;
  int clientOffset;
  double placeOffcet;
  String clientid;
  String loggedby;
 
  

public String getClientid() {
	return clientid;
}
public void setClientid(String clientid) {
	this.clientid = clientid;
}
public String getLoggedby() {
	return loggedby;
}
public void setLoggedby(String loggedby) {
	this.loggedby = loggedby;
}
public String getTestID() {
	return testID;
}
public void setTestID(String testID) {
	this.testID = testID;
}
public double getPlaceOffcet() {
	return placeOffcet;
}
public void setPlaceOffcet(double placeOffcet) {
	this.placeOffcet = placeOffcet;
}
public String getBookID() {
	return bookID;
}
public void setBookID(String bookID) {
	this.bookID = bookID;
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
public Long getDateSeconds() {
	return dateSeconds;
}
public void setDateSeconds(Long dateSeconds) {
	this.dateSeconds = dateSeconds;
}
public Integer getTime() {
	return time;
}
public void setTime(Integer time) {
	this.time = time;
}
public Integer getPeriod() {
	return period;
}
public void setPeriod(Integer period) {
	this.period = period;
}
public int getPersons() {
	return persons;
}
public void setPersons(int persons) {
	this.persons = persons;
}
public int getClientOffset() {
	return clientOffset;
}
public void setClientOffset(int clientOffset) {
	this.clientOffset = clientOffset;
}
  

}
