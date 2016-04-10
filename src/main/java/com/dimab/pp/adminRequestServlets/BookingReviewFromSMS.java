package com.dimab.pp.adminRequestServlets;

import com.dimab.pp.database.GetBookingShapesDataFactory;
import com.dimab.pp.dto.BookingRequestWrap;
import com.google.appengine.api.datastore.*;
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

/**
 * Created by dima on 28-Mar-16.
 */
@WebServlet(name = "BookingReviewFromSMS")
public class BookingReviewFromSMS extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String ReviewCode = request.getParameter("c");
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
        if (true) {
            DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
            Query.Filter codeFilter = new Query.FilterPredicate("reviewCode", Query.FilterOperator.EQUAL, ReviewCode);

            Query q = new Query("BookingOrders").setFilter(codeFilter);
            PreparedQuery pq = datastore.prepare(q);
            Entity bookingEntity = pq.asSingleEntity();

            if (bookingEntity != null) {
                if (bookingEntity.getProperty("approved") != null && (boolean) bookingEntity.getProperty("approved") == false) {
                    GetBookingShapesDataFactory bookingDataFactory = new GetBookingShapesDataFactory();
                    BookingRequestWrap booking = bookingDataFactory.getBookData(bookingEntity);

                    booking.setReviewCode(ReviewCode);
                    booking.setAnswer(false);
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
