package com.dimab.pp.account;

import java.io.IOException;
import java.lang.reflect.Type;
import java.text.SimpleDateFormat;
import java.util.*;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.dimab.pickoplace.utils.JsonUtils;
import com.dimab.pp.dto.*;
import com.dimab.pp.login.CheckTokenValid;
import com.dimab.pp.login.dto.GenericUser;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.gson.reflect.TypeToken;


public class EditIFrame extends HttpServlet {
	private static final long serialVersionUID = 1L;

    public EditIFrame() {
        super();
    }

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		Map<String , Object> map = new HashMap<String , Object>();
		map.put("valid",false);
		
		String username_email = new String();
		CheckTokenValid tokenValid = new CheckTokenValid(request);
		GenericUser genuser = new GenericUser();
		try {	
			genuser = tokenValid.getUser();
		} catch (NullPointerException e) {
			String returnurl = "/welcome.jsp";
			response.addHeader("Access-Control-Allow-Origin", "*");
			response.sendRedirect(returnurl);
			return;
		}
		if(genuser==null) {
			String returnurl = "/welcome.jsp";
			response.addHeader("Access-Control-Allow-Origin", "*");
			response.sendRedirect(returnurl);
			return;
		} else {
			username_email = genuser.getEmail();
		}

		String placeIDvalue = request.getParameter("pid");
		String ifid = request.getParameter("ifid");


		Filter placeIdFilter  = new  FilterPredicate("placeUniqID",FilterOperator.EQUAL,placeIDvalue);
		Query q = new Query("CanvasState").setFilter(placeIdFilter);
		PreparedQuery pq = datastore.prepare(q);		
  		Entity userCanvasState = pq.asSingleEntity();
  		boolean allowedUser = false;
  		if (userCanvasState != null) {
			Type closeDateType = new TypeToken<List<String>>(){}.getType();
  			List<String> admins = JsonUtils.deserialize((String) userCanvasState.getProperty("adminList"),closeDateType);
			if(admins.contains(username_email)) {
				allowedUser = true;
				map.put("valid",true);
			}
 
  		}
  		if(allowedUser) {
			Filter ifidfilter = new  FilterPredicate("ifid",FilterOperator.EQUAL,ifid);
			Query piq = new Query("IFrames").setFilter(ifidfilter);
			PreparedQuery sbpiq = datastore.prepare(piq);
			Entity iframeEntity = sbpiq.asSingleEntity();
			if (iframeEntity != null) {
				String uid = (String)iframeEntity.getProperty("savedby");
				Date date_ = (Date)iframeEntity.getProperty("date");
				Integer width = (int)(long)iframeEntity.getProperty("width");
				Integer height = (int)(long)iframeEntity.getProperty("height");
				Boolean booking = (Boolean)iframeEntity.getProperty("booking");
				String theme = (String)iframeEntity.getProperty("theme");


				SimpleDateFormat dateFormat = new SimpleDateFormat("ddMMMy HH:mm");
				System.out.println("date: " + dateFormat.format( date_ ) );

				iFrameObj ifresp = new iFrameObj();
				ifresp.setDate(dateFormat.format( date_ ));
				ifresp.setIfid(ifid);
				ifresp.setUser(uid);
				ifresp.setTime(date_.getTime());
				ifresp.setWidth(width);
				ifresp.setHeight(height);
				ifresp.setBooking(booking);
				ifresp.setTheme(theme);

				map.put("iframe",ifresp);
			} else {
				map.put("reason","no_iframe");
			}
		} else {
			map.put("reason","not_allowed");
		}


		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(JsonUtils.serialize(map));

	}

}
