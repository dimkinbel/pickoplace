package com.dimab.pp.accountRest;

import com.dimab.pickoplace.utils.JsonUtils;
import com.dimab.pp.adminRest.WaiterDeleteBooking;
import com.dimab.pp.database.GetPlaceInfoFactory;
import com.dimab.pp.dto.*;
import com.dimab.pp.functions.RandomStringGenerator;
import com.dimab.pp.login.CheckTokenValid;
import com.dimab.pp.login.GenericUser;
import com.dimab.smsmail.MailSenderFabric;
import com.dimab.smsmail.PlivoSendSMS;
import com.google.appengine.api.datastore.*;
import com.google.gson.reflect.TypeToken;
import com.plivo.helper.api.response.message.MessageResponse;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.lang.reflect.Type;
import java.util.*;

import static com.google.appengine.api.datastore.FetchOptions.Builder.withLimit;

/**
 * Created by dima on 05-Mar-16.
 */
@Path("/configurationUpdate/")
public class ConfigurationRest {
    @POST
    @Path("/removeConfirmationPhone/")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public String removeConfirmationPhone(ConfigurationRestModel param) {
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
            Type closeDateType = new TypeToken<List<String>>() {}.getType();
            List<String> admins = JsonUtils.deserialize((String) userCanvasState.getProperty("adminList"), closeDateType);
            if (admins.contains(param.getUser())) {
                allowedUser = true;

            }
            if (allowedUser) {
                ConfigBookingProperties bookProperties = JsonUtils.deserialize((String)userCanvasState.getProperty("bookingProperties"),ConfigBookingProperties.class);
                List<String> existingPlivoPhones = bookProperties.getApprovalPhones();
                Boolean phoneExists = false;
                PlivoSMSRequestJSON foundPhone = new PlivoSMSRequestJSON();
                for(String plivoData : existingPlivoPhones) {
                    PlivoSMSRequestJSON smsRequestObject = JsonUtils.deserialize(plivoData,PlivoSMSRequestJSON.class);
                    if(smsRequestObject.getNumber().equals(param.getPhone())) {
                        phoneExists = true;
                        foundPhone = smsRequestObject;
                    }

                }
                if(phoneExists) {
                    bookProperties.getApprovalPhones().remove(foundPhone);
                    if(bookProperties.getApprovalPhones().size() > 0 || bookProperties.getApprovalMails().size() > 0) {
                        bookProperties.setAutomatic(false);
                        map.put("automatic", false);
                    } else {
                        bookProperties.setAutomatic(true);
                        map.put("automatic", true);
                    }
                    userCanvasState.setUnindexedProperty("bookingProperties", JsonUtils.serialize(bookProperties));
                    datastore.put(userCanvasState);
                    txn.commit();

                    PlivoSendSMS plivoFabric = new PlivoSendSMS();
                    MessageResponse msgResponse;
                    String message = "Pickoplace.\nYour phone has been removed from Database";
                    if (foundPhone.getCountryData().getIso2().equals("us")) {
                        msgResponse = plivoFabric.sendSMSPlivio("+972526775065", param.getPhone(), message);
                    } else {
                        msgResponse = plivoFabric.sendSMSPlivio("Pickoplace", param.getPhone(), message);
                    }
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
                List<String> existingMails ;
                if(param.getManual() == true) {
                    existingMails = bookProperties.getApprovalMails();
                } else {
                    existingMails = bookProperties.getAutomaticMails();
                }

                if(existingMails.contains(param.getNewAdmin())) {
                    String messageType = "";
                    if(param.getManual() == true) {
                        messageType = "RemoveConfirmationEmail";
                        bookProperties.getApprovalMails().remove(param.getNewAdmin());
                        if (existingMails.size() > 0 || bookProperties.getApprovalPhones().size() > 0) {
                            bookProperties.setAutomatic(false);
                            map.put("automatic", false);
                        } else {
                            bookProperties.setAutomatic(true);
                            map.put("automatic", true);
                        }
                    } else {
                        messageType = "RemoveAutoNotificationEmail";
                        bookProperties.getAutomaticMails().remove(param.getNewAdmin());
                    }
                    userCanvasState.setUnindexedProperty("bookingProperties", JsonUtils.serialize(bookProperties));
                    datastore.put(userCanvasState);
                    txn.commit();
                    GetPlaceInfoFactory placeFactory = new GetPlaceInfoFactory();
                    PlaceInfo placeInfo = placeFactory.getPlaceInfoNoImage(datastore, userCanvasState);
                    MailSenderFabric mailFabric  = new MailSenderFabric();

                    MailModel mmodel = new MailModel();
                    mmodel.setType(messageType);
                    mmodel.setPlaceInfo(placeInfo);
                    mmodel.setTo(param.getNewAdmin());
                    mailFabric.SendEmail(mmodel);

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
                            List<String> existingMails ;
                            if(param.getManual()==true) {
                                existingMails = bookProperties.getApprovalMails();
                            } else {
                                existingMails = bookProperties.getAutomaticMails();
                            }
                            if(!existingMails.contains(param.getNewAdmin())) {
                                existingMails.add(param.getNewAdmin());
                                if(param.getManual()==true) {
                                    bookProperties.setApprovalMails(existingMails);
                                } else {
                                    bookProperties.setAutomaticMails(existingMails);
                                }
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
            ConfigBookingProperties bookProperties = JsonUtils.deserialize((String) userCanvasState.getProperty("bookingProperties"), ConfigBookingProperties.class);
            List<String> existingMails ;
            if(param.getManual()) {
                existingMails = bookProperties.getApprovalMails();
            } else {
                existingMails = bookProperties.getAutomaticMails();
            }

            if (existingMails.contains(param.getNewAdmin())) {
                map.put("valid", false);
                map.put("reason", "exists");
            } else {
                Type closeDateType = new TypeToken<List<String>>() {}.getType();
                List<String> admins = JsonUtils.deserialize((String) userCanvasState.getProperty("adminList"), closeDateType);
                if (admins.contains(param.getUser())) {
                    allowedUser = true;
                    map.put("valid", true);
                }
                if (allowedUser) {
                    Date date = new Date();
                    Entity waitingApproval = new Entity("WaitingApproval");
                    RandomStringGenerator randomGen = new RandomStringGenerator();
                    String verificationCode = randomGen.generateRandomString(4, RandomStringGenerator.Mode.NUMERIC);
                    String transactionToken = randomGen.generateRandomString(20, RandomStringGenerator.Mode.ALPHANUMERIC);
                    waitingApproval.setProperty("pid", param.getPid());

                    waitingApproval.setProperty("type", "mail");
                    waitingApproval.setProperty("mail", param.getNewAdmin());
                    waitingApproval.setProperty("date", date);
                    waitingApproval.setProperty("token", transactionToken);
                    waitingApproval.setProperty("code", verificationCode);


                    GetPlaceInfoFactory placeFactory = new GetPlaceInfoFactory();
                    PlaceInfo placeInfo = placeFactory.getPlaceInfoNoImage(datastore, userCanvasState);
                    MailSenderFabric mailFabric = new MailSenderFabric();
                    MailModel mmodel = new MailModel();

                    mmodel.setPlaceInfo(placeInfo);
                    mmodel.setTo(param.getNewAdmin());
                    mmodel.setVerificationCode(verificationCode);
                    if(param.getManual()) {
                        mmodel.setType("SendVerificationCode");
                        mailFabric.SendEmail(mmodel);
                    } else {
                        mmodel.setType("SendVerificationCodeForAutomatic");
                        mailFabric.SendEmail(mmodel);
                    }
                    datastore.put(waitingApproval);
                    txn.commit();

                    map.put("admin", param.getNewAdmin());
                    map.put("token", transactionToken);
                } else {
                    map.put("reason", "Not allowed user");
                }
            }
        } else {
            map.put("reason","No PID Exists");
        }
        return JsonUtils.serialize(map);
    }
    @POST
    @Path("/verifySMSCode/")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public String verifySMSCode(ConfigurationRestModel param) {
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
                Query.Filter typeFilter  = new Query.FilterPredicate("type",  Query.FilterOperator.EQUAL, "sms");
                Query.Filter adminPhoneFilter  = new Query.FilterPredicate("phone",  Query.FilterOperator.EQUAL, param.getPhone());
                Query.Filter composeFilter = Query.CompositeFilterOperator.and(pidFilter,tokenFilter,typeFilter,adminPhoneFilter);

                Query qv = new Query("WaitingApproval").setFilter(composeFilter);
                PreparedQuery pqv = datastore.prepare(qv);
                Entity verificationEntity = pqv.asSingleEntity();
                if (verificationEntity != null) {
                    Date storedDate = (Date) verificationEntity.getProperty("date");
                    if(date.getTime()/1000 - storedDate.getTime()/1000 <= 60*60) {
                        String savedCode = (String) verificationEntity.getProperty("code");
                        if(savedCode.equals(param.getCode())) {
                            ConfigBookingProperties bookProperties = JsonUtils.deserialize((String)userCanvasState.getProperty("bookingProperties"),ConfigBookingProperties.class);
                            List<String> existingPlivoPhones = bookProperties.getApprovalPhones();
                            Boolean phoneExists = false;
                            for(String plivoData : existingPlivoPhones) {
                                PlivoSMSRequestJSON smsRequestObject = JsonUtils.deserialize(plivoData,PlivoSMSRequestJSON.class);
                                if(smsRequestObject.getNumber().equals(param.getPhone())) {
                                    phoneExists = true;
                                }

                            }
                            if(!phoneExists) {
                                existingPlivoPhones.add((String)verificationEntity.getProperty("smsRequest"));
                                bookProperties.setApprovalPhones(existingPlivoPhones);
                                userCanvasState.setUnindexedProperty("bookingProperties", JsonUtils.serialize(bookProperties));
                                datastore.put(userCanvasState);
                                datastore.delete(verificationEntity.getKey());
                                txn.commit();

                                map.put("reason","success");
                                map.put("phone",param.getPhone());
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
    @Path("/requestAdminCodeBySMS/")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public String requestAdminCodeBySMS(ConfigurationRestModel param) {
        System.out.println("param = [" +  JsonUtils.serialize(param) + "]");
        PlivoSMSRequestJSON smsRequestObject = JsonUtils.deserialize(param.getSmsrequest(),PlivoSMSRequestJSON.class);
        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        TransactionOptions options = TransactionOptions.Builder.withXG(true);
        Transaction txn = datastore.beginTransaction(options);
        Map<String , Object> map = new HashMap<String , Object>();
        Date date = new Date();
        map.put("valid",false);


        Query.Filter placeIdFilter  = new Query.FilterPredicate("placeUniqID", Query.FilterOperator.EQUAL,param.getPid());
        Query q = new Query("CanvasState").setFilter(placeIdFilter);
        PreparedQuery pq = datastore.prepare(q);
        Entity userCanvasState = pq.asSingleEntity();
        boolean allowedUser = false;
        if (userCanvasState != null) {
            ConfigBookingProperties bookProperties = JsonUtils.deserialize((String) userCanvasState.getProperty("bookingProperties"), ConfigBookingProperties.class);
            List<String> existingPhones = bookProperties.getApprovalPhones();
            Boolean phoneExists = false;
            for(String plivoData : existingPhones) {
                PlivoSMSRequestJSON smsRequestJSON = JsonUtils.deserialize(plivoData,PlivoSMSRequestJSON.class);
                if(smsRequestJSON.getNumber().equals(smsRequestObject.getNumber())) {
                    phoneExists = true;
                }

            }
            if (phoneExists) {
                map.put("valid", false);
                map.put("reason", "exists");
            } else {
                Type closeDateType = new TypeToken<List<String>>() {
                }.getType();
                List<String> admins = JsonUtils.deserialize((String) userCanvasState.getProperty("adminList"), closeDateType);
                if (admins.contains(param.getUser())) {
                    allowedUser = true;
                    map.put("valid", true);
                }
                if (allowedUser) {
                    // User allowed to modify
                    Entity waitingApproval = new Entity("WaitingApproval");
                    boolean StoreEntity = false;
                    boolean SendSMS = true;
                    Integer cnt = 1;

                    Query.Filter pidFilter = new Query.FilterPredicate("pid", Query.FilterOperator.EQUAL, param.getPid());
                    Query.Filter phoneFilter = new Query.FilterPredicate("phone", Query.FilterOperator.EQUAL, smsRequestObject.getNumber());
                    Query.Filter composeFilter = Query.CompositeFilterOperator.and(pidFilter, phoneFilter);
                    Query qsame = new Query("WaitingApproval").setFilter(composeFilter).setKeysOnly();

                    PreparedQuery pqsame = datastore.prepare(qsame);
                    Entity result = pqsame.asSingleEntity();
                    if (result != null) {
                        Entity existingPhoneEntity;
                        try {
                            existingPhoneEntity = datastore.get(result.getKey());

                            if (existingPhoneEntity.hasProperty("requestCount")) {
                                cnt = (int) (long) existingPhoneEntity.getProperty("requestCount");
                            } else {
                                cnt = 2;
                            }
                            if (cnt < 3) {
                                cnt += 1;
                                waitingApproval = existingPhoneEntity;
                                StoreEntity = true;
                            } else {
                                Date storedDate = (Date) existingPhoneEntity.getProperty("date");
                                if (date.getTime() / 1000 - storedDate.getTime() / 1000 <= 60 * 60) {
                                    waitingApproval = existingPhoneEntity;
                                    StoreEntity = true;
                                    SendSMS = false;
                                } else {
                                    cnt = 1;
                                    waitingApproval = existingPhoneEntity;
                                    StoreEntity = true;
                                }
                            }


                        } catch (EntityNotFoundException e) {
                            e.printStackTrace();
                            map.put("valid", false);
                            map.put("reason", "datastore_error");
                        }
                    } else {
                        Query.Filter typeFilter = new Query.FilterPredicate("type", Query.FilterOperator.EQUAL, "sms");
                        composeFilter = Query.CompositeFilterOperator.and(pidFilter, typeFilter);
                        Query qtest = new Query("WaitingApproval").setFilter(composeFilter).setKeysOnly();
                        List<Entity> eList = datastore.prepare(qtest).asList(withLimit(5));

                        if (eList.size() >= 5) {
                            // Maximum validation requests (with no answer) is 5
                            map.put("valid", false);
                            map.put("reason", "max_5_phones_not_approved");
                        } else {

                            waitingApproval = new Entity("WaitingApproval");
                            StoreEntity = true;

                        }
                    }
                    if (StoreEntity) {
                        RandomStringGenerator randomGen = new RandomStringGenerator();
                        String verificationCode = randomGen.generateRandomString(4, RandomStringGenerator.Mode.NUMERIC);
                        String transactionToken = randomGen.generateRandomString(20, RandomStringGenerator.Mode.ALPHANUMERIC);
                        waitingApproval.setProperty("pid", param.getPid());
                        waitingApproval.setProperty("type", "sms");
                        waitingApproval.setProperty("phone", smsRequestObject.getNumber());
                        waitingApproval.setProperty("smsRequest", JsonUtils.serialize(smsRequestObject));
                        if (cnt == 1) {
                            waitingApproval.setProperty("date", date);
                        }
                        waitingApproval.setProperty("requestCount", cnt);
                        waitingApproval.setProperty("token", transactionToken);
                        if (SendSMS) {
                            waitingApproval.setProperty("code", verificationCode);
                        } else {
                            // Old verification code should be used
                        }

                        if (SendSMS) {
                            PlivoSendSMS plivoFabric = new PlivoSendSMS();
                            MessageResponse msgResponse;
                            String message = "Pickoplace.\nPlease enter next validation code: " + verificationCode;

                            if (smsRequestObject.getCountryData().getIso2().equals("us")) {
                                msgResponse = plivoFabric.sendSMSPlivio("+972526775065", smsRequestObject.getNumber(), message);
                            } else {
                                msgResponse = plivoFabric.sendSMSPlivio("PickoPlace", smsRequestObject.getNumber(), message);
                            }
                            if (msgResponse == null) {
                                map.put("valid", false);
                                map.put("reason", "sms_error_null");
                            } else {
                                if (msgResponse.serverCode == 202) {
                                    // Print the Message UUID
                                    System.out.println("Message UUID : " + msgResponse.messageUuids.get(0).toString());
                                    datastore.put(waitingApproval);
                                    txn.commit();
                                    map.put("phone", smsRequestObject.getNumber());
                                    map.put("token", transactionToken);
                                } else {
                                    System.out.println(msgResponse.error);
                                    map.put("valid", false);
                                    map.put("reason", "sms_error_null");
                                }
                            }
                        } else {
                            datastore.put(waitingApproval);
                            txn.commit();
                            map.put("phone", smsRequestObject.getNumber());
                            map.put("token", transactionToken);
                            map.put("max5", true);
                        }
                    }
                } else {
                    map.put("reason", "Not allowed user");
                }
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
                MailModel mmodel = new MailModel();

                mmodel.setPlaceInfo(placeInfo);
                mmodel.setTo(param.getNewAdmin());
                mmodel.setType("NewAdminNotification");
                mailFabric.SendEmail(mmodel);
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
                        MailModel mmodel = new MailModel();

                        mmodel.setPlaceInfo(placeInfo);
                        mmodel.setTo(param.getNewAdmin());
                        mmodel.setType("RemoveAdminNotification");
                        mailFabric.SendEmail(mmodel);
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
                datastore.put(userCanvasState);
                txn.commit();
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
        private String smsrequest;
        private String phone;
        private Boolean manual;

        public ConfigurationRestModel() {

        }

        public ConfigurationRestModel(String pid,
                              String user,
                              String newAdmin ,
                               String waiterUsername,
                               String waiterPassword,
                               String token,
                                      String code,
                                      String smsrequest,
                                      String phone,
                                      Boolean manual) {
            this.user = user;
            this.newAdmin = newAdmin;
            this.pid = pid;
            this.waiterUsername = waiterUsername;
            this.waiterPassword = waiterPassword;
            this.token = token;
            this.code = code;
            this.smsrequest = smsrequest;
            this.phone = phone;
            this.manual = manual;
        }

        public Boolean getManual() {
            return manual;
        }

        public void setManual(Boolean manual) {
            this.manual = manual;
        }

        public String getSmsrequest() {
            return smsrequest;
        }

        public void setSmsrequest(String smsrequest) {
            this.smsrequest = smsrequest;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
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
