package com.dimab.pp.dto;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by dima on 28-Mar-16.
 */
public class BookingRequestPlaceView {
    String floorID;
    String floorName;
    String userID;
    double width;
    double height;
    String overviewURL;
    List<ShapeDimentions> shapes = new ArrayList<>();

    public String getFloorName() {
        return floorName;
    }

    public void setFloorName(String floorName) {
        this.floorName = floorName;
    }

    public String getOverviewURL() {
        return overviewURL;
    }

    public void setOverviewURL(String overviewURL) {
        this.overviewURL = overviewURL;
    }



    public String getFloorID() {
        return floorID;
    }

    public void setFloorID(String floorID) {
        this.floorID = floorID;
    }

    public String getUserID() {
        return userID;
    }

    public void setUserID(String userID) {
        this.userID = userID;
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

    public List<ShapeDimentions> getShapes() {
        return shapes;
    }

    public void setShapes(List<ShapeDimentions> shapes) {
        this.shapes = shapes;
    }
}
