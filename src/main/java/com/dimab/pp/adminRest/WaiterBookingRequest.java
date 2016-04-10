package com.dimab.pp.adminRest;

import com.dimab.pickoplace.utils.JsonUtils;
import com.dimab.pp.database.FreePlaceFactory;
import com.dimab.pp.database.GetAJAXimageJSONfromCSfactory;
import com.dimab.pp.database.GetPlaceInfoFactory;
import com.dimab.pp.dto.*;
import com.dimab.pp.login.dto.GenericUser;
import com.google.appengine.api.datastore.*;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.*;

/**
 * Created by dima on 05-Apr-16.
 */
@WebServlet(name = "WaiterBookingRequest")
public class WaiterBookingRequest extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        String jsonString = request.getParameter("booking");
        Map<String, Object> map = new HashMap<String, Object>();


        BookingRequestWrap bookingRequestsWrap = JsonUtils.deserialize(jsonString, BookingRequestWrap.class);
        if (bookingRequestsWrap.getType() == null) {
            bookingRequestsWrap.setType("admin");
        }
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

        Date dateForDatabase = new Date(PlaceLocalTime.getTime());
        System.out.println(PlaceLocalTime);
        Date secrtc = new Date(secondsRelativeToClient * 1000L);
        System.out.println(secrtc);

        Calendar calendar = Calendar.getInstance();
        calendar.setTime(PlaceLocalTime);
        Integer dayOfStartCalendar = calendar.get(Calendar.DAY_OF_MONTH);
        System.out.println(calendar.getTime());

        Calendar endCalendar = calendar;
        endCalendar.add(Calendar.SECOND, bookingRequestsWrap.getPeriod());
        Integer dayOfEndCalendar = endCalendar.get(Calendar.DAY_OF_MONTH);

        Boolean endOnNextDay = false;
        if (dayOfStartCalendar != dayOfEndCalendar) {
            endOnNextDay = true;
        }
        System.out.println(endCalendar.getTime());


        bookingRequestsWrap.setPlaceLocalTime(PlaceLocalTime);
        String username_email = "admin@" + bookingRequestsWrap.getPid();
        GenericUser genuser = new GenericUser();
        AdminSetUser genuserA = new AdminSetUser(bookingRequestsWrap);
        genuser.setAduser(genuserA);


        // Get CanvasState by PID
        Query.Filter pidFilter = new Query.FilterPredicate("placeUniqID", Query.FilterOperator.EQUAL, bookingRequestsWrap.getPid());
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
        bookingOrder.setUnindexedProperty("userPhone", bookingRequestsWrap.getPhone());

        bookingOrder.setProperty("type", bookingRequestsWrap.getType());
        bookingOrder.setProperty("DateWhenOrderMade_atUTC", current);
        bookingOrder.setProperty("DateWhenOrderMadeSeconds_atUTC", current.getTime());
        bookingOrder.setProperty("bid", bookingRequestsWrap.getBookID());
        bookingOrder.setProperty("Date", dateForDatabase);
        bookingOrder.setProperty("UTCstartSeconds", secondsRelativeToClient);// Seconds as seen at UTC
        bookingOrder.setProperty("pid", bookingRequestsWrap.getPid());
        bookingOrder.setProperty("periodSeconds", bookingRequestsWrap.getPeriod());
        bookingOrder.setProperty("weekday", bookingRequestsWrap.getWeekday());
        if (bookingRequestsWrap.getTextRequest() != null && !bookingRequestsWrap.getTextRequest().isEmpty()) {
            bookingOrder.setUnindexedProperty("userTextRequest", bookingRequestsWrap.getTextRequest());
        }
        bookingOrder.setProperty("weekday", bookingRequestsWrap.getWeekday());
        bookingOrder.setProperty("num", bookingsMade);
        bookingOrder.setUnindexedProperty("bookingViewData", JsonUtils.serialize(canvasJsonFactory.getBookingViewData(canvasEntity, bookingRequestsWrap)));

        map.put("num", bookingsMade);
        map.put("time", secondsRelativeToClient);

        List<Entity> shapesEntities = new ArrayList<Entity>();
        Integer totalPersons = 0;
        // Check available places by shapes (else delete BookingOrders entity) isAvailable
        List<Entity> shapeEntities = new ArrayList<Entity>();
        boolean allAvailable = true;
        for (BookingRequest bookingRequest : bookingRequests) {

            Query.Filter sidFilter = new Query.FilterPredicate("sid", Query.FilterOperator.EQUAL, bookingRequest.getSid());
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
                OrderBid.setType(bookingRequestsWrap.getType());
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
        if ((boolean) map.get("added") == true) {
            // Update Notification Flow (Empty for Admin)
            bookingOrder.setProperty("automatic", true);
            FreePlaceFactory freePlaceFactory = new FreePlaceFactory();
            freePlaceFactory.UpdateFreePlace(canvasEntity, shapesEntities, bookingRequestsWrap, datastore);

            datastore.put(bookingOrder);
            datastore.put(canvasEntity);
        }
        txn.commit();
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(JsonUtils.serialize(map));
    }

}
