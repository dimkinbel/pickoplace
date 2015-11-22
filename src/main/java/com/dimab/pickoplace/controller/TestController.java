package com.dimab.pickoplace.controller;

import org.glassfish.jersey.server.mvc.Template;
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

    @Template(name = "/page/test")
    @GET
    @Path("/test/")
    public PageModel test() {
        return new PageModel(new UserInfo("Petr"));
    }

    public final static class PageModel {
        private final UserInfo userInfo;

        public PageModel(UserInfo userInfo) {
            this.userInfo = userInfo;
        }

        public UserInfo getUserInfo() {
            return userInfo;
        }
    }

    public final static class UserInfo {
        private final String userName;

        public UserInfo(String userName) {
            this.userName = userName;
        }

        public String getUserName() {
            return userName;
        }
    }
}
