package com.dimab.pp.database;

import com.dimab.pickoplace.json.GsonUtils;
import com.dimab.pp.dto.BookingListForJSON;
import com.dimab.pp.dto.BookingSingleShapeList;
import com.dimab.pp.dto.OrderedResponse;
import com.dimab.pp.dto.SingleTimeRangeLong;
import com.google.appengine.api.datastore.*;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;

import java.util.ArrayList;
import java.util.List;

public class GetShapesOrders {
    public OrderedResponse getOrderedResponse(OrderedResponse orderedResponse, String pid, Long fromTime, Long period, boolean full) {
        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        Filter placeIdFilter = new FilterPredicate("pid", FilterOperator.EQUAL, pid);
        Query q = new Query("ShapeOrdersList").setFilter(placeIdFilter);
        PreparedQuery pq = datastore.prepare(q);
        for (Entity shapeList : pq.asIterable()) {
            BookingSingleShapeList singleShaperesponse = new BookingSingleShapeList();
            String sid = (String) shapeList.getProperty("sid");

            String allOrdersJSON = ((Text) shapeList.getProperty("bookingListJSON")).getValue();
            singleShaperesponse.setSid(sid);
            BookingListForJSON ordersList = GsonUtils.GSON.fromJson(allOrdersJSON, BookingListForJSON.class);
            List<SingleTimeRangeLong> matchList = new ArrayList<SingleTimeRangeLong>();
            if (full) {
                matchList = ordersList.getInRangeWithBID(fromTime, period);
            } else {
                matchList = ordersList.getInRange(fromTime, period);
            }
            if (matchList.isEmpty()) {
                SingleTimeRangeLong empty = new SingleTimeRangeLong();
                empty.setFrom((long) 0);
                empty.setTo((long) 0);
                matchList.add(empty);
            }

            singleShaperesponse.setOrdersList(matchList);
            orderedResponse.getShapesBooked().add(singleShaperesponse);
        }

        System.out.println(GsonUtils.GSON.toJson(orderedResponse));
        return orderedResponse;
    }
}
