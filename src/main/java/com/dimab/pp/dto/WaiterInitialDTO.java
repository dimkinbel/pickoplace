package com.dimab.pp.dto;

public class WaiterInitialDTO {
	AJAXImagesJSON placeJSON = new AJAXImagesJSON();
	OrderedResponse orderedResponse = new OrderedResponse();
	
	public AJAXImagesJSON getPlaceJSON() {
		return placeJSON;
	}

	public void setPlaceJSON(AJAXImagesJSON placeJSON) {
		this.placeJSON = placeJSON;
	}

	public OrderedResponse getOrderedResponse() {
		return orderedResponse;
	}

	public void setOrderedResponse(OrderedResponse orderedResponse) {
		this.orderedResponse = orderedResponse;
	}
	
	
}
