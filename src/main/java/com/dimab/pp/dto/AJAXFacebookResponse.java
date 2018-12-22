package com.dimab.pp.dto;

public class AJAXFacebookResponse {
    private String login;
    private FacebookLoginResponse response = new FacebookLoginResponse();

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public FacebookLoginResponse getResponse() {
        return response;
    }

    public void setResponse(FacebookLoginResponse response) {
        this.response = response;
    }

}
