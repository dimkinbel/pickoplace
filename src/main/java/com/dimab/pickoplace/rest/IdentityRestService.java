package com.dimab.pickoplace.rest;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;


@Produces(MediaType.APPLICATION_JSON)
@Path("/rest/identity/")
public class IdentityRestService {

    @POST
    @Path("/logout/")
    public void logout(@Context HttpServletRequest httpServletRequest) {
        // todo(egor): implement
    }

    @GET
    @Path("/info/")
    public IdentityInfo getInfo(@Context HttpServletRequest httpServletRequest) {
        return new IdentityInfo(httpServletRequest.getSession().getId());
    }

    public final static class IdentityInfo {

        @JsonProperty
        private final String sessionId;

        public IdentityInfo(String sessionId) {
            this.sessionId = sessionId;
        }
    }
}
