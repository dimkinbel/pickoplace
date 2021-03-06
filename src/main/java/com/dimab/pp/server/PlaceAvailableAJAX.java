package com.dimab.pp.server;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.dimab.pickoplace.utils.JsonUtils;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.dimab.pp.database.GetShapesOrders;
import com.dimab.pp.dto.*;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.gson.reflect.TypeToken;

public class PlaceAvailableAJAX extends HttpServlet {
    private static final long serialVersionUID = 1L;

    public PlaceAvailableAJAX() {
        super();
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        OrderedResponse orderedResponse = new OrderedResponse();
        GetShapesOrders orderedResponseFactory = new GetShapesOrders();
        String jsonString = request.getParameter("bookrequest");
        System.out.println("JSON:"+jsonString);
        PlaceCheckAvailableJSON bookingRequest = JsonUtils.deserialize(jsonString, PlaceCheckAvailableJSON.class);
        Long date = bookingRequest.getDate1970();// Ignoring client offset
        Long period = bookingRequest.getPeriod();
        int weekday = bookingRequest.getWeekday();
        double placeOffset = bookingRequest.getPlaceOffset();
        int clientOffset = bookingRequest.getClientOffset();
        Long UTCdate = date + clientOffset * 3600 - (long) placeOffset * 3600; // date is UTC seconds relative to client browser Calendar
        Integer UTCdateProper = date.intValue() + clientOffset * 3600;
        System.out.println("date + clientOffset - placeOffset: " + date + " + " + clientOffset * 3600 + " - " + placeOffset * 3600);
        System.out.println("UTC date to check:" + UTCdate);
        orderedResponseFactory.getOrderedResponse(orderedResponse, bookingRequest.getPid(), UTCdate, period, false);

        // Create empty booking lists for not booked SIDs
        List<String> sidsBooked = new ArrayList<>();
        for(BookingSingleShapeList existingList :  orderedResponse.getShapesBooked()) {
            sidsBooked.add(existingList.getSid());
        }
        for(String singleSid : bookingRequest.getListOfSids()) {
            if(!sidsBooked.contains(singleSid)) {
                System.out.println("Not contains:"+singleSid);
                BookingSingleShapeList singleShaperesponse = new BookingSingleShapeList();
                singleShaperesponse.setSid(singleSid);
                List<SingleTimeRangeLong> matchList = new ArrayList<SingleTimeRangeLong>();
                SingleTimeRangeLong empty = new SingleTimeRangeLong();
                empty.setFrom((long) 0);
                empty.setTo((long) 0);
                matchList.add(empty);
                singleShaperesponse.setOrdersList(matchList);
                orderedResponse.getShapesBooked().add(singleShaperesponse);
            }
        }


        orderedResponse.setDate1970(date);
        orderedResponse.setPeriod(period);
        orderedResponse.setClientOffset(clientOffset);
        orderedResponse.setPlaceOffset(placeOffset);
        orderedResponse.setPid(bookingRequest.getPid());

        List<SingleTimeRangeLong> openRanges = new ArrayList<SingleTimeRangeLong>();

        // Return place open
        Filter placeIdFilter = new FilterPredicate("placeUniqID", FilterOperator.EQUAL, bookingRequest.getPid());
        Query q = new Query("CanvasState").setFilter(placeIdFilter);
        PreparedQuery piq = datastore.prepare(q);
        Entity CanvasStateEntity = piq.asSingleEntity();
        if (CanvasStateEntity != null) {
            String closeDatesString = (String) CanvasStateEntity.getProperty("closeDates");
            Type closeDateType = new TypeToken<List<Integer>>() {}.getType();
            List<Integer> closeDates = JsonUtils.deserialize(closeDatesString, closeDateType);

            String weekdays = (String) CanvasStateEntity.getProperty("workinghours");
            WorkingWeek weekdaysObject = JsonUtils.deserialize(weekdays, WorkingWeek.class);

            weekdaysObject.getRangesWeek(orderedResponse);


            List<SingleTimeRangeLong> tempRanges = weekdaysObject.getRangesList(weekday, 2);

            // Check for dates the place is close (set by Administrator)
            if (closeDates.contains(UTCdateProper)) {
                tempRanges = weekdaysObject.deleteRangeFromList(tempRanges, 0, 86400);
            }
            if (closeDates.contains(UTCdateProper + 86400)) {
                tempRanges = weekdaysObject.deleteRangeFromList(tempRanges, 86400, 2 * 86400);
            }

            openRanges = tempRanges;
            orderedResponse.setPlaceOpen(openRanges);
            orderedResponse.setCloseDays(closeDates);

            orderedResponse.setBookProperties(JsonUtils.deserialize((String) CanvasStateEntity.getProperty("bookingProperties"), ConfigBookingProperties.class));

        }
        System.out.println(JsonUtils.serialize(orderedResponse));
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(JsonUtils.serialize(orderedResponse));

    }

}
