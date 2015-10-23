package com.dimab.pp.dto;

import java.util.ArrayList;
import java.util.List;

public class BookingSingleShapeList {
  String sid;
  int persons;
  List<SingleTimeRangeLong> ordersList = new ArrayList<SingleTimeRangeLong>();
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
public List<SingleTimeRangeLong> getOrdersList() {
	return ordersList;
}
public void setOrdersList(List<SingleTimeRangeLong> ordersList) {
	this.ordersList = ordersList;
}
  
}
