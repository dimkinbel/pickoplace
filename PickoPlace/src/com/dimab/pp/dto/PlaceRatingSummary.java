package com.dimab.pp.dto;

public class PlaceRatingSummary {
	PlaceRatingDTO rating = new PlaceRatingDTO();
	int total;
	Double average;
	public PlaceRatingDTO getRating() {
		return rating;
	}
	public void setRating(PlaceRatingDTO rating) {
		this.rating = rating;
	}
	public int getTotal() {
		return total;
	}
	public void setTotal(int total) {
		this.total = total;
	}
	public Double getAverage() {
		return average;
	}
	public void setAverage(Double average) {
		this.average = average;
	}
	
}
