package com.dimab.pp.account;

import com.dimab.pickoplace.utils.GsonUtils;
import com.dimab.pickoplace.utils.ServletUtils;
import com.dimab.pp.database.GetBookingShapesDataFactory;
import com.dimab.pp.database.GetShapesOrders;
import com.dimab.pp.dto.*;
import com.dimab.pp.login.CheckTokenValid;
import com.dimab.pp.login.GenericUser;
import com.google.appengine.api.datastore.*;
import com.google.appengine.api.datastore.Query.CompositeFilterOperator;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class WaUpdateBookingsByDate extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        String jsonString = request.getParameter("bookrequest");
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
            String returnurl = "/welcome.jsp";
            response.addHeader("Access-Control-Allow-Origin", "*");
            response.sendRedirect(returnurl);
            return;
        } else {
            username_email = genuser.getEmail();
        }

        OrderedResponse orderedResponse = new OrderedResponse();
        GetShapesOrders orderedResponseFactory = new GetShapesOrders();
        GetBookingShapesDataFactory bookingFactory = new GetBookingShapesDataFactory();

        PlaceCheckAvailableJSON bookingRequest = GsonUtils.fromJson(jsonString, PlaceCheckAvailableJSON.class);
        Long date = bookingRequest.getDate1970();// Ignoring client offset
        Long period = bookingRequest.getPeriod();
        int weekday = bookingRequest.getWeekday();
        double placeOffset = bookingRequest.getPlaceOffset();
        int clientOffset = bookingRequest.getClientOffset();
        String placeIDvalue = bookingRequest.getPid();

        Long UTCdate = date + clientOffset * 3600 - (long) placeOffset * 3600; // date is UTC seconds relative to client browser Calendar
        Integer UTCdateProper = date.intValue() + clientOffset * 3600;


        List<SingleTimeRangeLong> openRanges = new ArrayList<SingleTimeRangeLong>();

        Filter usernameFilter = new FilterPredicate("username", FilterOperator.EQUAL, username_email);
        Filter placeIdFilter = new FilterPredicate("placeUniqID", FilterOperator.EQUAL, placeIDvalue);
        Filter composeFilter = CompositeFilterOperator.and(usernameFilter, placeIdFilter);
        Query q = new Query("CanvasState").setFilter(composeFilter);
        PreparedQuery pq = datastore.prepare(q);
        Entity userCanvasState = pq.asSingleEntity();

        if (userCanvasState != null) {

            String closeDatesString = (String) userCanvasState.getProperty("closeDates");
            Type closeDateType = new TypeToken<List<Integer>>() {
            }.getType();
            List<Integer> closeDates = GsonUtils.fromJson(closeDatesString, closeDateType);

            String weekdays = (String) userCanvasState.getProperty("workinghours");
            WorkingWeek weekdaysObject = GsonUtils.fromJson(weekdays, WorkingWeek.class);


            List<SingleTimeRangeLong> tempRanges = weekdaysObject.getRangesList(weekday, 2);

            // Check for dates the place is close (set by Administrator)
            if (closeDates.contains(UTCdateProper)) {
                tempRanges = weekdaysObject.deleteRangeFromList(tempRanges, 0, 86400);
            }
            if (closeDates.contains(UTCdateProper + 86400)) {
                tempRanges = weekdaysObject.deleteRangeFromList(tempRanges, 86400, 2 * 86400);
            }

            openRanges = tempRanges;
        }
        orderedResponseFactory.getOrderedResponse(orderedResponse, bookingRequest.getPid(), UTCdate, period, true);
        orderedResponse.setDate1970(UTCdateProper.longValue());
        orderedResponse.setPeriod(period);
        orderedResponse.setClientOffset(clientOffset);
        orderedResponse.setPlaceOffset(placeOffset);
        orderedResponse.setPid(bookingRequest.getPid());
        orderedResponse.setPlaceOpen(openRanges);


        // Bookings datastore
        List<BookingRequestWrap> bookings_ = bookingFactory.getDatastoreBookingsInludeStartBefore(datastore, placeIDvalue, UTCdateProper, UTCdateProper + 2 * 24 * 3600);

        map.put("orderedResponse", orderedResponse);
        map.put("bookings", bookings_);

        ServletUtils.writeJsonResponse(response, map);
    }
}
