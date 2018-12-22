package com.dimab.pickoplace.rest;

import com.fasterxml.jackson.annotation.JsonProperty;

public class RedirectInformation {
    @JsonProperty
    private final String redirectUrl;


    private RedirectInformation(String redirectUrl) {
        this.redirectUrl = redirectUrl;
    }

    public static RedirectInformation build(String redirectUrl) {
        return new RedirectInformation(redirectUrl);
    }
}
