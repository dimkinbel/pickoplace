package com.dimab.pp.dto;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.dimab.pp.login.dto.GenericUser;

public class BookingRequestWrap {
    Boolean isAnswer = false;
    Boolean reviewAnswer;
    List<BookingRequest> bookingList = new ArrayList<BookingRequest>();
    String pid;
    String testID;
    String bookID;

    String phone;
    Long dateSeconds;
    GenericUser user;
    Integer time;
    Integer period;
    int clientOffset;
    double placeOffcet;
    String clientid;
    int weekday;
    Date placeLocalTime = new Date();
    String textRequest = new String();
    int num;
    String userEntityKeyString;
    String address;
    Date reservationMadeUTC = new Date();
    List<BookingRequestPlaceView> bookingView;
    String reviewCode;
    Integer persons;
    String type = "user";
    String name = "";
    String email = "";

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Boolean isAnswer() {
        return isAnswer;
    }

    public void setAnswer(Boolean answer) {
        this.isAnswer = answer;
    }

    public Boolean getReviewAnswer() {
        return reviewAnswer;
    }

    public void setReviewAnswer(Boolean reviewAnswer) {
        this.reviewAnswer = reviewAnswer;
    }

    public String getReviewCode() {
        return reviewCode;
    }

    public void setReviewCode(String reviewCode) {
        this.reviewCode = reviewCode;
    }

    public Integer getPersons() {
        return persons;
    }

    public void setPersons(Integer persons) {
        this.persons = persons;
    }

    String placeName;
    String branchName;

    public String getPlaceName() {
        return placeName;
    }

    public void setPlaceName(String placeName) {
        this.placeName = placeName;
    }

    public String getBranchName() {
        return branchName;
    }

    public void setBranchName(String branchName) {
        this.branchName = branchName;
    }

    public List<BookingRequestPlaceView> getBookingView() {
        return bookingView;
    }

    public void setBookingView(List<BookingRequestPlaceView> bookingView) {
        this.bookingView = bookingView;
    }

    public Date getReservationMadeUTC() {
        return reservationMadeUTC;
    }

    public void setReservationMadeUTC(Date reservationMadeUTC) {
        this.reservationMadeUTC = reservationMadeUTC;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }


    public String getUserEntityKeyString() {
        return userEntityKeyString;
    }

    public void setUserEntityKeyString(String userEntityKeyString) {
        this.userEntityKeyString = userEntityKeyString;
    }

    public Integer getTotalPersons() {
        Integer persons = 0;
        for (BookingRequest singlePlace : bookingList) {
            persons += singlePlace.getPersons();
        }
        return persons;
    }

    public Date getPlaceLocalTime() {
        return placeLocalTime;
    }

    public void setPlaceLocalTime(Date placeLocalTime) {
        this.placeLocalTime = placeLocalTime;
    }

    public GenericUser getUser() {
        return user;
    }

    public void setUser(GenericUser user) {
        this.user = user;
    }

    public int getNum() {
        return num;
    }

    public void setNum(int num) {
        this.num = num;
    }

    public String getTextRequest() {
        return textRequest;
    }

    public void setTextRequest(String textRequest) {
        this.textRequest = textRequest;
    }

    public int getWeekday() {
        return weekday;
    }

    public void setWeekday(int weekday) {
        this.weekday = weekday;
    }

    public List<BookingRequest> getBookingList() {
        return bookingList;
    }

    public void setBookingList(List<BookingRequest> bookingList) {
        this.bookingList = bookingList;
    }

    public String getPid() {
        return pid;
    }

    public void setPid(String pid) {
        this.pid = pid;
    }

    public String getTestID() {
        return testID;
    }

    public void setTestID(String testID) {
        this.testID = testID;
    }

    public String getBookID() {
        return bookID;
    }

    public void setBookID(String bookID) {
        this.bookID = bookID;
    }

    public Long getDateSeconds() {
        return dateSeconds;
    }

    public void setDateSeconds(Long dateSeconds) {
        this.dateSeconds = dateSeconds;
    }

    public Integer getTime() {
        return time;
    }

    public void setTime(Integer time) {
        this.time = time;
    }

    public Integer getPeriod() {
        return period;
    }

    public void setPeriod(Integer period) {
        this.period = period;
    }

    public int getClientOffset() {
        return clientOffset;
    }

    public void setClientOffset(int clientOffset) {
        this.clientOffset = clientOffset;
    }

    public double getPlaceOffcet() {
        return placeOffcet;
    }

    public void setPlaceOffcet(double placeOffcet) {
        this.placeOffcet = placeOffcet;
    }

    public String getClientid() {
        return clientid;
    }

    public void setClientid(String clientid) {
        this.clientid = clientid;
    }


}
