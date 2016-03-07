package com.dimab.pp.dto;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by dima on 02-Mar-16.
 */
public class ConfigurationObject {
    String stage  = new String();
    ConfigPlaceDetails placeDetails = new ConfigPlaceDetails();
    ConfigWokingHours workinghours = new ConfigWokingHours();
    String placeID = new String();
    String usernameRandom = new String();
    List<PPSubmitObject> floors = new ArrayList<PPSubmitObject>();
    List<JsonimgID_2_data> JSONbyte64files = new ArrayList<JsonimgID_2_data>();
    List<JsonSID_2_imgID> JSONSIDlinks = new ArrayList<JsonSID_2_imgID>();
    List<JsonImageID_2_GCSurl> JSONimageID2url = new ArrayList<JsonImageID_2_GCSurl>();

    ConfigBookingProperties bookingProperties = new ConfigBookingProperties();
    ConfigAdministration administration = new ConfigAdministration();
    List<iFrameObj> iframeList =  new ArrayList<iFrameObj>();

    public void UpdateDataFromAJAX(AJAXImagesJSON CanvasStateEdit) {
        // Still to update
        //   bookingProperties
        //   administration
        //   iframeList
        ConfigGeneral general = new ConfigGeneral();
        general.setAddress(CanvasStateEdit.getAddress());
        general.setPlaceName(CanvasStateEdit.getPlaceName());
        general.setBranchName(CanvasStateEdit.getBranchName());
        general.setLat(CanvasStateEdit.getLat());
        general.setLng(CanvasStateEdit.getLng());
        general.setPlaceDescription(CanvasStateEdit.getPlaceDescription());
        general.setPlaceFax(CanvasStateEdit.getPlaceFax());
        general.setPlaceMail(CanvasStateEdit.getPlaceMail());
        general.setPlacePhone(CanvasStateEdit.getPlacePhone());
        general.setPlaceURL(CanvasStateEdit.getPlaceURL());
        general.setUTCoffset(CanvasStateEdit.getUTCoffset());
        this.placeDetails.setGeneral(general);

        ConfigPhotos photos = new ConfigPhotos();
        photos.setLogosrc(CanvasStateEdit.getLogosrc());
        photos.setPlacePhotos(CanvasStateEdit.getPlacePhotos());
        this.placeDetails.setPhotos(photos);

        this.placeID=CanvasStateEdit.getPlaceID();
        this.usernameRandom = CanvasStateEdit.getUsernameRandom();
        this.floors = CanvasStateEdit.getFloors();
        this.JSONbyte64files = CanvasStateEdit.getJSONbyte64files();
        this.JSONSIDlinks = CanvasStateEdit.getJSONSIDlinks();
        this.JSONimageID2url = CanvasStateEdit.getJSONimageID2url();
        WorkingWeek workingWeek = CanvasStateEdit.getWorkinghours();
        List<Integer> closeDates = CanvasStateEdit.getCloseDates();
        this.workinghours.setWorkingWeek(workingWeek);
        this.workinghours.setCloseDates(closeDates);
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

    public void setJSONimageID2url(List<JsonImageID_2_GCSurl> JSONimageID2url) {
        this.JSONimageID2url = JSONimageID2url;
    }

    public String getStage() {
        return stage;
    }

    public void setStage(String stage) {
        this.stage = stage;
    }

    public ConfigPlaceDetails getPlaceDetails() {
        return placeDetails;
    }

    public void setPlaceDetails(ConfigPlaceDetails placeDetails) {
        this.placeDetails = placeDetails;
    }

    public ConfigWokingHours getWorkinghours() {
        return workinghours;
    }

    public void setWorkinghours(ConfigWokingHours workinghours) {
        this.workinghours = workinghours;
    }

    public String getPlaceID() {
        return placeID;
    }

    public void setPlaceID(String placeID) {
        this.placeID = placeID;
    }

    public List<PPSubmitObject> getFloors() {
        return floors;
    }

    public void setFloors(List<PPSubmitObject> floors) {
        this.floors = floors;
    }

    public List<JsonimgID_2_data> getJSONbyte64files() {
        return JSONbyte64files;
    }

    public void setJSONbyte64files(List<JsonimgID_2_data> JSONbyte64files) {
        this.JSONbyte64files = JSONbyte64files;
    }

    public ConfigBookingProperties getBookingProperties() {
        return bookingProperties;
    }

    public void setBookingProperties(ConfigBookingProperties bookingProperties) {
        this.bookingProperties = bookingProperties;
    }

    public List<iFrameObj> getIframeList() {
        return iframeList;
    }

    public void setIframeList(List<iFrameObj> iframeList) {
        this.iframeList = iframeList;
    }

    public ConfigAdministration getAdministration() {
        return administration;
    }

    public void setAdministration(ConfigAdministration administration) {
        this.administration = administration;
    }

    public List<JsonSID_2_imgID> getJSONSIDlinks() {
        return JSONSIDlinks;
    }

    public void setJSONSIDlinks(List<JsonSID_2_imgID> JSONSIDlinks) {
        this.JSONSIDlinks = JSONSIDlinks;
    }
}
