package com.dimab.pp.accountRest;

import com.dimab.pickoplace.utils.JsonUtils;
import com.dimab.pp.adminRest.WaiterDeleteBooking;
import com.dimab.pp.database.GetPlaceInfoFactory;
import com.dimab.pp.dto.BookingRequestWrap;
import com.dimab.pp.dto.ConfigBookingProperties;
import com.dimab.pp.dto.PlaceInfo;
import com.dimab.pp.functions.RandomStringGenerator;
import com.dimab.pp.login.CheckTokenValid;
import com.dimab.pp.login.GenericUser;
import com.dimab.smsmail.MailSenderFabric;
import com.google.appengine.api.datastore.*;
import com.google.gson.reflect.TypeToken;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.lang.reflect.Type;
import java.util.*;

/**
 * Created by dima on 05-Mar-16.
 */
@Path("/configurationUpdate/")
public class ConfigurationRest {
    @POST
    @Path("/removeConfirmationMail/")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public String removeConfirmationMail(ConfigurationRestModel param) {
        System.out.println("param = [" + JsonUtils.serialize(param) + "]");
        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        TransactionOptions options = TransactionOptions.Builder.withXG(true);
        Transaction txn = datastore.beginTransaction(options);

        Map<String, Object> map = new HashMap<String, Object>();
        map.put("valid", false);


        Query.Filter placeIdFilter = new Query.FilterPredicate("placeUniqID", Query.FilterOperator.EQUAL, param.getPid());
        Query q = new Query("CanvasState").setFilter(placeIdFilter);
        PreparedQuery pq = datastore.prepare(q);
        Entity userCanvasState = pq.asSingleEntity();
        boolean allowedUser = false;
        if (userCanvasState != null) {
            Type closeDateType = new TypeToken<List<String>>() {
            }.getType();
            List<String> admins = JsonUtils.deserialize((String) userCanvasState.getProperty("adminList"), closeDateType);
            if (admins.contains(param.getUser())) {
                allowedUser = true;

            }
            if (allowedUser) {
                ConfigBookingProperties bookProperties = JsonUtils.deserialize((String)userCanvasState.getProperty("bookingProperties"),ConfigBookingProperties.class);
                List<String> existingMails = bookProperties.getApprovalMails();
                if(existingMails.contains(param.getNewAdmin())) {
                    bookProperties.getApprovalMails().remove(param.getNewAdmin());
                    if(existingMails.size() > 0 || bookProperties.getApprovalPhones().size() > 0) {
                        bookProperties.setAutomatic(false);
                        map.put("automatic", false);
                    } else {
                        bookProperties.setAutomatic(true);
                        map.put("automatic", true);
                    }
                    userCanvasState.setUnindexedProperty("bookingProperties", JsonUtils.serialize(bookProperties));
                    datastore.put(userCanvasState);
                    txn.commit();
                    GetPlaceInfoFactory placeFactory = new GetPlaceInfoFactory();
                    PlaceInfo placeInfo = placeFactory.getPlaceInfoNoImage(datastore, userCanvasState);
                    MailSenderFabric mailFabric  = new MailSenderFabric();
                    mailFabric.SendEmail("RemoveConfirmationEmail","pickoplace@appspot.gserviceaccount.com", param.getNewAdmin(),new BookingRequestWrap(), placeInfo,"");

                    map.put("valid", true);
                } else {
                    map.put("reason", "No_such_confirmation_exists");
                    map.put("valid", false);
                }

            } else {
                map.put("reason","Not allowed user");
            }
        } else {
            map.put("reason","No PID Exists");
        }
        return JsonUtils.serialize(map);
    }
    @POST
    @Path("/verifyMailCode/")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public String verifyMailCode(ConfigurationRestModel param) {
        System.out.println("param = [" +  JsonUtils.serialize(param) + "]");
        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        TransactionOptions options = TransactionOptions.Builder.withXG(true);
        Transaction txn = datastore.beginTransaction(options);

        Map<String , Object> map = new HashMap<String , Object>();
        map.put("valid",false);


        Query.Filter placeIdFilter  = new Query.FilterPredicate("placeUniqID", Query.FilterOperator.EQUAL,param.getPid());
        Query q = new Query("CanvasState").setFilter(placeIdFilter);
        PreparedQuery pq = datastore.prepare(q);
        Entity userCanvasState = pq.asSingleEntity();
        boolean allowedUser = false;
        if (userCanvasState != null) {
            Type closeDateType = new TypeToken<List<String>>(){}.getType();
            List<String> admins = JsonUtils.deserialize((String) userCanvasState.getProperty("adminList"),closeDateType);
            if(admins.contains(param.getUser())) {
                allowedUser = true;
                map.put("valid",true);
            }
            if(allowedUser) {
                Date date = new Date();
                Query.Filter pidFilter  = new Query.FilterPredicate("pid", Query.FilterOperator.EQUAL,param.getPid());
                Query.Filter tokenFilter  = new Query.FilterPredicate("token", Query.FilterOperator.EQUAL,param.getToken());
                Query.Filter typeFilter  = new Query.FilterPredicate("type",  Query.FilterOperator.EQUAL, "mail");
                Query.Filter adminMailFilter  = new Query.FilterPredicate("mail",  Query.FilterOperator.EQUAL, param.getNewAdmin());
                Query.Filter composeFilter = Query.CompositeFilterOperator.and(pidFilter,tokenFilter,typeFilter,adminMailFilter);

                Query qv = new Query("WaitingApproval").setFilter(composeFilter);
                PreparedQuery pqv = datastore.prepare(qv);
                Entity verificationEntity = pqv.asSingleEntity();
                if (verificationEntity != null) {
                    Date storedDate = (Date) verificationEntity.getProperty("date");
                    if(date.getTime()/1000 - storedDate.getTime()/1000 <= 10*60) {
                        String savedCode = (String) verificationEntity.getProperty("code");
                        if(savedCode.equals(param.getCode())) {
                            ConfigBookingProperties bookProperties = JsonUtils.deserialize((String)userCanvasState.getProperty("bookingProperties"),ConfigBookingProperties.class);
                            List<String> existingMails = bookProperties.getApprovalMails();
                            if(!existingMails.contains(param.getNewAdmin())) {
                                existingMails.add(param.getNewAdmin());
                                bookProperties.setApprovalMails(existingMails);
                                userCanvasState.setUnindexedProperty("bookingProperties", JsonUtils.serialize(bookProperties));
                                datastore.put(userCanvasState);
                                datastore.delete(verificationEntity.getKey());
                                txn.commit();

                                map.put("reason","success");
                                map.put("admin",param.getNewAdmin());
                            } else {
                                map.put("valid",false);
                                map.put("reason","admin_exists");
                            }
                        } else {
                            map.put("valid",false);
                            map.put("reason","wrong_code");
                        }
                    } else {
                        map.put("valid",false);
                        map.put("reason","time_pass");
                    }
                } else {
                    map.put("valid",false);
                    map.put("reason","no_stored_request");
                }
            } else {
                map.put("reason","Not allowed user");
            }
        } else {
            map.put("reason","No PID Exists");
        }
        return JsonUtils.serialize(map);
    }
    @POST
    @Path("/requestAdminCodeByMail/")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public String requestAdminCodeByMail(ConfigurationRestModel param) {
        System.out.println("param = [" +  JsonUtils.serialize(param) + "]");
        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        TransactionOptions options = TransactionOptions.Builder.withXG(true);
        Transaction txn = datastore.beginTransaction(options);

        Map<String , Object> map = new HashMap<String , Object>();
        map.put("valid",false);


        Query.Filter placeIdFilter  = new Query.FilterPredicate("placeUniqID", Query.FilterOperator.EQUAL,param.getPid());
        Query q = new Query("CanvasState").setFilter(placeIdFilter);
        PreparedQuery pq = datastore.prepare(q);
        Entity userCanvasState = pq.asSingleEntity();
        boolean allowedUser = false;
        if (userCanvasState != null) {
            Type closeDateType = new TypeToken<List<String>>(){}.getType();
            List<String> admins = JsonUtils.deserialize((String) userCanvasState.getProperty("adminList"),closeDateType);
            if(admins.contains(param.getUser())) {
                allowedUser = true;
                map.put("valid",true);
            }
            if(allowedUser) {
                Date date = new Date();
                Entity waitingApproval = new Entity("WaitingApproval" );
                RandomStringGenerator randomGen = new RandomStringGenerator();
                String verificationCode =  randomGen.generateRandomString(4,RandomStringGenerator.Mode.NUMERIC);
                String transactionToken =  randomGen.generateRandomString(20,RandomStringGenerator.Mode.ALPHANUMERIC);
                waitingApproval.setProperty("pid",param.getPid());
                waitingApproval.setProperty("type","mail");
                waitingApproval.setProperty("mail",param.getNewAdmin());
                waitingApproval.setProperty("date",date);
                waitingApproval.setProperty("token",transactionToken);
                waitingApproval.setProperty("code",verificationCode);


                GetPlaceInfoFactory placeFactory = new GetPlaceInfoFactory();
                PlaceInfo placeInfo = placeFactory.getPlaceInfoNoImage(datastore, userCanvasState);
                MailSenderFabric mailFabric  = new MailSenderFabric();
                mailFabric.SendEmail("SendVerificationCode","pickoplace@appspot.gserviceaccount.com", param.getNewAdmin(),new BookingRequestWrap(), placeInfo,verificationCode);
                datastore.put(waitingApproval);
                txn.commit();

                map.put("admin",param.getNewAdmin());
                map.put("token",transactionToken);
            } else {
                map.put("reason","Not allowed user");
            }
        } else {
            map.put("reason","No PID Exists");
        }



        return JsonUtils.serialize(map);
    }
    @POST
    @Path("/updateAdminMail/")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public String addAdminEmail(ConfigurationRestModel param) {
        System.out.println("param = [" +  JsonUtils.serialize(param) + "]");
        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        TransactionOptions options = TransactionOptions.Builder.withXG(true);
        Transaction txn = datastore.beginTransaction(options);

        Map<String , Object> map = new HashMap<String , Object>();
        map.put("valid",false);


        Query.Filter placeIdFilter  = new Query.FilterPredicate("placeUniqID", Query.FilterOperator.EQUAL,param.getPid());
        Query q = new Query("CanvasState").setFilter(placeIdFilter);
        PreparedQuery pq = datastore.prepare(q);
        Entity userCanvasState = pq.asSingleEntity();
        boolean allowedUser = false;
        if (userCanvasState != null) {
            Type closeDateType = new TypeToken<List<String>>(){}.getType();
            List<String> admins = JsonUtils.deserialize((String) userCanvasState.getProperty("adminList"),closeDateType);
            if(admins.contains(param.getUser())) {
                allowedUser = true;
                map.put("valid",true);
            }
            if(allowedUser) {
                admins.add(param.getNewAdmin());
                // Uniqify ArrayList
                Set<String> hs = new HashSet<>();
                hs.addAll(admins);
                admins.clear();
                admins.addAll(hs);
                //-------------------------------

                userCanvasState.setUnindexedProperty("adminList", JsonUtils.serialize(admins));
                GetPlaceInfoFactory placeFactory = new GetPlaceInfoFactory();
                PlaceInfo placeInfo = placeFactory.getPlaceInfoNoImage(datastore, userCanvasState);
                MailSenderFabric mailFabric  = new MailSenderFabric();
                mailFabric.SendEmail("NewAdminNotification","pickoplace@appspot.gserviceaccount.com", param.getNewAdmin(),new BookingRequestWrap(), placeInfo,"");
                datastore.put(userCanvasState);
                txn.commit();

                map.put("admin",param.getNewAdmin());
            } else {
                map.put("reason","Not allowed user");
            }
        } else {
            map.put("reason","No PID Exists");
        }



        return JsonUtils.serialize(map);
    }

