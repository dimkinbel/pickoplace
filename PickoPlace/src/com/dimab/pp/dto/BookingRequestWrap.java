package com.dimab.pp.dto;

import java.util.ArrayList;
import java.util.List;

public class BookingRequestWrap {
	  List<BookingRequest> bookingList = new ArrayList<BookingRequest>();
	  String pid;
	  String testID;
	  String bookID;
	  Long dateSeconds;
	  Integer time;
	  Integer period;
	  int clientOffset;
	  double placeOffcet;
	  String clientid;
	  int weekday;
	  String textRequest = new String();
	  int num;
	  
	  
	  
	public int getNum() {
		return num;
	}
	public void setNum(int num) {
		this.num = num;
	}
	public String getTextRequest() {
		return textRequest;
	}
	public void setTextRequest(String textRequest) {
		this.textRequest = textRequest;
	}
	public int getWeekday() {
		return weekday;
	}
	public void setWeekday(int weekday) {
		this.weekday = weekday;
	}
	public List<BookingRequest> getBookingList() {
		return bookingList;
	}
	public void setBookingList(List<BookingRequest> bookingList) {
		this.bookingList = bookingList;
	}
	public String getPid() {
		return pid;
	}
	public void setPid(String pid) {
		this.pid = pid;
	}
	public String getTestID() {
		return testID;
	}
	public void setTestID(String testID) {
		this.testID = testID;
	}
	public String getBookID() {
		return bookID;
	}
	public void setBookID(String bookID) {
		this.bookID = bookID;
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

	public int getClientOffset() {
		return clientOffset;
	}
	public void setClientOffset(int clientOffset) {
		this.clientOffset = clientOffset;
	}
	public double getPlaceOffcet() {
		return placeOffcet;
	}
	public void setPlaceOffcet(double placeOffcet) {
		this.placeOffcet = placeOffcet;
	}
	public String getClientid() {
		return clientid;
	}
	public void setClientid(String clientid) {
		this.clientid = clientid;
	}

	  
}
