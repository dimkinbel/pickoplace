package com.dimab.pp.dto;


public class CanvasState {
    double width;
    double height;
    double origWidth;
    double origHeight;
    boolean mainfloor;
    String bg_color = new String();
    String line_color = new String();
    String backgroundType = new String();
    String backgroundActualId = new String();
    String floorid = new String();
    double tilew;
    double tileh;
    String GCSimage = new String();
    
   
	public boolean isMainfloor() {
		return mainfloor;
	}
	public void setMainfloor(boolean mainfloor) {
		this.mainfloor = mainfloor;
	}
	public String getFloorid() {
		return floorid;
	}
	public void setFloorid(String floorid) {
		this.floorid = floorid;
	}
	public String getGCSimage() {
		return GCSimage;
	}
	public void setGCSimage(String gCSimage) {
		GCSimage = gCSimage;
	}
	public double getWidth() {
		return width;
	}
	public void setWidth(double width) {
		this.width = width;
	}
	public double getHeight() {
		return height;
	}
	public void setHeight(double height) {
		this.height = height;
	}
	public double getOrigWidth() {
		return origWidth;
	}
	public void setOrigWidth(double origWidth) {
		this.origWidth = origWidth;
	}
	public double getOrigHeight() {
		return origHeight;
	}
	public void setOrigHeight(double origHeight) {
		this.origHeight = origHeight;
	}
	public String getBg_color() {
		return bg_color;
	}
	public void setBg_color(String bg_color) {
		this.bg_color = bg_color;
	}
	public String getLine_color() {
		return line_color;
	}
	public void setLine_color(String line_color) {
		this.line_color = line_color;
	}
	public String getBackgroundType() {
		return backgroundType;
	}
	public void setBackgroundType(String backgroundType) {
		this.backgroundType = backgroundType;
	}
	public String getBackgroundActualId() {
		return backgroundActualId;
	}
	public void setBackgroundActualId(String backgroundActualId) {
		this.backgroundActualId = backgroundActualId;
	}
	public double getTilew() {
		return tilew;
	}
	public void setTilew(double tilew) {
		this.tilew = tilew;
	}
	public double getTileh() {
		return tileh;
	}
	public void setTileh(double tileh) {
		this.tileh = tileh;
	}
    

}
