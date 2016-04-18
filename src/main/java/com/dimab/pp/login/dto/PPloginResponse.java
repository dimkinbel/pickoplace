package com.dimab.pp.login.dto;

/**
 * Created by dima on 12-Apr-16.
 */
public class PPloginResponse {
    boolean valid = false;
    String token;
    PPuser ppuser;
    Integer expire;

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public PPuser getPpuser() {
        return ppuser;
    }

    public void setPpuser(PPuser ppuser) {
        this.ppuser = ppuser;
    }

    public Integer getExpire() {
        return expire;
    }

    public void setExpire(Integer expire) {
        this.expire = expire;
    }
}
