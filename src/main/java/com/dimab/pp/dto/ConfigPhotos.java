package com.dimab.pp.dto;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by dima on 02-Mar-16.
 */
public class ConfigPhotos {
    String logosrc = new String();
    List<JsonimgID_2_data> placePhotos =  new ArrayList<JsonimgID_2_data>();

    public String getLogosrc() {
        return logosrc;
    }

    public void setLogosrc(String logosrc) {
        this.logosrc = logosrc;
    }

    public List<JsonimgID_2_data> getPlacePhotos() {
        return placePhotos;
    }

    public void setPlacePhotos(List<JsonimgID_2_data> placePhotos) {
        this.placePhotos = placePhotos;
    }
}
