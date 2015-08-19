package com.dimab.pp.database;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

import com.dimab.pp.dto.BookingListForJSON;
import com.dimab.pp.dto.BookingSingleShapeList;
import com.dimab.pp.dto.OrderedResponse;
import com.dimab.pp.dto.SingleTimeRangeLong;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Text;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

public class GetShapesOrders {
  public OrderedResponse getOrderedResponse(OrderedResponse orderedResponse,String pid,Long fromTime , Long period , boolean full){
	    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
	    Gson gson = new Gson();
		Filter placeIdFilter = new  FilterPredicate("pid",FilterOperator.EQUAL,pid);
		Query q = new Query("ShapeOrdersList").setFilter(placeIdFilter);
		PreparedQuery pq = datastore.prepare(q);
		for (Entity shapeList : pq.asIterable()) {
			BookingSingleShapeList singleShaperesponse = new BookingSingleShapeList();
			String sid = (String) shapeList.getProperty("sid");

			String allOrdersJSON =   ((Text) shapeList.getProperty("bookingListJSON")).getValue();
			singleShaperesponse.setSid(sid);
			BookingListForJSON ordersList = gson.fromJson(allOrdersJSON, BookingListForJSON.class);
			List<SingleTimeRangeLong> matchList = new ArrayList<SingleTimeRangeLong>();
			if(full) {
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

	  System.out.println(new Gson().toJson(orderedResponse));
	  return orderedResponse;
  }
}
