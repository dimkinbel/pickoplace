package com.dimab.pp.dto;

import java.util.ArrayList;
import java.util.List;

public class UserAccountData {
   String username;
   List<UserPlace> places = new ArrayList<UserPlace>();
   
   public String getUsername() {
	return username;
}

public void setUsername(String username) {
	this.username = username;
}

public List<UserPlace> getPlaces() {
	return places;
}

public void setPlaces(List<UserPlace> places) {
	this.places = places;
}

}
