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

import com.dimab.pp.dto.PlaceRatingDTO;
import com.dimab.pp.login.CheckTokenValid;
import com.dimab.pp.login.GenericUser;
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
import com.google.gson.Gson;
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
		GenericUser genuser = tokenValid.getUser();
		if(genuser==null) {
			String returnurl = "/welcome.jsp";
			response.sendRedirect(returnurl);
			return;
		} else {
			DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
			TransactionOptions options = TransactionOptions.Builder.withXG(true);
			Transaction txn = datastore.beginTransaction(options);
			
			Gson gson = new Gson();
			username_email = genuser.getEmail();
			Type ratingType = new TypeToken<PlaceRatingDTO>(){}.getType();
			PlaceRatingDTO rating = gson.fromJson(jsonString, ratingType);
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
			ratingEntity.setProperty("review",   rating.getTscore());
			
			Filter pidFilter = new  FilterPredicate("pid",FilterOperator.EQUAL,pid);
			Query sq_ = new Query("PlaceRating").setFilter(pidFilter);
			PreparedQuery psq_ = datastore.prepare(sq_);
	  		Entity PlaceRatingEntity = psq_.asSingleEntity();
			if(PlaceRatingEntity == null) {				
				PlaceRatingEntity = new Entity("PlaceRating");
				PlaceRatingEntity.setProperty("pid", pid);
				Integer total = 1;
				PlaceRatingEntity.setProperty("food",     rating.getFscore());
				PlaceRatingEntity.setProperty("foodTotal",      total);
				PlaceRatingEntity.setProperty("staff",    rating.getSscore());
				PlaceRatingEntity.setProperty("staffTotal",     total);
				PlaceRatingEntity.setProperty("location", rating.getLscore());
				PlaceRatingEntity.setProperty("locationTotal",  total);
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
				}
				if(rating.getSscore() > 0) {
					
					Double average = (staffScore * staffTotal + rating.getSscore())/(staffTotal+1);
					staffTotal+=1;
					PlaceRatingEntity.setProperty("staff",       average);
					PlaceRatingEntity.setProperty("staffTotal",  staffTotal);
				}
				if(rating.getLscore() > 0) {
					
					Double average = (locationScore * locationTotal + rating.getLscore())/(locationTotal+1);
					locationTotal+=1;
					PlaceRatingEntity.setProperty("location",       average);
					PlaceRatingEntity.setProperty("locationTotal",  locationTotal);
				}
			}
			datastore.put(PlaceRatingEntity);
			datastore.put(ratingEntity);
			
			Filter bidFilter = new FilterPredicate("bid", FilterOperator.EQUAL,bid);
			Query sqb_ = new Query("BookingOrders").setFilter(bidFilter);
			PreparedQuery psqb_ = datastore.prepare(sqb_);
			if(psqb_.asSingleEntity()!=null) {
				PlaceRatingDTO ShortRating = rating;
				ShortRating.setTscore(""); // Removing review text
				String ratingString = gson.toJson(ShortRating);
				Entity bookingEntity = psqb_.asSingleEntity();
				bookingEntity.setProperty("rating", ratingString);
				datastore.put(bookingEntity);
			}
			
			txn.commit();
			rating.setTscore("");
			map.put("status", "OK");
			map.put("rating", rating);
			
		}
		
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(new Gson().toJson(map));
	}

}
