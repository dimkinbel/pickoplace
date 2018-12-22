package com.dimab.pp.dto;

import java.util.*;

public class AJAXImagesJSON {
    String stage = new String();
    String placeName = new String();
    String branchName = new String();
    String address = new String();
    String lat = new String();
    String lng = new String();
    String placePhone = new String();
    String placeFax = new String();
    String placeMail = new String();
    String placeURL = new String();
    String placeDescription = new String();
    String user_ = new String();
    String place_ = new String();
    String snif_ = new String();
    String placeID = new String();
    String usernameRandom = new String();
    String logosrc = new String();
    List<JsonimgID_2_data> placePhotos = new ArrayList<JsonimgID_2_data>();
    WorkingWeek workinghours = new WorkingWeek();
    List<Integer> closeDates = new ArrayList<Integer>();
    List<AdminUser> placeEditList = new ArrayList<AdminUser>();
    boolean automatic_approval;
    List<String> automaticApprovalList = new ArrayList<String>();
    List<String> adminApprovalList = new ArrayList<String>();

    List<JsonimgID_2_data> JSONbyte64files = new ArrayList<JsonimgID_2_data>();
    List<JsonImageID_2_GCSurl> JSONimageID2url = new ArrayList<JsonImageID_2_GCSurl>();
    List<JsonSID_2_imgID> JSONSIDlinks = new ArrayList<JsonSID_2_imgID>();
    List<PPSubmitObject> floors = new ArrayList<PPSubmitObject>();
    Double UTCoffset;
    Integer placeMaxPersons = 0;
    Set<Integer> personsList = new TreeSet<Integer>();
    Integer placeMinimumPersons = 0;

    public Integer getPlaceMinimumPersons() {
        return placeMinimumPersons;
    }

    public void setPlaceMinimumPersons(Integer placeMinimumPersons) {
        this.placeMinimumPersons = placeMinimumPersons;
    }

    public Set<Integer> getPersonsList() {
        return personsList;
    }

    public void setPersonsList(Set<Integer> personsList) {
        this.personsList = personsList;
    }
    public Integer getPlaceMaxPersons() {
        return placeMaxPersons;
    }

    public void setPlaceMaxPersons(Integer placeMaxPersons) {
        this.placeMaxPersons = placeMaxPersons;
    }

    public String getStage() {
        return stage;
    }

    public void setStage(String stage) {
        this.stage = stage;
    }

    public List<JsonimgID_2_data> getPlacePhotos() {
        return placePhotos;
    }

    public void setPlacePhotos(List<JsonimgID_2_data> placePhotos) {
        this.placePhotos = placePhotos;
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

    public String getPlaceFax() {
        return placeFax;
    }

    public void setPlaceFax(String placeFax) {
        this.placeFax = placeFax;
    }

    public String getPlaceMail() {
        return placeMail;
    }

    public void setPlaceMail(String placeMail) {
        this.placeMail = placeMail;
    }

    public String getPlaceURL() {
        return placeURL;
    }

    public void setPlaceURL(String placeURL) {
        this.placeURL = placeURL;
    }

    public String getPlaceDescription() {
        return placeDescription;
    }

    public void setPlaceDescription(String placeDescription) {
        this.placeDescription = placeDescription;
    }

    public String getLogosrc() {
        return logosrc;
    }

    public void setLogosrc(String logosrc) {
        this.logosrc = logosrc;
    }


    public WorkingWeek getWorkinghours() {
        return workinghours;
    }

    public void setWorkinghours(WorkingWeek workinghours) {
        this.workinghours = workinghours;
    }

    public List<Integer> getCloseDates() {
        return closeDates;
    }

    public void setCloseDates(List<Integer> closeDates) {
        this.closeDates = closeDates;
    }

    public List<AdminUser> getPlaceEditList() {
        return placeEditList;
    }

    public void setPlaceEditList(List<AdminUser> placeEditList) {
        this.placeEditList = placeEditList;
    }

    public boolean isAutomatic_approval() {
        return automatic_approval;
    }

    public void setAutomatic_approval(boolean automatic_approval) {
        this.automatic_approval = automatic_approval;
    }

    public List<String> getAutomaticApprovalList() {
        return automaticApprovalList;
    }

    public void setAutomaticApprovalList(List<String> automaticApprovalList) {
        this.automaticApprovalList = automaticApprovalList;
    }

    public List<String> getAdminApprovalList() {
        return adminApprovalList;
    }

    public void setAdminApprovalList(List<String> adminApprovalList) {
        this.adminApprovalList = adminApprovalList;
    }

    public List<PPSubmitObject> getFloors() {
        return floors;
    }

    public void setFloors(List<PPSubmitObject> canvasJSON) {
        floors = canvasJSON;
    }

    public Double getUTCoffset() {
        return UTCoffset;
    }

    public void setUTCoffset(Double uTCoffset) {
        UTCoffset = uTCoffset;
    }

    public String getUsernameRandom() {
        return usernameRandom;
    }

    public void setUsernameRandom(String usernameRandom) {
        this.usernameRandom = usernameRandom;
    }

    public List<JsonImageID_2_GCSurl> getJSONimageID2url() {
        return JSONimageID2url;
    }

    public void setJSONimageID2url(List<JsonImageID_2_GCSurl> jSONimageID2url) {
        JSONimageID2url = jSONimageID2url;
    }

    public String getPlaceID() {
        return placeID;
    }

    public void setPlaceID(String placeIDRandom) {
        this.placeID = placeIDRandom;
    }


    public String getUser_() {
        return user_;
    }

    public void setUser_(String user_) {
        this.user_ = user_;
    }

    public String getPlace_() {
        return place_;
    }

    public void setPlace_(String place_) {
        this.place_ = place_;
    }

    public String getSnif_() {
        return snif_;
    }

    public void setSnif_(String snif_) {
        this.snif_ = snif_;
    }

    public List<JsonimgID_2_data> getJSONbyte64files() {
        return JSONbyte64files;
    }

    public void setJSONbyte64files(List<JsonimgID_2_data> jSONbyte64files) {
        JSONbyte64files = jSONbyte64files;
    }

    public List<JsonSID_2_imgID> getJSONSIDlinks() {
        return JSONSIDlinks;
    }

    public void setJSONSIDlinks(List<JsonSID_2_imgID> jSONSIDlinks) {
        JSONSIDlinks = jSONSIDlinks;
    }


}
