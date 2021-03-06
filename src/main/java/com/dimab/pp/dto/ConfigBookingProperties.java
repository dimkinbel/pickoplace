package com.dimab.pp.dto;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by dima on 02-Mar-16.
 */
public class ConfigBookingProperties {
    Boolean BookingAvailable = false;
    Boolean allDay = false;
    List<Integer> bookLength = new ArrayList<Integer>();
    Integer bookStartStep = 15;
    Integer bookStartWait = 0;
    Boolean automatic = true;
    List<String> automaticMails = new ArrayList<String>();
    List<String> approvalPhones = new ArrayList<String>();
    List<String> approvalMails = new ArrayList<String>();
    Boolean SidUnlimited = true;
    Integer maxSids = 1;

    public ConfigBookingProperties() {
        super();
        this.bookLength = new ArrayList<Integer>();
        this.bookLength.add(60 );
        this.bookLength.add(90 );
        this.bookLength.add(120 );
    }
    public String getTimeString(Integer sec) {
        Integer hour = sec/3600;
        Integer min = (sec - 3600*hour)/60;
        String timeString = "";
        if(hour > 0 && min > 0) {
            timeString = hour+":"+min+"";
        } else {
            if(hour > 0) {
                timeString = hour+":00";
            } else {
                timeString = "0:"+min ;
            }
        }
        return timeString;
    }

    public Boolean isBookingAvailable() {
        return BookingAvailable;
    }

    public void setBookingAvailable(Boolean bookingAvailable) {
        BookingAvailable = bookingAvailable;
    }

    public List<String> getAutomaticMails() {
        return automaticMails;
    }

    public void setAutomaticMails(List<String> automaticMails) {
        this.automaticMails = automaticMails;
    }

    public Boolean getAllDay() {
        return allDay;
    }

    public void setAllDay(Boolean allDay) {
        this.allDay = allDay;
    }

    public List<Integer> getBookLength() {
        return bookLength;
    }

    public void setBookLength(List<Integer> bookLength) {
        this.bookLength = bookLength;
    }

    public Integer getBookStartStep() {
        return bookStartStep;
    }

    public void setBookStartStep(Integer bookStartStep) {
        this.bookStartStep = bookStartStep;
    }

    public Integer getBookStartWait() {
        return bookStartWait;
    }

    public void setBookStartWait(Integer bookStartWait) {
        this.bookStartWait = bookStartWait;
    }

    public Boolean getAutomatic() {
        return automatic;
    }

    public void setAutomatic(Boolean automatic) {
        this.automatic = automatic;
    }

    public List<String> getApprovalPhones() {
        return approvalPhones;
    }

    public void setApprovalPhones(List<String> approvalPhones) {
        this.approvalPhones = approvalPhones;
    }

    public List<String> getApprovalMails() {
        return approvalMails;
    }

    public void setApprovalMails(List<String> approvalMails) {
        this.approvalMails = approvalMails;
    }

    public Integer getMaxSids() {
        return maxSids;
    }

    public void setMaxSids(Integer maxSids) {
        this.maxSids = maxSids;
    }

    public Boolean getSidUnlimited() {
        return SidUnlimited;
    }

    public void setSidUnlimited(Boolean sidUnlimited) {
        SidUnlimited = sidUnlimited;
    }
}
