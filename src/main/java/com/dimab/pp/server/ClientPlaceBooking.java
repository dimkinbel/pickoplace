package com.dimab.pp.server;

import java.io.IOException;
import java.lang.reflect.Type;
import java.text.SimpleDateFormat;
import java.util.*;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.dimab.pickoplace.utils.JsonUtils;
import com.dimab.pp.channel.ChannelMessageFactory;
import com.dimab.pp.database.FreePlaceFactory;
import com.dimab.pp.database.GetAJAXimageJSONfromCSfactory;
import com.dimab.pp.database.GetPlaceInfoFactory;
import com.dimab.pp.dto.*;
import com.dimab.pp.functions.RandomStringGenerator;
import com.dimab.pp.login.CheckTokenValid;
import com.dimab.pp.login.GenericUser;
import com.dimab.smsmail.MailSenderFabric;
import com.dimab.smsmail.PlivoSendSMS;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Text;
import com.google.appengine.api.datastore.Transaction;
import com.google.appengine.api.datastore.TransactionOptions;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.gson.reflect.TypeToken;
import com.plivo.helper.api.response.message.MessageResponse;


public class ClientPlaceBooking extends HttpServlet {
    private static final long serialVersionUID = 1L;

    public ClientPlaceBooking() {
        super();
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        String jsonString = request.getParameter("booking");
        Map<String, Object> map = new HashMap<String, Object>();

        String username_email = new String();
        CheckTokenValid tokenValid = new CheckTokenValid(request);
        GenericUser genuser = new GenericUser();
        try {
            genuser = tokenValid.getUser();
        } catch (NullPointerException e) {
            String returnurl = "/welcome.jsp";
            response.addHeader("Access-Control-Allow-Origin", "*");
            response.sendRedirect(returnurl);
        }
        if (genuser == null) {
            map.put("added", false);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(JsonUtils.serialize(map));
            return;
        } else {
            username_email = genuser.getEmail();
        }

        BookingRequestWrap bookingRequestsWrap = JsonUtils.deserialize(jsonString, BookingRequestWrap.class);
        // Check available by place open or time passed (1min)
        Date current = new Date();
        Long utcTimeSeconds = current.getTime() / 1000;
        Long time = current.getTime() / 1000 + (long) (bookingRequestsWrap.getPlaceOffcet()) * 3600L;
        Date placeDateCurent = new Date(time * 1000L);
        System.out.println("Current time at place (offset=" + bookingRequestsWrap.getPlaceOffcet() * 3600 + "): " + placeDateCurent + " (" + time + ")");
        boolean bookAvailable = true;

        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        TransactionOptions options = TransactionOptions.Builder.withXG(true);
        Transaction txn = datastore.beginTransaction(options);

        map.put("added", true);


        map.put("bid", bookingRequestsWrap.getBookID());

        List<BookingRequest> bookingRequests = bookingRequestsWrap.getBookingList();

        Long fromSeconds = bookingRequestsWrap.getDateSeconds() + bookingRequestsWrap.getTime();
        Long UTCdateProper = bookingRequestsWrap.getDateSeconds() - bookingRequestsWrap.getClientOffset() * 60;

        Long secondsRelativeToClient = fromSeconds - bookingRequestsWrap.getClientOffset() * 60 - (long) (bookingRequestsWrap.getPlaceOffcet() * 3600);
        Long endBookingAsSeenAtUTC = secondsRelativeToClient + bookingRequestsWrap.getPeriod().longValue();
        Date PlaceLocalTime = new Date((secondsRelativeToClient + (long) (bookingRequestsWrap.getPlaceOffcet() * 3600)) * 1000);
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(PlaceLocalTime);
        Calendar endCalendar = calendar;
        endCalendar.add(Calendar.SECOND, bookingRequestsWrap.getPeriod());
        calendar.get(Calendar.DAY_OF_MONTH);
        Boolean endOnNextDay = false;
        if (calendar.get(Calendar.DAY_OF_MONTH) != endCalendar.get(Calendar.DAY_OF_MONTH)) {
            endOnNextDay = true;
        }
        bookingRequestsWrap.setClientid(username_email);
        bookingRequestsWrap.setUser(genuser);
        bookingRequestsWrap.setPlaceLocalTime(PlaceLocalTime);
        String sessionPhone = (String) request.getSession().getAttribute("phone");
        boolean usedUsersEntity = false;
        Entity userEntity;
        if (sessionPhone == null || sessionPhone.isEmpty()) {
            usedUsersEntity = true;
            Filter UserEmail = new FilterPredicate("username", FilterOperator.EQUAL, genuser.getEmail());
            Query q = new Query("Users").setFilter(UserEmail);
            PreparedQuery pq = datastore.prepare(q);
            userEntity = pq.asSingleEntity();
            if (userEntity == null) {
                // TBD: Cant find user Entity
            } else {
                sessionPhone = (String) userEntity.getProperty("phone");
            }
        }
        bookingRequestsWrap.setPhone(sessionPhone);
        System.out.println(sessionPhone);
        // Get CanvasState by PID
        Filter pidFilter = new FilterPredicate("placeUniqID", FilterOperator.EQUAL, bookingRequestsWrap.getPid());
        Query sq_ = new Query("CanvasState").setFilter(pidFilter);
        PreparedQuery psq_ = datastore.prepare(sq_);
        Entity canvasEntity = psq_.asSingleEntity();
        Key canvasKey = canvasEntity.getKey();
        Integer bookingsMade;
        if (canvasEntity.getProperty("bookingsCount") != null) {
            bookingsMade = (int) (long) canvasEntity.getProperty("bookingsCount");
            bookingsMade += 1;
            canvasEntity.setUnindexedProperty("bookingsCount", bookingsMade);
        } else {
            bookingsMade = 1;
            canvasEntity.setUnindexedProperty("bookingsCount", bookingsMade);
        }
        ConfigBookingProperties bookingProperties = JsonUtils.deserialize((String) canvasEntity.getProperty("bookingProperties"), ConfigBookingProperties.class);
        GetPlaceInfoFactory placeFactory = new GetPlaceInfoFactory();
        PlaceInfo placeInfo = placeFactory.getPlaceInfoNoImage(datastore, canvasEntity);
        GetAJAXimageJSONfromCSfactory canvasJsonFactory = new GetAJAXimageJSONfromCSfactory();
        Text bookingListGSON = new Text(JsonUtils.serialize(bookingRequests));
        Entity bookingOrder = new Entity("BookingOrders", canvasKey);
        bookingOrder.setUnindexedProperty("bookingList", bookingListGSON);
        bookingOrder.setProperty("clientid", username_email);
        bookingOrder.setUnindexedProperty("placeName", (String) canvasEntity.getProperty("placeName"));
        bookingOrder.setUnindexedProperty("placeBranchName", (String) canvasEntity.getProperty("placeBranchName"));
        bookingOrder.setUnindexedProperty("address", (String) canvasEntity.getProperty("address"));
        bookingOrder.setUnindexedProperty("genuser", JsonUtils.serialize(genuser));
        bookingOrder.setUnindexedProperty("UTCdateProper", UTCdateProper);
        bookingOrder.setUnindexedProperty("userPhone", sessionPhone);

        bookingOrder.setProperty("DateWhenOrderMade_atUTC", current);
        bookingOrder.setProperty("DateWhenOrderMadeSeconds_atUTC", current.getTime());
        bookingOrder.setProperty("bid", bookingRequestsWrap.getBookID());
        bookingOrder.setProperty("Date", PlaceLocalTime);
        bookingOrder.setProperty("UTCstartSeconds", secondsRelativeToClient);// Seconds as seen at UTC
        bookingOrder.setProperty("pid", bookingRequestsWrap.getPid());
        bookingOrder.setProperty("periodSeconds", bookingRequestsWrap.getPeriod());
        bookingOrder.setProperty("weekday", bookingRequestsWrap.getWeekday());
        if (bookingRequestsWrap.getTextRequest() != null && !bookingRequestsWrap.getTextRequest().isEmpty()) {
            bookingOrder.setUnindexedProperty("userTextRequest", bookingRequestsWrap.getTextRequest());
        }
        bookingOrder.setProperty("weekday", bookingRequestsWrap.getWeekday());
        bookingOrder.setProperty("num", bookingsMade);
        bookingOrder.setUnindexedProperty("bookingViewData",JsonUtils.serialize(canvasJsonFactory.getBookingViewData(canvasEntity,bookingRequestsWrap)));

        List<Integer> closeDates = placeInfo.getCloseDates();

        WorkingWeek weekdaysObject = placeInfo.getWeekdaysObject();


        // Check max Available sids
        if (bookingProperties.getSidUnlimited() == false && (bookingProperties.getMaxSids() > bookingRequests.size())) {
            bookAvailable = false;
            map.put("reason", "מעל מקסימום המותר");
        }
        // Check time passed for booking
        if (utcTimeSeconds > secondsRelativeToClient) {
            System.out.println("Plase time passed:\n   UTCTime = " + utcTimeSeconds + "\n   bookTime=" + secondsRelativeToClient);
            bookAvailable = false;
            map.put("reason", "זמן עבר");
        }

        if (canvasEntity != null && bookAvailable) {


            List<SingleTimeRangeLong> tempRanges = weekdaysObject.getRangesList(bookingRequestsWrap.getWeekday(), 2);

            // Check for dates the place is close (set by Administrator)
            if (closeDates.contains(UTCdateProper)) {
                tempRanges = weekdaysObject.deleteRangeFromList(tempRanges, 0, 86400);
            }
            if (closeDates.contains(UTCdateProper + 86400)) {
                tempRanges = weekdaysObject.deleteRangeFromList(tempRanges, 86400, 2 * 86400);
            }
            // Check ranges
            Integer bookFrom = bookingRequestsWrap.getTime();
            Integer bookTo = bookingRequestsWrap.getTime() + bookingRequestsWrap.getPeriod();
            if (weekdaysObject.isInRangeList(tempRanges, bookFrom, bookTo)) {

            } else {
                System.out.println("Place closed! Open ranges :" + JsonUtils.serialize(tempRanges));
                System.out.println("            Booking range :" + bookFrom + "-" + bookTo);
                bookAvailable = false;
                map.put("reason", "מקום סגור");
            }
        }
        List<Entity> shapesEntities = new ArrayList<Entity>();
        Integer totalPersons = 0;
        if (bookAvailable) {
            // Check available places by shapes (else delete BookingOrders entity) isAvailable
            List<Entity> shapeEntities = new ArrayList<Entity>();
            boolean allAvailable = true;
            for (BookingRequest bookingRequest : bookingRequests) {

                Filter sidFilter = new FilterPredicate("sid", FilterOperator.EQUAL, bookingRequest.getSid());
                Query sq = new Query("Shapes").setFilter(sidFilter);
                PreparedQuery psq = datastore.prepare(sq);
                Entity shapeEntity = psq.asSingleEntity();
                if (shapeEntity != null) {
                    Key shapeKey = shapeEntity.getKey();
                    shapesEntities.add(shapeEntity);
                    SingleTimeRangeLong OrderBid = new SingleTimeRangeLong();
                    OrderBid.setBid(bookingRequest.getBookID());
                    OrderBid.setFrom(secondsRelativeToClient);
                    OrderBid.setTo(secondsRelativeToClient + bookingRequest.getPeriod());
                    OrderBid.setTestID(bookingRequest.getTestID());
                    OrderBid.setPersons(bookingRequest.getPersons());
                    totalPersons += bookingRequest.getPersons();

                    BookingListForJSON ordersList = new BookingListForJSON();
                    Query so = new Query("ShapeOrdersList").setAncestor(shapeKey);
                    PreparedQuery soq = datastore.prepare(so);
                    Entity shapeOrders = soq.asSingleEntity();
                    if (shapeOrders == null) {
                        shapeOrders = new Entity("ShapeOrdersList", shapeKey);
                        shapeOrders.setProperty("sid", bookingRequest.getSid());
                        shapeOrders.setProperty("pid", bookingRequest.getPid());
                        ordersList.add(OrderBid, 0);
                        Text ordersListJSON = new Text(JsonUtils.serialize(ordersList));
                        shapeOrders.setUnindexedProperty("bookingListJSON", ordersListJSON);
                        shapeEntities.add(shapeOrders);
                        //datastore.put(shapeOrders);
                        System.out.println("New Orders Entity");
                    } else {
                        String allOrdersJSON = ((Text) shapeOrders.getProperty("bookingListJSON")).getValue();
                        ordersList = JsonUtils.deserialize(allOrdersJSON, BookingListForJSON.class);
                        boolean added = ordersList.add(OrderBid, bookingProperties.getBookStartWait() * 60);
                        if (added) {
                            // OK
                            Text ordersListJSON = new Text(JsonUtils.serialize(ordersList));
                            shapeOrders.setUnindexedProperty("bookingListJSON", ordersListJSON);
                            //datastore.put(shapeOrders);
                            shapeEntities.add(shapeOrders);
                        } else {
                            allAvailable = false;
                            //datastore.delete(bookingOrder.getKey());
                            map.put("added", false);
                            map.put("reason", "מקום שמור");
                        }
                    }

                }
            }
            if (allAvailable) {
                for (Entity shapeOrders : shapeEntities) {
                    datastore.put(shapeOrders);
                }

            }
        } else {
            map.put("added", false);
        }

        // Update Notification Flow

        if ((boolean) map.get("added") == true) {
            bookingOrder.setProperty("automatic", true);

            MailModel mmodel = new MailModel();
            MailSenderFabric mailFabric = new MailSenderFabric();

            if (bookingProperties.getAutomatic()) {
                // Client booking added automatically
                List<String> waiterNotificationEmails = bookingProperties.getAutomaticMails();


                mmodel.setType("waiterAutomaticBookingNotification");
                mmodel.setGenuser(genuser);
                mmodel.setBookingRequestsWrap(bookingRequestsWrap);
                mmodel.setPlaceInfo(placeInfo);

                for (String mail : waiterNotificationEmails) {
                    mmodel.setTo(mail);
                    mailFabric.SendEmail(mmodel);
                }
                if (mailFabric.isSubscribed(datastore, genuser)) {
                    String userKeyString = mailFabric.getUserKey(datastore, genuser);
                    bookingRequestsWrap.setUserEntityKeyString(userKeyString);

                    mmodel.setTo(genuser.getEmail());
                    mmodel.setType("userConfirmation");
                    mailFabric.SendEmail(mmodel);
                }

            } else {
                bookingOrder.setProperty("automatic", false);
                bookingOrder.setProperty("approved", false);
                RandomStringGenerator randomGen = new RandomStringGenerator();
                String reviewCode = randomGen.generateRandomString(6, RandomStringGenerator.Mode.ALPHANUMERIC);
                bookingOrder.setProperty("reviewCode", reviewCode);

                // Client booking should be approved by Waiter mentioned in Place Configuration/Order
                List<String> waiterNotificationEmails = bookingProperties.getApprovalMails();
                List<String> waiterNotificationPhones = bookingProperties.getApprovalPhones();

                mmodel.setType("waiterManualBookingNotification");
                mmodel.setGenuser(genuser);
                mmodel.setBookingRequestsWrap(bookingRequestsWrap);
                mmodel.setPlaceInfo(placeInfo);
                mmodel.setReviewCode(reviewCode);

                for (String mail : waiterNotificationEmails) {
                    mmodel.setTo(mail);
                    mailFabric.SendEmail(mmodel);
                }
                // Send confirmation SMS
                PlivoSendSMS plivoFabric = new PlivoSendSMS();
                MessageResponse msgResponse;
                SimpleDateFormat dateFormat = new SimpleDateFormat("ddMMM,HH:mm");
                String fromTime = dateFormat.format(bookingRequestsWrap.getPlaceLocalTime());
                dateFormat = new SimpleDateFormat("HH:mm");
                String endTime = dateFormat.format(endCalendar.getTime());
                String message = "New order request\n";
                message += fromTime + "-" + endTime + "," + totalPersons + "persons\n";
                message += "Review https://pickoplace.com/wl/r?c=" + reviewCode + "\n";

                for (String phoneObject : waiterNotificationPhones) {
                    PlivoSMSRequestJSON phoneJSON = JsonUtils.deserialize(phoneObject, PlivoSMSRequestJSON.class);
                    if (phoneJSON.getCountryData().getIso2().equals("us")) {
                        msgResponse = plivoFabric.sendSMSPlivio("+972526775065", phoneJSON.getNumber(), message);
                    } else {
                        msgResponse = plivoFabric.sendSMSPlivio("PickoPlace", phoneJSON.getNumber(), message);
                    }
                    if (msgResponse == null) {
                        map.put("valid", false);
                        map.put("reason", "sms_error_null");
                    } else {
                        if (msgResponse.serverCode == 202) {
                            // Print the Message UUID
                            System.out.println("Message UUID : " + msgResponse.messageUuids.get(0).toString());
                        } else {
                            System.out.println(msgResponse.error);
                            map.put("valid", false);
                            map.put("reason", "sms_error_null");
                        }
                    }

                }
                if (mailFabric.isSubscribed(datastore, genuser)) {
                    String userKeyString = mailFabric.getUserKey(datastore, genuser);
                    bookingRequestsWrap.setUserEntityKeyString(userKeyString);

                    mmodel.setTo(genuser.getEmail());
                    mmodel.setType("userBookingRequest");
                    mailFabric.SendEmail(mmodel);
                }
            }
            FreePlaceFactory freePlaceFactory = new FreePlaceFactory();
            freePlaceFactory.UpdateFreePlace(canvasEntity, shapesEntities, bookingRequestsWrap, datastore);

            // Update all open managers
            ChannelMessageFactory channelFactory = new ChannelMessageFactory();
            channelFactory.SendBookingUpdate(bookingRequestsWrap.getPid(), bookingRequestsWrap);

            datastore.put(bookingOrder);
            datastore.put(canvasEntity);
        }
        txn.commit();
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(JsonUtils.serialize(map));
    }

}
