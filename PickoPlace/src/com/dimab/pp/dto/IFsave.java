package com.dimab.pp.dto;

import java.util.ArrayList;
import java.util.List;

public class IFsave {
	// var iframe = {};
	// iframe.floors; both/single/split
	// iframe.singleid = floorid;
	// iframe.horisontal = true;
	// iframe.iw;
	// iframe.ih;
	// iframe.color;
	// iframe.dimentions = {};
	// iframe.dimentions[floorid] = {w:111,h:222};
	// iframe.book = true/false;
	// tframe.booktop = true/false;
	// iframe.bookfill = true/false;
	String floors = "";
	String singleid = "";
	boolean horisontal;
	Integer iw;
	Integer ih;
	String color = "";
	List<FloorDimentions> dimentions = new ArrayList<FloorDimentions>();
	boolean book;
	boolean booktop;
	boolean bookfill;
	public String getFloors() {
		return floors;
	}
	public void setFloors(String floors) {
		this.floors = floors;
	}
	public String getSingleid() {
		return singleid;
	}
	public void setSingleid(String singleid) {
		this.singleid = singleid;
	}
	public boolean isHorisontal() {
		return horisontal;
	}
	public void setHorisontal(boolean horisontal) {
		this.horisontal = horisontal;
	}
	public Integer getIw() {
		return iw;
	}
	public void setIw(Integer iw) {
		this.iw = iw;
	}
	public Integer getIh() {
		return ih;
	}
	public void setIh(Integer ih) {
		this.ih = ih;
	}
	public String getColor() {
		return color;
	}
	public void setColor(String color) {
		this.color = color;
	}
	public List<FloorDimentions> getDimentions() {
		return dimentions;
	}
	public void setDimentions(List<FloorDimentions> dimentions) {
		this.dimentions = dimentions;
	}
	public boolean isBook() {
		return book;
	}
	public void setBook(boolean book) {
		this.book = book;
	}
	public boolean isBooktop() {
		return booktop;
	}
	public void setBooktop(boolean booktop) {
		this.booktop = booktop;
	}
	public boolean isBookfill() {
		return bookfill;
	}
	public void setBookfill(boolean bookfill) {
		this.bookfill = bookfill;
	}
	
	
}
