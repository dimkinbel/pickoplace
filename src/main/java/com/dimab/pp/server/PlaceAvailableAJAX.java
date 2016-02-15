package com.dimab.pp.server;

import com.dimab.pickoplace.json.GsonUtils;
import com.dimab.pp.database.GetShapesOrders;
import com.dimab.pp.dto.OrderedResponse;
import com.dimab.pp.dto.PlaceCheckAvailableJSON;
import com.dimab.pp.dto.SingleTimeRangeLong;
import com.dimab.pp.dto.WorkingWeek;
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
import java.util.ArrayList;
import java.util.List;

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
        PlaceCheckAvailableJSON bookingRequest = GsonUtils.GSON.fromJson(jsonString, PlaceCheckAvailableJSON.class);
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
            Type closeDateType = new TypeToken<List<Integer>>() {
            }.getType();
            List<Integer> closeDates = GsonUtils.GSON.fromJson(closeDatesString, closeDateType);

            String weekdays = (String) CanvasStateEntity.getProperty("workinghours");
            WorkingWeek weekdaysObject = GsonUtils.GSON.fromJson(weekdays, WorkingWeek.class);
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
        }
        System.out.println(GsonUtils.GSON.toJson(orderedResponse));
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(GsonUtils.GSON.toJson(orderedResponse));
    }
}
