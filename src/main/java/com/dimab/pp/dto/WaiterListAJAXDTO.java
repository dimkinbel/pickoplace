package com.dimab.pp.dto;

import java.util.ArrayList;
import java.util.List;

public class WaiterListAJAXDTO {
   String status = new String();
   List<PlaceInfo> waiterPlaces = new ArrayList<PlaceInfo>();
public String getStatus() {
	return status;
}
public void setStatus(String status) {
	this.status = status;
}
public List<PlaceInfo> getWaiterPlaces() {
	return waiterPlaces;
}
public void setWaiterPlaces(List<PlaceInfo> waiterPlaces) {
	this.waiterPlaces = waiterPlaces;
}
   
}
