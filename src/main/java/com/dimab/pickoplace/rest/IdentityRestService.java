package com.dimab.pickoplace.rest;

import com.dimab.pickoplace.utils.JsonUtils;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
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

    @POST
    @Path("/info/")
    public IdentityInfo info(@Context HttpServletRequest httpServletRequest,
                             @FormParam("param1") String param1,
                             @FormParam("param2") IdentityInfo param2) {
        IdentityInfo result = new IdentityInfo(httpServletRequest.getSession().getId(), param1);
        result.someData = param1 + param2;
        return result;
    }
    @GET
    @Path("/cancelReservation/")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public BidSidJson cancelReservation(BidSidJson param) {
        return param;
    }
    public final static class BidSidJson {

        @JsonProperty
        private String bid;

        @JsonProperty
        private String sid;

        public BidSidJson() {

        }

        @JsonCreator
        public BidSidJson(@JsonProperty("bid") String bid,
                          @JsonProperty("sid") String sid) {
            this.bid = bid;
            this.sid = sid;
        }

        public static BidSidJson valueOf(String json) {
            return JsonUtils.deserialize(json, BidSidJson.class);
        }
    }
    public final static class IdentityInfo {

        @JsonProperty
        private String sessionId;

        @JsonProperty
        private String someData;

        public IdentityInfo() {

        }

        @JsonCreator
        public IdentityInfo(@JsonProperty("sessionId") String sessionId,
                            @JsonProperty("someData") String someData) {
            this.sessionId = sessionId;
            this.someData = someData;
        }

        public static IdentityInfo valueOf(String json) {
            return JsonUtils.deserialize(json, IdentityInfo.class);
        }
    }
}
