package com.dimab.pp.adminRequestServlets;

import com.dimab.pickoplace.utils.JsonUtils;
import com.dimab.pp.dto.BookingRequest;
import com.dimab.pp.dto.BookingRequestPlaceView;
import com.dimab.pp.dto.BookingRequestWrap;
import com.dimab.pp.dto.ShapeDimentions;
import com.dimab.pp.login.GenericUser;
import com.google.appengine.api.datastore.*;
import com.google.appengine.api.images.ImagesService;
import com.google.appengine.api.images.ImagesServiceFactory;
import com.google.appengine.api.images.ServingUrlOptions;
import com.google.appengine.tools.cloudstorage.GcsFilename;
import com.google.gson.reflect.TypeToken;
import net.sf.uadetector.ReadableUserAgent;
import net.sf.uadetector.UserAgentStringParser;
import net.sf.uadetector.service.UADetectorServiceFactory;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;

/**
 * Created by dima on 28-Mar-16.
 */
@WebServlet(name = "BookingReviewFromSMS")
public class BookingReviewFromSMS extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String VerificationCode = request.getParameter("c");
        boolean isMobile = false;
        boolean isApple = false;
        UserAgentStringParser parser = UADetectorServiceFactory.getResourceModuleParser();
        ReadableUserAgent agent = parser.parse(request.getHeader("User-Agent"));
        if (agent.getType().toString().equals("MOBILE_BROWSER")) {
            isMobile = true;
        } else {
            isMobile = false;
        }
        if (agent.getOperatingSystem().getFamily().toString().equals("IOS")) {
            isApple = true;
        } else {
            isApple = false;
        }
        if (isMobile) {
            DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
            Query.Filter codeFilter = new Query.FilterPredicate("reviewCode", Query.FilterOperator.EQUAL, VerificationCode);

            Query q = new Query("BookingOrders").setFilter(codeFilter);
            PreparedQuery pq = datastore.prepare(q);
            Entity bookingEntity = pq.asSingleEntity();

            if (bookingEntity != null) {
                if (bookingEntity.getProperty("approved") != null && (boolean) bookingEntity.getProperty("approved") == false) {

                    Integer startAt = (int) (long) bookingEntity.getProperty("UTCstartSeconds");
                    String pid_ = (String) bookingEntity.getProperty("pid");
                    String bid = (String) bookingEntity.getProperty("bid");
                    String client = (String) bookingEntity.getProperty("clientid");
                    Integer period = (int) (long) bookingEntity.getProperty("periodSeconds");
                    Integer weekday = (int) (long) bookingEntity.getProperty("weekday");
                    Integer num = (int) (long) bookingEntity.getProperty("num");
                    Date placeLocalTime = (Date) bookingEntity.getProperty("Date");
                    String placeName = (String)bookingEntity.getProperty("placeName");
                    String branchName = (String)bookingEntity.getProperty("placeBranchName");
                    String textRequest = "";
                    String userPhone = "";
                    if (bookingEntity.getProperty("textRequest") != null) {
                        textRequest = (String) bookingEntity.getProperty("textRequest");
                    }
                    if (bookingEntity.getProperty("userPhone") != null) {
                        userPhone = (String) bookingEntity.getProperty("userPhone");
                    }

                    String bookingListJSON = ((Text) bookingEntity.getProperty("bookingList")).getValue();
                    Type bookingListType = new TypeToken<List<BookingRequest>>() {
                    }.getType();
                    List<BookingRequest> bookingShapesList = JsonUtils.deserialize(bookingListJSON, bookingListType);

                    Integer persons = 0;
                    for(BookingRequest singlePlace: bookingShapesList) {
                        persons+= singlePlace.getPersons();
                    }
                    BookingRequestWrap booking = new BookingRequestWrap();
                    booking.setBookID(bid);
                    booking.setNum(num);
                    booking.setTime(startAt);
                    booking.setPlaceLocalTime(placeLocalTime);
                    booking.setPid(pid_);
                    booking.setPlaceName(placeName);
                    booking.setPlaceName(branchName);
                    booking.setPeriod(period);
                    booking.setWeekday(weekday);
                    booking.setTextRequest(textRequest);
                    booking.setClientid(client);
                    booking.setPhone(userPhone);
                    booking.setBookingList(bookingShapesList);
                    booking.setPersons(persons);
                    booking.setReviewCode(VerificationCode);
                    if (bookingEntity.getProperty("genuser") != null) {
                        Type genuserType = new TypeToken<GenericUser>() {
                        }.getType();
                        GenericUser genuser = JsonUtils.deserialize((String) bookingEntity.getProperty("genuser"), genuserType);
                        booking.setUser(genuser);
                    }

                    // Update place view
                    String viewJSON = (String)bookingEntity.getProperty("bookingViewData");
                    Type viewListType = new TypeToken<List<BookingRequestPlaceView>>() {}.getType();
                    List<BookingRequestPlaceView> viewList = JsonUtils.deserialize(viewJSON,viewListType);
                    for(BookingRequestPlaceView Floorview: viewList) {
                        String fileName_ = Floorview.getUserID() + "/" + pid_ + "/" + "main" + "/" + Floorview.getFloorID() + "/overview.png";
                        System.out.println(fileName_);

                        String bucket = "pp_images";
                        GcsFilename gcsFilename = new GcsFilename(bucket, fileName_);
                        ImagesService is = ImagesServiceFactory.getImagesService();
                        String filename = String.format("/gs/%s/%s", gcsFilename.getBucketName(), gcsFilename.getObjectName());
                        String servingUrl = is.getServingUrl(ServingUrlOptions.Builder.withGoogleStorageFileName(filename).secureUrl(true));
                        servingUrl = servingUrl + "=s" + 300;
                        Floorview.setOverviewURL(servingUrl);

                        double floorWidth = Floorview.getWidth();
                        double floorHeight = Floorview.getHeight();

                        for(ShapeDimentions shapeDim : Floorview.getShapes()) {
                            String xper = String.format("%.2f",shapeDim.getX()/floorWidth*100);
                            String yper = String.format("%.2f",shapeDim.getY()/floorHeight*100);
                            shapeDim.setXperc(xper);
                            shapeDim.setYperc(yper);
                        }
                    }
                    booking.setBookingView(viewList);

                    request.setAttribute("bookingRequest", booking);
                    RequestDispatcher dispathser  = request.getRequestDispatcher("/smsReview.jsp");
                    response.addHeader("Access-Control-Allow-Origin", "*");
                    dispathser.forward(request, response);
                } else {
                    // Booking already approved
                }
            }
        }
    }
}
