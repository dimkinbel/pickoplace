package com.dimab.pp.adminRest;

import com.dimab.pickoplace.utils.JsonUtils;
import com.dimab.pp.database.EntityConverter;
import com.dimab.pp.database.FreePlaceFactory;
import com.dimab.pp.dto.*;
import com.dimab.smsmail.MailSenderFabric;
import com.google.appengine.api.datastore.*;

import java.util.List;

/**
 * Created by dima on 27-Nov-15.
 */
public class WaiterDeleteBooking {

    public boolean deleteBooking(String bid,String placeName,String branch,String address) {
        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        TransactionOptions options = TransactionOptions.Builder.withXG(true);
        Transaction txn = datastore.beginTransaction(options);


        Query.Filter bidFilter = new Query.FilterPredicate("bid", Query.FilterOperator.EQUAL, bid);
        Query sq_ = new Query("BookingOrders").setFilter(bidFilter);
        PreparedQuery psq_ = datastore.prepare(sq_);
        if (psq_.asSingleEntity() != null) {
            Entity bidEntity = psq_.asSingleEntity();
            EntityConverter converter = new EntityConverter();
            BookingRequestWrap bookingRequest = converter.BookingEntityToBookingRequestWrap(bidEntity);
            String pid = bookingRequest.getPid();
            List<BookingRequest> bookingRequests = bookingRequest.getBookingList();

            for (BookingRequest bookRequest : bookingRequests) {
                String bsid = bookRequest.getSid();
                Query.Filter placeIdFilter = new Query.FilterPredicate("pid", Query.FilterOperator.EQUAL, pid);
                Query.Filter sIdFilter = new Query.FilterPredicate("sid", Query.FilterOperator.EQUAL, bsid);
                Query.Filter composeFilter = Query.CompositeFilterOperator.and(placeIdFilter, sIdFilter);
                Query q = new Query("ShapeOrdersList").setFilter(composeFilter);
                PreparedQuery pq = datastore.prepare(q);
                if (pq.asSingleEntity() != null) {
                    Entity shapeList = pq.asSingleEntity();
                    String sid = (String) shapeList.getProperty("sid");
                    System.out.println("Removing booking from shape:" + sid);
                    String allOrdersJSON = ((Text) shapeList.getProperty("bookingListJSON")).getValue();
                    BookingListForJSON ordersList = JsonUtils.deserialize(allOrdersJSON, BookingListForJSON.class);
                    ordersList.remove(bid);
                    Text ordersListJSON = new Text(JsonUtils.serialize(ordersList));
                    shapeList.setUnindexedProperty("bookingListJSON", ordersListJSON);
                    datastore.put(shapeList);
                }
            }
            FreePlaceFactory freePlaceFactory = new FreePlaceFactory();

            datastore.delete(bidEntity.getKey());

            // Send email to user
            MailSenderFabric mailFabric  = new MailSenderFabric();
            PlaceInfo placeInfo = new PlaceInfo();
            UserPlace userPlace = new UserPlace();
            userPlace.setPlace(placeName);
            userPlace.setBranch(branch);
            userPlace.setAddress(address);
            placeInfo.setUserPlace(userPlace);
            mailFabric.SendEmail("waiterCancelUserBooking","pickoplace@appspot.gserviceaccount.com", bookingRequest.getUser().getEmail(), bookingRequest, placeInfo,"");
            txn.commit();
            freePlaceFactory.UpdateFreePlaceRemoveBooking(bidEntity, bookingRequests, datastore);
            return true;
        }
        return false;
    }

}
