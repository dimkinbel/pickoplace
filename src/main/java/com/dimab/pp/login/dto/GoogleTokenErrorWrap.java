package com.dimab.pp.login.dto;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by dima on 10-Apr-16.
 */
public class GoogleTokenErrorWrap {
    List<GoogleErrors> errors = new ArrayList<GoogleErrors>();
    Integer code;
    String message;


    public List<GoogleErrors> getErrors() {
        return errors;
    }

    public void setErrors(List<GoogleErrors> errors) {
        this.errors = errors;
    }

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
