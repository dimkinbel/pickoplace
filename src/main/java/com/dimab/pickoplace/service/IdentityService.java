package com.dimab.pickoplace.service;

import com.dimab.pickoplace.json.JsonValueDescription;
import com.dimab.pickoplace.security.annotations.LoggedIn;
import com.dimab.pickoplace.websession.WebSessionStorage;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import javax.annotation.Nullable;
import javax.inject.Inject;
import javax.inject.Singleton;

@Singleton
public class IdentityService {

    private static final JsonValueDescription<UserInfo> LOGGED_IN_USER = new JsonValueDescription<>("identity.loggedInUser", UserInfo.class);

    private final WebSessionStorage webSessionStorage;

    @Inject
    IdentityService(WebSessionStorage webSessionStorage) {
        this.webSessionStorage = webSessionStorage;
    }

    @Nullable
    public UserInfo getUserInfo() {
        return webSessionStorage.getData(LOGGED_IN_USER);
    }

    public boolean isLoggedIn() {
        // todo(egor): implement

        throw new RuntimeException("not implemented");
    }

    @LoggedIn
    public void logout() {
        // todo(egor): implement

        throw new RuntimeException("not implemented");
    }

    public void login() {
        // todo(egor): implement

        throw new RuntimeException("not implemented");
    }

    public static final class UserInfo {
        @JsonProperty
        private final String userName;

        @JsonCreator
        public UserInfo(@JsonProperty("userName") String userName) {
            this.userName = userName;
        }

        public String getUserName() {
            return userName;
        }
    }
}
