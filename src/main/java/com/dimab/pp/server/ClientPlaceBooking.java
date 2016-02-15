package com.dimab.pp.server;

import com.dimab.pickoplace.entity.EntityKind;
import com.dimab.pickoplace.json.GsonUtils;
import com.dimab.pp.channel.ChannelMessageFactory;
import com.dimab.pp.database.FreePlaceFactory;
import com.dimab.pp.database.GetPlaceInfoFactory;
import com.dimab.pp.dto.*;
import com.dimab.pp.login.CheckTokenValid;
import com.dimab.pp.login.GenericUser;
import com.dimab.smsmail.MailSenderFabric;
import com.google.appengine.api.datastore.*;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.gson.reflect.TypeToken;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.*;


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
            response.getWriter().write(GsonUtils.GSON.toJson(map));
            return;
        } else {
            username_email = genuser.getEmail();
        }

        BookingRequestWrap bookingRequestsWrap = GsonUtils.GSON.fromJson(jsonString, BookingRequestWrap.class);
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
            Query q = new Query(EntityKind.Users).setFilter(UserEmail);
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
        Text bookingListGSON = new Text(GsonUtils.GSON.toJson(bookingRequests));
        Entity bookingOrder = new Entity("BookingOrders", canvasKey);
        bookingOrder.setUnindexedProperty("bookingList", bookingListGSON);
        bookingOrder.setProperty("clientid", username_email);
        bookingOrder.setUnindexedProperty("placeName", (String) canvasEntity.getProperty("placeName"));
        bookingOrder.setUnindexedProperty("placeBranchName", (String) canvasEntity.getProperty("placeBranchName"));
        bookingOrder.setUnindexedProperty("address", (String) canvasEntity.getProperty("address"));
        bookingOrder.setUnindexedProperty("genuser", GsonUtils.GSON.toJson(genuser));
        bookingOrder.setUnindexedProperty("UTCdateProper", UTCdateProper);
        bookingOrder.setUnindexedProperty("userPhone", sessionPhone);

        bookingOrder.setProperty("DateWhenOrderMade_atUTC", current);
        bookingOrder.setProperty("DateWhenOrderMadeSeconds_atUTC", current.getTime());
        bookingOrder.setProperty("bid", bookingRequestsWrap.getBookID());
        bookingOrder.setProperty("Date", PlaceLocalTime.toString());
        bookingOrder.setProperty("UTCstartSeconds", secondsRelativeToClient);// Seconds as seen at UTC
        bookingOrder.setProperty("pid", bookingRequestsWrap.getPid());
        bookingOrder.setProperty("periodSeconds", bookingRequestsWrap.getPeriod());
        bookingOrder.setProperty("weekday", bookingRequestsWrap.getWeekday());
        bookingOrder.setProperty("num", bookingsMade);
        datastore.put(bookingOrder);
        datastore.put(canvasEntity);


        // Check time passed for booking
        if (utcTimeSeconds + 60 > secondsRelativeToClient) {
            System.out.println("Plase time passed:\n   UTCTime = " + utcTimeSeconds + "\n   bookTime=" + secondsRelativeToClient);
            bookAvailable = false;
        }

        if (canvasEntity != null && bookAvailable) {
            String closeDatesString = (String) canvasEntity.getProperty("closeDates");
            Type closeDateType = new TypeToken<List<Integer>>() {
            }.getType();
            List<Integer> closeDates = GsonUtils.GSON.fromJson(closeDatesString, closeDateType);

            String weekdays = (String) canvasEntity.getProperty("workinghours");
            WorkingWeek weekdaysObject = GsonUtils.GSON.fromJson(weekdays, WorkingWeek.class);
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
                System.out.println("Place closed! Open ranges :" + GsonUtils.GSON.toJson(tempRanges));
                System.out.println("            Booking range :" + bookFrom + "-" + bookTo);
                bookAvailable = false;
            }
        }
        List<Entity> shapesEntities = new ArrayList<Entity>();
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

                    BookingListForJSON ordersList = new BookingListForJSON();
                    Query so = new Query("ShapeOrdersList").setAncestor(shapeKey);
                    PreparedQuery soq = datastore.prepare(so);
                    Entity shapeOrders = soq.asSingleEntity();
                    if (shapeOrders == null) {
                        shapeOrders = new Entity("ShapeOrdersList", shapeKey);
                        shapeOrders.setProperty("sid", bookingRequest.getSid());
                        shapeOrders.setProperty("pid", bookingRequest.getPid());
                        ordersList.add(OrderBid, 0);
                        Text ordersListJSON = new Text(GsonUtils.GSON.toJson(ordersList));
                        shapeOrders.setUnindexedProperty("bookingListJSON", ordersListJSON);
                        shapeEntities.add(shapeOrders);
                        //datastore.put(shapeOrders);
                        System.out.println("New Orders Entity");
                    } else {
                        String allOrdersJSON = ((Text) shapeOrders.getProperty("bookingListJSON")).getValue();
                        ordersList = GsonUtils.GSON.fromJson(allOrdersJSON, BookingListForJSON.class);
                        boolean added = ordersList.add(OrderBid, 0);
                        if (added) {
                            // OK
                            Text ordersListJSON = new Text(GsonUtils.GSON.toJson(ordersList));
                            shapeOrders.setUnindexedProperty("bookingListJSON", ordersListJSON);
                            //datastore.put(shapeOrders);
                            shapeEntities.add(shapeOrders);
                        } else {
                            allAvailable = false;
                            //datastore.delete(bookingOrder.getKey());
                            map.put("added", false);
                        }
                    }

                }
            }
            if (allAvailable) {
                for (Entity shapeOrders : shapeEntities) {
                    datastore.put(shapeOrders);
                }
                // Update all open managers
                ChannelMessageFactory channelFactory = new ChannelMessageFactory();
                channelFactory.SendBookingUpdate(bookingRequestsWrap.getPid(), bookingRequestsWrap);
            } else {
                datastore.delete(bookingOrder.getKey());
            }
        } else {
            datastore.delete(bookingOrder.getKey());
            map.put("added", false);
        }
        if ((boolean) map.get("added") == true) {
            FreePlaceFactory freePlaceFactory = new FreePlaceFactory();
            freePlaceFactory.UpdateFreePlace(canvasEntity, shapesEntities, bookingRequestsWrap, datastore);

            GetPlaceInfoFactory placeFactory = new GetPlaceInfoFactory();
            PlaceInfo placeInfo = placeFactory.getPlaceInfoNoImage(datastore, canvasEntity);
            MailSenderFabric mailFabric = new MailSenderFabric();
            if (mailFabric.isSubscribed(datastore, genuser)) {
                String userKeyString = mailFabric.getUserKey(datastore, genuser);
                bookingRequestsWrap.setUserEntityKeyString(userKeyString);
                mailFabric.SendConfirmationEmail("pickoplace@appspot.gserviceaccount.com", genuser.getEmail(), bookingRequestsWrap, placeInfo);
            }
        }
        txn.commit();
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(GsonUtils.GSON.toJson(map));
    }
}
