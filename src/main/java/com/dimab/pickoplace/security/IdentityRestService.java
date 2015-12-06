package com.dimab.pickoplace.security;

import com.dimab.pickoplace.rest.RedirectInformation;
import com.dimab.pickoplace.rest.RestService;
import com.dimab.pickoplace.security.annotations.LoggedIn;
import com.dimab.pickoplace.service.IdentityService;
import com.fasterxml.jackson.annotation.JsonProperty;

import javax.inject.Inject;
import javax.inject.Singleton;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;


@Singleton
@Produces(MediaType.APPLICATION_JSON)
@Path("/rest/identity/")
public class IdentityRestService implements RestService {

    private final IdentityService identityService;

    @Inject
    IdentityRestService(IdentityService identityService) {
        this.identityService = identityService;
    }

    @POST
    @Path("/login/")
    public RedirectInformation login(@FormParam("login") String login,
                                     @FormParam("password") String password) {
        // todo(egor): implement
        identityService.login();

        throw new RuntimeException("not implemented");
    }

    @LoggedIn
    // @POST
    @GET
    @Path("/logout/")
    public String logout(@Context HttpServletRequest httpServletRequest) {
        // todo(egor): implement
        identityService.logout();
        return "!";
    }

    @GET
    @Path("/info/")
    public IdentityInfo getInfo() {
        IdentityService.UserInfo userInfo = identityService.getUserInfo();
        return new IdentityInfo(userInfo == null ? "anonym" : userInfo.getUserName());
    }

    public final static class IdentityInfo {

        @JsonProperty
        private final String userName;

        public IdentityInfo(String userName) {
            this.userName = userName;
        }
    }
}
