package com.dimab.pickoplace.controller;

import javax.inject.Singleton;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Singleton
@Produces(MediaType.TEXT_HTML)
@Path("/page/")
public class TestController {

    public TestController() {

    }

    @GET
    @Path("/test/")
    public String test() {
        return "content";
    }
}