    @POST
    @Path("/removeAdminMail/")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public String removeAdminEmail(ConfigurationRestModel param) {
        System.out.println("param = [" + JsonUtils.serialize(param) + "]");
        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        TransactionOptions options = TransactionOptions.Builder.withXG(true);
        Transaction txn = datastore.beginTransaction(options);

        Map<String, Object> map = new HashMap<String, Object>();
        map.put("valid", false);


        Query.Filter placeIdFilter = new Query.FilterPredicate("placeUniqID", Query.FilterOperator.EQUAL, param.getPid());
        Query q = new Query("CanvasState").setFilter(placeIdFilter);
        PreparedQuery pq = datastore.prepare(q);
        Entity userCanvasState = pq.asSingleEntity();
        boolean allowedUser = false;
        if (userCanvasState != null) {
            Type closeDateType = new TypeToken<List<String>>() {
            }.getType();
            List<String> admins = JsonUtils.deserialize((String) userCanvasState.getProperty("adminList"), closeDateType);
            if (admins.contains(param.getUser())) {
                allowedUser = true;

            }
            if (allowedUser) {
                if(admins.size()>1) {
                    if(!param.getNewAdmin().equals(param.getUser())) {
                        admins.remove(param.getNewAdmin());
                        map.put("valid", true);
                        userCanvasState.setUnindexedProperty("adminList", JsonUtils.serialize(admins));
                        GetPlaceInfoFactory placeFactory = new GetPlaceInfoFactory();
                        PlaceInfo placeInfo = placeFactory.getPlaceInfoNoImage(datastore, userCanvasState);
                        MailSenderFabric mailFabric  = new MailSenderFabric();
                        mailFabric.SendEmail("RemoveAdminNotification","pickoplace@appspot.gserviceaccount.com", param.getNewAdmin(),new BookingRequestWrap(), placeInfo,"");
                        datastore.put(userCanvasState);
                        txn.commit();
                    } else {
                        map.put("reason","User cannot delete himself");
                    }
                } else {
                    map.put("reason","At least one admin should exist");
                }
            } else {
                map.put("reason","Not allowed user");
            }
        } else {
            map.put("reason","No PID Exists");
        }
        return JsonUtils.serialize(map);
    }
    @POST
    @Path("/updatePassword/")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public String updatePassword(ConfigurationRestModel param) {
        System.out.println("param = [" + JsonUtils.serialize(param) + "]");
        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        TransactionOptions options = TransactionOptions.Builder.withXG(true);
        Transaction txn = datastore.beginTransaction(options);

        Map<String, Object> map = new HashMap<String, Object>();
        map.put("valid", false);


        Query.Filter placeIdFilter = new Query.FilterPredicate("placeUniqID", Query.FilterOperator.EQUAL, param.getPid());
        Query q = new Query("CanvasState").setFilter(placeIdFilter);
        PreparedQuery pq = datastore.prepare(q);
        Entity userCanvasState = pq.asSingleEntity();
        boolean allowedUser = false;
        if (userCanvasState != null) {
            Type closeDateType = new TypeToken<List<String>>() {
            }.getType();
            List<String> admins = JsonUtils.deserialize((String) userCanvasState.getProperty("adminList"), closeDateType);
            if (admins.contains(param.getUser())) {
                allowedUser = true;
                map.put("valid", true);
            }
            if (allowedUser) {
                userCanvasState.setProperty("Admin_username", param.getWaiterUsername());
                userCanvasState.setProperty("Admin_password", param.getWaiterPassword());
            } else {
                map.put("reason","Not allowed user");
            }
        } else {
            map.put("reason","No PID Exists");
        }
        return JsonUtils.serialize(map);
    }
    public final static class ConfigurationRestModel {
        private String pid;
        private String user;
        private String newAdmin;
        private String waiterUsername;
        private String waiterPassword;
        private String token;
        private String code;

        public ConfigurationRestModel() {

        }

        public ConfigurationRestModel(String pid,
                              String user,
                              String newAdmin ,
                               String waiterUsername,
                               String waiterPassword,
                                      String token,
                                      String code) {
            this.user = user;
            this.newAdmin = newAdmin;
            this.pid = pid;
            this.waiterUsername = waiterUsername;
            this.waiterPassword = waiterPassword;
            this.token = token;
            this.code = code;
        }

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }

        public String getWaiterUsername() {
            return waiterUsername;
        }

        public void setWaiterUsername(String waiterUsername) {
            this.waiterUsername = waiterUsername;
        }

        public String getWaiterPassword() {
            return waiterPassword;
        }

        public void setWaiterPassword(String waiterPassword) {
            this.waiterPassword = waiterPassword;
        }

        public String getNewAdmin() {
            return newAdmin;
        }

        public void setNewAdmin(String newAdmin) {
            this.newAdmin = newAdmin;
        }

        public String getUser() {
            return user;
        }

        public void setUser(String user) {
            this.user = user;
        }

        public String getPid() {
            return pid;
        }

        public void setPid(String pid) {
            this.pid = pid;
        }
    }
    }
