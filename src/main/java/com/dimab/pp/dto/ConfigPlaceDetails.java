package com.dimab.pp.dto;

/**
 * Created by dima on 02-Mar-16.
 */
public class ConfigPlaceDetails {
    ConfigGeneral general = new ConfigGeneral();
    ConfigPhotos photos = new ConfigPhotos();

    public ConfigGeneral getGeneral() {
        return general;
    }

    public void setGeneral(ConfigGeneral general) {
        this.general = general;
    }

    public ConfigPhotos getPhotos() {
        return photos;
    }

    public void setPhotos(ConfigPhotos photos) {
        this.photos = photos;
    }
}
