package com.dimab.pp.dto;

/**
 * Created by dima on 05-Apr-16.
 */
public class AdminSetUser {
    String name ="";
    String phone = "";
    String email = "";
    public AdminSetUser() {}
    public AdminSetUser(BookingRequestWrap brw) {
        this.name = brw.getName();
        this.phone = brw.getPhone();
        this.email = brw.getEmail();
    }
    public String getFamily(){
        return "";
    }
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
