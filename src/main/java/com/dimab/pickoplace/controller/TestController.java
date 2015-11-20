package com.dimab.pickoplace.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Singleton;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Singleton
@Produces(MediaType.TEXT_HTML)
@Path("/page/")
public class TestController {

    private final static Logger LOG = LoggerFactory.getLogger(TestController.class);

    public TestController() {
        LOG.info("some info!");
    }

    @GET
    @Path("/test/")
    public String test() {
        return "content";
    }
}
