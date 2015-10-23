package com.dimab.pp.dto;

public class WeekDayOpenClose {
   boolean open  = true;
   int from = 28800;
   int to = 72000;
public boolean isOpen() {
	return open;
}
public void setOpen(boolean open) {
	this.open = open;
}
public int getFrom() {
	return from;
}
public void setFrom(int from) {
	this.from = from;
}
public int getTo() {
	return to;
}
public void setTo(int to) {
	this.to = to;
}
   
}
