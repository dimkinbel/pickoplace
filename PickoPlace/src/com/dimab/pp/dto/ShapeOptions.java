package com.dimab.pp.dto;

public class ShapeOptions {
   String lineColor = new String();
   String fillColor = new String();
   double alpha;
   double salpha;
   int sw;
   int roundRad;
   int startA;
   int endA;
   int cutX;
   String imgID = new String();
   String GCSimage = new String();

   String text = new String();
   String font_bold = new String();
   String font_style = new String();
   int font_size;
   String font_color = new String();
   boolean shadow = false;
   int shadow_x;
   int shadow_y;
   int shadow_blur;
   String shadow_color = new String();
 
   int x1;
   int x2;
   int y1;
   int y2;
   
   public String getText() {
	return text;
}
public void setText(String text) {
	this.text = text;
}
public String getFont_bold() {
	return font_bold;
}
public void setFont_bold(String font_bold) {
	this.font_bold = font_bold;
}
public String getFont_style() {
	return font_style;
}
public void setFont_style(String font_style) {
	this.font_style = font_style;
}
public int getFont_size() {
	return font_size;
}
public void setFont_size(int font_size) {
	this.font_size = font_size;
}
public String getFont_color() {
	return font_color;
}
public void setFont_color(String font_color) {
	this.font_color = font_color;
}
public boolean isShadow() {
	return shadow;
}
public void setShadow(boolean shadow) {
	this.shadow = shadow;
}
public int getShadow_x() {
	return shadow_x;
}
public void setShadow_x(int shadow_x) {
	this.shadow_x = shadow_x;
}
public int getShadow_y() {
	return shadow_y;
}
public void setShadow_y(int shadow_y) {
	this.shadow_y = shadow_y;
}
public int getShadow_blur() {
	return shadow_blur;
}
public void setShadow_blur(int shadow_blur) {
	this.shadow_blur = shadow_blur;
}
public String getShadow_color() {
	return shadow_color;
}
public void setShadow_color(String shadow_color) {
	this.shadow_color = shadow_color;
}
public String getGCSimage() {
		return GCSimage;
	}
	public void setGCSimage(String gCSimage) {
		GCSimage = gCSimage;
	}   
public String getLineColor() {
	return lineColor;
}
public void setLineColor(String lineColor) {
	this.lineColor = lineColor;
}
public String getFillColor() {
	return fillColor;
}
public void setFillColor(String fillColor) {
	this.fillColor = fillColor;
}
public double getAlpha() {
	return alpha;
}
public void setAlpha(double alpha) {
	this.alpha = alpha;
}
public double getSalpha() {
	return salpha;
}
public void setSalpha(double salpha) {
	this.salpha = salpha;
}
public int getSw() {
	return sw;
}
public void setSw(int sw) {
	this.sw = sw;
}
public int getRoundRad() {
	return roundRad;
}
public void setRoundRad(int roundRad) {
	this.roundRad = roundRad;
}
public int getStartA() {
	return startA;
}
public void setStartA(int startA) {
	this.startA = startA;
}
public int getEndA() {
	return endA;
}
public void setEndA(int endA) {
	this.endA = endA;
}
public int getCutX() {
	return cutX;
}
public void setCutX(int cutX) {
	this.cutX = cutX;
}
public String getImgID() {
	return imgID;
}
public void setImgID(String imgID) {
	this.imgID = imgID;
}
   
  
}
