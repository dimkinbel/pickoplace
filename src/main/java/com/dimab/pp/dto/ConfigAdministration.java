package com.dimab.pp.dto;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by dima on 02-Mar-16.
 */
public class ConfigAdministration {
    List<String> admins = new ArrayList<String>();
    String adminUsername  = "admin";
    String adminPassword = "admin";

    public List<String> getAdmins() {
        return admins;
    }

    public void setAdmins(List<String> admins) {
        this.admins = admins;
    }

    public String getAdminPassword() {
        return adminPassword;
    }

    public void setAdminPassword(String adminPassword) {
        this.adminPassword = adminPassword;
    }

    public String getAdminUsername() {
        return adminUsername;
    }

    public void setAdminUsername(String adminUsername) {
        this.adminUsername = adminUsername;
    }
}
