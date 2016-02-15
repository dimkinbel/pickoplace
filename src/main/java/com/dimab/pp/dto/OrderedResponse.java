package com.dimab.pp.dto;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class OrderedResponse {
    String pid;
    Long date1970;
    Integer minPeriod;
    Long period;
    int clientOffset;// Offset sent by client browser: In Israel is 2
    double placeOffset;
    List<SingleTimeRangeLong> placeOpen = new ArrayList<SingleTimeRangeLong>();
    List<BookingSingleShapeList> shapesBooked = new ArrayList<BookingSingleShapeList>();
    Map<Integer, WeekDay> weekObject = new HashMap<Integer, WeekDay>();
    List<Integer> closeDays = new ArrayList<>();

    public Integer getMinPeriod() {
        return minPeriod;
    }

    public void setMinPeriod(Integer minPeriod) {
        this.minPeriod = minPeriod;
    }

    public List<Integer> getCloseDays() {
        return closeDays;
    }

    public void setCloseDays(List<Integer> closeDates) {
        this.closeDays = closeDates;
    }

    public Map<Integer, WeekDay> getWeekObject() {
        return weekObject;
    }

    public void setWeekObject(Map<Integer, WeekDay> weekObject) {
        this.weekObject = weekObject;
    }

    public int getClientOffset() {
        return clientOffset;
    }

    public void setClientOffset(int clientOffset) {
        this.clientOffset = clientOffset;
    }

    public double getPlaceOffset() {
        return placeOffset;
    }

    public void setPlaceOffset(double placeOffset) {
        this.placeOffset = placeOffset;
    }

    public Long getPeriod() {
        return period;
    }

    public void setPeriod(Long period) {
        this.period = period;
    }

    public String getPid() {
        return pid;
    }

    public void setPid(String pid) {
        this.pid = pid;
    }

    public Long getDate1970() {
        return date1970;
    }

    public void setDate1970(Long date1970) {
        this.date1970 = date1970;
    }

    public List<SingleTimeRangeLong> getPlaceOpen() {
        return placeOpen;
    }

    public void setPlaceOpen(List<SingleTimeRangeLong> placeOpen) {
        this.placeOpen = placeOpen;
    }

    public List<BookingSingleShapeList> getShapesBooked() {
        return shapesBooked;
    }

    public void setShapesBooked(List<BookingSingleShapeList> shapesBooked) {
        this.shapesBooked = shapesBooked;
    }

}
