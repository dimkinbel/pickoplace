package com.dimab.pp.database;

import com.dimab.pickoplace.utils.GsonUtils;
import com.dimab.pp.dto.BookingRequest;
import com.dimab.pp.dto.BookingRequestWrap;
import com.dimab.pp.login.GenericUser;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Text;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;

/**
 * Created by dima on 27-Nov-15.
 */
public class EntityConverter {

    public BookingRequestWrap BookingEntityToBookingRequestWrap(Entity bidEntity) {
        BookingRequestWrap bookingRequestWrap = new BookingRequestWrap();
        String pid = (String) bidEntity.getProperty("pid");
        String username_email = (String) bidEntity.getProperty("clientid");
        String bookingListJSON = ((Text) bidEntity.getProperty("bookingList")).getValue();
        Type bookinglistType = new TypeToken<List<BookingRequest>>() {}.getType();
        List<BookingRequest> bookingRequests = GsonUtils.fromJson(bookingListJSON, bookinglistType);

        bookingRequestWrap.setBookID( (String) bidEntity.getProperty("bid"));
        bookingRequestWrap.setPid(pid);
        bookingRequestWrap.setAddress((String) bidEntity.getProperty("address"));
        bookingRequestWrap.setPlaceLocalTime(new Date((String) bidEntity.getProperty("Date")));
        if(bidEntity.getProperty("DateWhenOrderMade_atUTC ")!=null) {
            bookingRequestWrap.setReservationMadeUTC(new Date((String) bidEntity.getProperty("DateWhenOrderMade_atUTC ")));
        }
        if(bidEntity.getProperty("genuser")!= null) {
            Type genUserType = new TypeToken<GenericUser>() {}.getType();
            GenericUser genUser =  GsonUtils.fromJson((String)bidEntity.getProperty("genuser"), genUserType);
            bookingRequestWrap.setUser(genUser);
        }
        bookingRequestWrap.setBookingList(bookingRequests);
        return bookingRequestWrap;
    }
}
