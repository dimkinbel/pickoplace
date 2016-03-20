package com.dimab.pp.dto;

import java.util.ArrayList;
import java.util.List;

public class ShapeBookingOptions {
	boolean bookable = true;
	boolean marged = false;
	List<String> mergelist = new ArrayList<String>();
	String givenName = new String();
	int minPersons = 1;
	int maxPersons = 1;
	String description;
	
	
	
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public boolean isBookable() {
		return bookable;
	}
	public void setBookable(boolean bookable) {
		this.bookable = bookable;
	}
	public boolean isMarged() {
		return marged;
	}
	public void setMarged(boolean marged) {
		this.marged = marged;
	}
	public List<String> getMergelist() {
		return mergelist;
	}
	public void setMergelist(List<String> mergelist) {
		this.mergelist = mergelist;
	}
	public String getGivenName() {
		return givenName;
	}
	public void setGivenName(String givenName) {
		this.givenName = givenName;
	}
	public int getMinPersons() {
		return minPersons;
	}
	public void setMinPersons(int minPersons) {
		this.minPersons = minPersons;
	}
	public int getMaxPersons() {
		return maxPersons;
	}
	public void setMaxPersons(int maxPersons) {
		this.maxPersons = maxPersons;
	}
	
}
