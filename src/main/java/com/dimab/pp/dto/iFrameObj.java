package com.dimab.pp.dto;

/**
 * Created by dima on 02-Mar-16.
 */
public class iFrameObj {
    Boolean placeBooking;
    Integer width;
    Integer height;
    Boolean booking;
    String theme;
    String ifid;
    String pid;
    Long   time;
    String user;
    String date;

    public Boolean getPlaceBooking() {
        return placeBooking;
    }

    public void setPlaceBooking(Boolean placeBooking) {
        this.placeBooking = placeBooking;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public Integer getWidth() {
        return width;
    }

    public void setWidth(Integer width) {
        this.width = width;
    }

    public Integer getHeight() {
        return height;
    }

    public void setHeight(Integer height) {
        this.height = height;
    }

    public Boolean getBooking() {
        return booking;
    }

    public void setBooking(Boolean booking) {
        this.booking = booking;
    }

    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }

    public String getIfid() {
        return ifid;
    }

    public void setIfid(String ifid) {
        this.ifid = ifid;
    }

    public Long getTime() {
        return time;
    }

    public void setTime(Long time) {
        this.time = time;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public String getPid() {
        return pid;
    }

    public void setPid(String pid) {
        this.pid = pid;
    }
}
