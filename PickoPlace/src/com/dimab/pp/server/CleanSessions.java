package com.dimab.pp.server;

import java.io.IOException;
import java.util.Date;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Transaction;
import com.google.appengine.api.datastore.TransactionOptions;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.appengine.api.datastore.Query.SortDirection;

public class CleanSessions extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
	
		System.out.println("Clean sessions");
		
		Date date = new Date();
		Long seconds =  date.getTime() - 24*3600*1000;
		System.out.println("Current Seconds:"+seconds);
		Filter expiredFilter = new FilterPredicate("_expires", FilterOperator.LESS_THAN,seconds);
		Query q = new Query("_ah_SESSION").setFilter(expiredFilter);
		
        PreparedQuery pq = datastore.prepare(q);
        int deleted = 0;
        for (Entity sessionEntity : pq.asIterable()) {
        	datastore.delete(sessionEntity.getKey());
        	deleted++;
        	
        }
        
        System.out.println("Total deleted:"+deleted);
     
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
	}

}
