package com.dimab.pp.dto;

import java.util.ArrayList;
import java.util.List;

public class PlaceCheckAvailableJSON {
	  String pid;
	  int clientOffset;// Offset sent by client browser: In Israel is -2
	  double placeOffset;
	  int weekday;
	  Long date1970;
	  Long period;
	  List<String> listOfSids = new ArrayList<String>();

	public List<String> getListOfSids() {
		return listOfSids;
	}

	public void setListOfSids(List<String> listOfSids) {
		this.listOfSids = listOfSids;
	}

	public int getWeekday() {
		return weekday;
	}
	public void setWeekday(int weekday) {
		this.weekday = weekday;
	}
	public double getPlaceOffset() {
		return placeOffset;
	}
	public void setPlaceOffset(double placeOffset) {
		this.placeOffset = placeOffset;
	}
	public int getClientOffset() {
		return clientOffset;
	}
	public void setClientOffset(int clientOffset) {
		this.clientOffset = clientOffset;
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
	  
}
