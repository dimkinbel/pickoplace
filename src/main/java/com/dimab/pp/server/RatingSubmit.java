package com.dimab.pp.server;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.dimab.pickoplace.utils.JsonUtils;
import com.dimab.pp.dto.PlaceRatingDTO;
import com.dimab.pp.login.CheckTokenValid;
import com.dimab.pp.login.GenericUser;
import com.dimab.pp.search.SearchFabric;
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
import com.google.gson.reflect.TypeToken;


public class RatingSubmit extends HttpServlet {
	private static final long serialVersionUID = 1L;
       

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String jsonString = request.getParameter("rating");	
		System.out.println(jsonString);
		Map <String , Object> map = new HashMap<String , Object>();
		map.put("status", "ERROR");
		
		String username_email = new String();
		CheckTokenValid tokenValid = new CheckTokenValid(request);
		GenericUser genuser = new GenericUser();
		try {	
			genuser = tokenValid.getUser();
		} catch (NullPointerException e) {
			String returnurl = "/welcome.jsp";
			response.addHeader("Access-Control-Allow-Origin", "*");
			response.sendRedirect(returnurl);
		}
		if(genuser==null) {
			String returnurl = "/welcome.jsp";
			response.sendRedirect(returnurl);
			return;
		} else {
			DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
			TransactionOptions options = TransactionOptions.Builder.withXG(true);
			Transaction txn = datastore.beginTransaction(options);
			 
			username_email = genuser.getEmail();
			Type ratingType = new TypeToken<PlaceRatingDTO>(){}.getType();
			PlaceRatingDTO rating = JsonUtils.deserialize(jsonString, ratingType);
			String pid = rating.getPid();
			String bid = rating.getBid();
			
			Date date = new Date();
			Entity ratingEntity = new Entity("UserRating");
			ratingEntity.setProperty("username", username_email);
			ratingEntity.setProperty("date", date);
			ratingEntity.setProperty("pid",      pid);
			ratingEntity.setProperty("bid",      bid);
			ratingEntity.setProperty("food",     rating.getFscore());
			ratingEntity.setProperty("staff",    rating.getSscore());
			ratingEntity.setProperty("location", rating.getLscore());
			ratingEntity.setUnindexedProperty("review",   rating.getTscore());
			
			Filter pidFilter = new  FilterPredicate("pid",FilterOperator.EQUAL,pid);
			Query sq_ = new Query("PlaceRating").setFilter(pidFilter);
			PreparedQuery psq_ = datastore.prepare(sq_);
	  		Entity PlaceRatingEntity = psq_.asSingleEntity();
	  		Double averageRating = (double)0;
			if(PlaceRatingEntity == null) {				
				PlaceRatingEntity = new Entity("PlaceRating");
				PlaceRatingEntity.setProperty("pid", pid);
				Integer total = 1;
				Double sumRating = (double)0;
				Integer totalsubmitted = 0;
				if(rating.getFscore() > 0) {
					 PlaceRatingEntity.setProperty("food",     rating.getFscore());
					 PlaceRatingEntity.setProperty("foodTotal",      total);
					 sumRating+=rating.getFscore();
					 totalsubmitted+=1;
				}  else {
					 PlaceRatingEntity.setProperty("food",     0.0);
					 PlaceRatingEntity.setProperty("foodTotal",      0);
				}
				if(rating.getSscore() > 0) {
					PlaceRatingEntity.setProperty("staff",    rating.getSscore());
					PlaceRatingEntity.setProperty("staffTotal",     total);
					sumRating+=rating.getSscore();
					totalsubmitted+=1;
				} else {
					PlaceRatingEntity.setProperty("staff",    0.0);
					PlaceRatingEntity.setProperty("staffTotal",     0);
				}
				if(rating.getLscore() > 0) {
					PlaceRatingEntity.setProperty("location", rating.getLscore());
					PlaceRatingEntity.setProperty("locationTotal",  total);
					sumRating+=rating.getLscore();
					totalsubmitted+=1;
				} else {
					PlaceRatingEntity.setProperty("location", 0.0);
					PlaceRatingEntity.setProperty("locationTotal",  0);
				}
				averageRating = sumRating / totalsubmitted;
			} else {
				Double foodScore = (Double)PlaceRatingEntity.getProperty("food");
				Integer foodTotal = (int)(long)PlaceRatingEntity.getProperty("foodTotal");
				Double staffScore = (Double)PlaceRatingEntity.getProperty("staff");
				Integer staffTotal = (int)(long)PlaceRatingEntity.getProperty("staffTotal");
				Double locationScore = (Double)PlaceRatingEntity.getProperty("location");
				Integer locationTotal = (int)(long)PlaceRatingEntity.getProperty("locationTotal");
				if(rating.getFscore() > 0) {
					
					Double average = (foodScore * foodTotal + rating.getFscore())/(foodTotal+1);
					foodTotal+=1;
					PlaceRatingEntity.setProperty("food",       average);
					PlaceRatingEntity.setProperty("foodTotal",  foodTotal);
					foodScore = average;
				}
				if(rating.getSscore() > 0) {
					
					Double average = (staffScore * staffTotal + rating.getSscore())/(staffTotal+1);
					staffTotal+=1;
					PlaceRatingEntity.setProperty("staff",       average);
					PlaceRatingEntity.setProperty("staffTotal",  staffTotal);
					staffScore = average;
				}
				if(rating.getLscore() > 0) {
					
					Double average = (locationScore * locationTotal + rating.getLscore())/(locationTotal+1);
					locationTotal+=1;
					PlaceRatingEntity.setProperty("location",       average);
					PlaceRatingEntity.setProperty("locationTotal",  locationTotal);
					locationScore = average;
				}
				averageRating = (locationScore * locationTotal + staffScore * staffTotal + foodScore * foodTotal) / (foodTotal + staffTotal + locationTotal);
			}
			datastore.put(PlaceRatingEntity);
			datastore.put(ratingEntity);
			
			Filter placeIdFilter = new  FilterPredicate("placeUniqID",FilterOperator.EQUAL,pid);
			Query q = new Query("CanvasState").setFilter(placeIdFilter);
			PreparedQuery pq = datastore.prepare(q);
	  		Entity userCanvasState = pq.asSingleEntity();
	  		userCanvasState.setProperty("TotalRating",averageRating);
	  		datastore.put(userCanvasState);
	  		
	  		SearchFabric searchIndexFabrix = new SearchFabric();
	  		searchIndexFabrix.updateRating(pid, averageRating);
	  		
			Filter bidFilter = new FilterPredicate("bid", FilterOperator.EQUAL,bid);
			Query sqb_ = new Query("BookingOrders").setFilter(bidFilter);
			PreparedQuery psqb_ = datastore.prepare(sqb_);
			if(psqb_.asSingleEntity()!=null) {
				PlaceRatingDTO ShortRating = rating;
				ShortRating.setTscore(""); // Removing review text
				String ratingString = JsonUtils.serialize(ShortRating);
				Entity bookingEntity = psqb_.asSingleEntity();
				bookingEntity.setUnindexedProperty("rating", ratingString);
				datastore.put(bookingEntity);
			}
			
			txn.commit();
			rating.setTscore("");
			map.put("status", "OK");
			map.put("rating", rating);
			
		}
		
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(JsonUtils.serialize(map));
	}

}
