package com.dimab.pp.dto;

public class SingleTimeRangeLong {
	   Long from;
	   Long to;
	   String bid;
	   String testID;
	   int persons;
	   String  type = "user" ;


	public String getType() {
			return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public int getPersons() {
		return persons;
	}
	public void setPersons(int persons) {
		this.persons = persons;
	}
	public String getTestID() {
		return testID;
	}
	public void setTestID(String testID) {
		this.testID = testID;
	}
	public String getBid() {
		return bid;
	}
	public void setBid(String bid) {
		this.bid = bid;
	}
	public Long getFrom() {
		return from;
	}
	public void setFrom(Long from) {
		this.from = from;
	}
	public Long getTo() {
		return to;
	}
	public void setTo(Long to) {
		this.to = to;
	}
	   
	}

