package com.dimab.pp.dto;

public class WorkingWeek {
	WeekDayOpenClose sun = new WeekDayOpenClose();
	WeekDayOpenClose mon = new WeekDayOpenClose();
	WeekDayOpenClose tue = new WeekDayOpenClose();
	WeekDayOpenClose wed = new WeekDayOpenClose();
	WeekDayOpenClose thu = new WeekDayOpenClose();
	WeekDayOpenClose fri = new WeekDayOpenClose();
	WeekDayOpenClose sat = new WeekDayOpenClose();
	public WeekDayOpenClose  getWeekDayOpenClose(int getDayValue) {
		WeekDayOpenClose returnDay;
	        switch (getDayValue) {
	            case 0:  returnDay = sun;
	                     break;
	            case 1:  returnDay = mon;
	            		break;
	            case 2:  returnDay = tue;
	                     break;
	            case 3:  returnDay = wed;
	                     break;
	            case 4:  returnDay = thu;
	                     break;
	            case 5:  returnDay = fri;
	                     break;
	            case 6:  returnDay = sat;
	                     break;
	            default: returnDay = sun;
                         break;
	        }
	      return  returnDay;
	}
	public WeekDayOpenClose getSun() {
		return sun;
	}
	public void setSun(WeekDayOpenClose sun) {
		this.sun = sun;
	}
	public WeekDayOpenClose getMon() {
		return mon;
	}
	public void setMon(WeekDayOpenClose mon) {
		this.mon = mon;
	}
	public WeekDayOpenClose getTue() {
		return tue;
	}
	public void setTue(WeekDayOpenClose tue) {
		this.tue = tue;
	}
	public WeekDayOpenClose getWed() {
		return wed;
	}
	public void setWed(WeekDayOpenClose wed) {
		this.wed = wed;
	}
	public WeekDayOpenClose getThu() {
		return thu;
	}
	public void setThu(WeekDayOpenClose thu) {
		this.thu = thu;
	}
	public WeekDayOpenClose getFri() {
		return fri;
	}
	public void setFri(WeekDayOpenClose fri) {
		this.fri = fri;
	}
	public WeekDayOpenClose getSat() {
		return sat;
	}
	public void setSat(WeekDayOpenClose sat) {
		this.sat = sat;
	}

	
}
