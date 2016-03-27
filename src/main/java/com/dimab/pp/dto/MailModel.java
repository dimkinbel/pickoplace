package com.dimab.pp.dto;

import com.dimab.pp.login.GenericUser;

/**
 * Created by dima on 27-Mar-16.
 */
public class MailModel {
    String type;
    String from = "pickoplace@appspot.gserviceaccount.com" ;
    String to ;
    String reviewCode;
    BookingRequestWrap bookingRequestsWrap;
    PlaceInfo placeInfo;
    String VerificationCode ;
    GenericUser genuser;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public String getTo() {
        return to;
    }

    public void setTo(String to) {
        this.to = to;
    }

    public BookingRequestWrap getBookingRequestsWrap() {
        return bookingRequestsWrap;
    }

    public void setBookingRequestsWrap(BookingRequestWrap bookingRequestsWrap) {
        this.bookingRequestsWrap = bookingRequestsWrap;
    }

    public PlaceInfo getPlaceInfo() {
        return placeInfo;
    }

    public void setPlaceInfo(PlaceInfo placeInfo) {
        this.placeInfo = placeInfo;
    }

    public String getVerificationCode() {
        return VerificationCode;
    }

    public void setVerificationCode(String verificationCode) {
        VerificationCode = verificationCode;
    }

    public GenericUser getGenuser() {
        return genuser;
    }

    public void setGenuser(GenericUser genuser) {
        this.genuser = genuser;
    }

    public void setReviewCode(String reviewCode) {
        this.reviewCode = reviewCode;
    }

    public String getReviewCode() {
        return reviewCode;
    }
}
