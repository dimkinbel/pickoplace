package com.dimab.pp.adminRest;
import com.dimab.pickoplace.utils.JsonUtils;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by dima on 26-Nov-15.
 */

@Path("/adminRequest/")
public class WaiterRestService {

    @POST
    @Path("/cancelUserBooking/")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public String cancelReservation(AdminRestModel param) {
        System.out.println("param = [" +  JsonUtils.serialize(param) + "]");
        WaiterDeleteBooking deleteBookingService = new WaiterDeleteBooking();
        boolean removed = deleteBookingService.deleteBooking(param.getBid(),param.getPlaceName(),param.getBranch(),param.getAddress());
        Map<String , Object> map = new HashMap<String , Object>();
        map.put("removed",removed);
        return JsonUtils.serialize(map);
    }

    public final static class AdminRestModel {
        private String bid;
        private String sid;
        private String pid;
        private String placeName;
        private String branch;
        private String userMail;
        private String address;
        public AdminRestModel() {

        }
        public AdminRestModel(String bid,
                              String sid,
                              String pid,
                              String placeName,
                              String branch,
                              String userMail,
                              String address) {
            this.bid = bid;
            this.sid = sid;
            this.pid = pid;
            this.placeName = placeName;
            this.branch = branch;
            this.userMail = userMail;
            this.address = address;
        }

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }

        public String getPid() {
            return pid;
        }

        public void setPid(String pid) {
            this.pid = pid;
        }

        public String getPlaceName() {
            return placeName;
        }

        public void setPlaceName(String placeName) {
            this.placeName = placeName;
        }

        public String getBranch() {
            return branch;
        }

        public void setBranch(String branch) {
            this.branch = branch;
        }

        public String getUserMail() {
            return userMail;
        }

        public void setUserMail(String userMail) {
            this.userMail = userMail;
        }

        public String getBid() {
            return bid;
        }
        public void setBid(String bid) {
            this.bid = bid;
        }
        public String getSid() {
            return sid;
        }
        public void setSid(String sid) {
            this.sid = sid;
        }
    }
}
