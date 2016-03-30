package com.dimab.pp.adminRequestServlets;

import com.dimab.pp.database.GetBookingShapesDataFactory;
import com.dimab.pp.dto.BookingRequestWrap;
import com.dimab.pp.dto.MailModel;
import com.dimab.smsmail.MailSenderFabric;
import com.google.appengine.api.datastore.*;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by dima on 29-Mar-16.
 */
@WebServlet(name = "BookingReviewResponse")
public class BookingReviewResponse extends HttpServlet {


    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String confirmed = request.getParameter("confirmed");
        String pid = request.getParameter("pid");
        String bid = request.getParameter("bid");
        String code = request.getParameter("code");

            DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
            Query.Filter codeFilter = new Query.FilterPredicate("reviewCode", Query.FilterOperator.EQUAL, code);
            Query.Filter pidF = new Query.FilterPredicate("bid", Query.FilterOperator.EQUAL,bid);
            Query.Filter bidF =   new Query.FilterPredicate("pid", Query.FilterOperator.EQUAL,pid);

            Query.Filter book_filter  = Query.CompositeFilterOperator.and(codeFilter,pidF, bidF);

            Query q = new Query("BookingOrders").setFilter(book_filter);
            PreparedQuery pq = datastore.prepare(q);
            Entity bookingEntity = pq.asSingleEntity();

            if (bookingEntity != null) {
                if (bookingEntity.getProperty("approved") != null && (boolean) bookingEntity.getProperty("approved") == false) {


                    GetBookingShapesDataFactory bookingDataFactory = new GetBookingShapesDataFactory();
                    BookingRequestWrap booking = bookingDataFactory.getBookData(bookingEntity);
                    booking.setAnswer(true);
                    MailModel mmodel = new MailModel();
                    MailSenderFabric mailFabric = new MailSenderFabric();
                    mmodel.setGenuser(booking.getUser());
                    mmodel.setBookingRequestsWrap(booking);

                    if(confirmed.equals("true")) {
                        bookingEntity.setProperty("approved",true);
                        booking.setReviewAnswer(true);
                        mmodel.setType("userReviewConfirmation");
                    } else {
                        bookingEntity.setProperty("approved",false);
                        booking.setReviewAnswer(false);
                        mmodel.setType("userReviewDecline");
                    }

                    if (mailFabric.isSubscribed(datastore, booking.getUser())) {
                        String userKeyString = mailFabric.getUserKey(datastore, booking.getUser());
                        booking.setUserEntityKeyString(userKeyString);

                        mmodel.setTo(booking.getUser().getEmail());

                        mailFabric.SendEmail(mmodel);
                    }

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
