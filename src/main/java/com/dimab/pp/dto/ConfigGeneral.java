package com.dimab.pp.dto;

/**
 * Created by dima on 02-Mar-16.
 */
public class ConfigGeneral {
    Double UTCoffset;
    String placeName = new String();
    String branchName  = new String();
    String address  = new String();
    String lat  = new String();
    String lng  = new String();
    String placePhone = new String();
    String placeFax = new String();
    String placeMail = new String();
    String placeURL = new String();
    String placeDescription = new String();

    public Double getUTCoffset() {
        return UTCoffset;
    }

    public void setUTCoffset(Double UTCoffset) {
        this.UTCoffset = UTCoffset;
    }

    public String getPlaceName() {
        return placeName;
    }

    public void setPlaceName(String placeName) {
        this.placeName = placeName;
    }

    public String getBranchName() {
        return branchName;
    }

    public void setBranchName(String branchName) {
        this.branchName = branchName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getLat() {
        return lat;
    }

    public void setLat(String lat) {
        this.lat = lat;
    }

    public String getLng() {
        return lng;
    }

    public void setLng(String lng) {
        this.lng = lng;
    }

    public String getPlacePhone() {
        return placePhone;
    }

    public void setPlacePhone(String placePhone) {
        this.placePhone = placePhone;
    }

    public String getPlaceMail() {
        return placeMail;
    }

    public void setPlaceMail(String placeMail) {
        this.placeMail = placeMail;
    }

    public String getPlaceDescription() {
        return placeDescription;
    }

    public void setPlaceDescription(String placeDescription) {
        this.placeDescription = placeDescription;
    }

    public String getPlaceURL() {
        return placeURL;
    }

    public void setPlaceURL(String placeURL) {
        this.placeURL = placeURL;
    }

    public String getPlaceFax() {
        return placeFax;
    }

    public void setPlaceFax(String placeFax) {
        this.placeFax = placeFax;
    }
}
