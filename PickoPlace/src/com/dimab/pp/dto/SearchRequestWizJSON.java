package com.dimab.pp.dto;

import com.google.appengine.api.search.Cursor;

public class SearchRequestWizJSON {
	  SearchRequestJSON serachRequest = new SearchRequestJSON();
	  Integer persons;
	  Integer dateUTC;
	  Integer time;
	  Integer marginSeconds = 30*60;// 30 minutes default
	  Integer periodSeconds = 2 * 60 * 60; // 2 hours default
	  Integer weekDay;
	  String  type = "";
	  String  subtype = "";
      String  datastoreCursorAsString = "";
      Double rating;
      
 
	public Double getRating() {
		return rating;
	}
	public void setRating(Double rating) {
		this.rating = rating;
	}
	public Integer getWeekDay() {
		return weekDay;
	}
	public void setWeekDay(Integer weekDay) {
		this.weekDay = weekDay;
	}
	public Integer getPersons() {
		return persons;
	}
	public void setPersons(Integer persons) {
		this.persons = persons;
	}
	public Integer getDateUTC() {
		return dateUTC;
	}
	public void setDateUTC(Integer dateUTC) {
		this.dateUTC = dateUTC;
	}
	public Integer getTime() {
		return time;
	}
	public void setTime(Integer time) {
		this.time = time;
	}
	public Integer getMarginSeconds() {
		return marginSeconds;
	}
	public void setMarginSeconds(Integer marginSeconds) {
		this.marginSeconds = marginSeconds;
	}
	public Integer getPeriodSeconds() {
		return periodSeconds;
	}
	public void setPeriodSeconds(Integer periodSeconds) {
		this.periodSeconds = periodSeconds;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getSubtype() {
		return subtype;
	}
	public void setSubtype(String subtype) {
		this.subtype = subtype;
	}
	public SearchRequestJSON getSerachRequest() {
		return serachRequest;
	}
	public void setSerachRequest(SearchRequestJSON serachRequest) {
		this.serachRequest = serachRequest;
	}
	public String getDatastoreCursorAsString() {
		return datastoreCursorAsString;
	}
	public void setDatastoreCursorAsString(String datastoreCursorAsString) {
		this.datastoreCursorAsString = datastoreCursorAsString;
	}
 
	  
}
