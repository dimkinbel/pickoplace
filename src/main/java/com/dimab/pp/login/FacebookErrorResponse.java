package com.dimab.pp.login;

/**
 * Created by dima on 09-Apr-16.
 */
public class FacebookErrorResponse {
    String message;
    String type;
    Integer code;
    Integer error_subcode;
    String fbtrace_id;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public Integer getError_subcode() {
        return error_subcode;
    }

    public void setError_subcode(Integer error_subcode) {
        this.error_subcode = error_subcode;
    }

    public String getFbtrace_id() {
        return fbtrace_id;
    }

    public void setFbtrace_id(String fbtrace_id) {
        this.fbtrace_id = fbtrace_id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
