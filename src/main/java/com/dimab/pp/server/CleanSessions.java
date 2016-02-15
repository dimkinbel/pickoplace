package com.dimab.pp.server;

import com.google.appengine.api.datastore.*;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;

public class CleanSessions extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

        System.out.println("Clean sessions");

        Date date = new Date();
        Long seconds = date.getTime() - 24 * 3600 * 1000;
        System.out.println("Current Seconds:" + seconds);
        Filter expiredFilter = new FilterPredicate("_expires", FilterOperator.LESS_THAN, seconds);
        Query q = new Query("_ah_SESSION").setFilter(expiredFilter);

        PreparedQuery pq = datastore.prepare(q);
        int deleted = 0;
        for (Entity sessionEntity : pq.asIterable()) {
            datastore.delete(sessionEntity.getKey());
            deleted++;

        }

        System.out.println("Total deleted:" + deleted);
    }
}
