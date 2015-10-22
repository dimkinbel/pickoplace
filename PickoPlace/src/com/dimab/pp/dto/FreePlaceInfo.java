package com.dimab.pp.dto;

import java.util.ArrayList;
import java.util.List;

public class FreePlaceInfo {
	PlaceInfo placeInfo = new PlaceInfo();
	List<FreePlaceOption> freeOptions = new ArrayList<FreePlaceOption>();
	public PlaceInfo getPlaceInfo() {
		return placeInfo;
	}
	public void setPlaceInfo(PlaceInfo placeInfo) {
		this.placeInfo = placeInfo;
	}
	public List<FreePlaceOption> getFreeOptions() {
		return freeOptions;
	}
	public void setFreeOptions(List<FreePlaceOption> freeOptions) {
		this.freeOptions = freeOptions;
	}
	
}
