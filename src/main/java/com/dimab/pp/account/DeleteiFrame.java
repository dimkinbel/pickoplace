package com.dimab.pp.account;

import java.io.IOException;
import java.lang.reflect.Type;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


import com.dimab.pickoplace.utils.JsonUtils;
import com.dimab.pp.dto.IFresponse;
import com.dimab.pp.dto.IFsave;
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
import com.google.gson.reflect.TypeToken;


public class DeleteiFrame extends HttpServlet {
	private static final long serialVersionUID = 1L;

    public DeleteiFrame() {
        super();
    }

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		TransactionOptions options = TransactionOptions.Builder.withXG(true);
		Transaction txn = datastore.beginTransaction(options);
		
  		Map <String , Object> map = new HashMap<String , Object>();

		String username_email = new String();
		CheckTokenValid tokenValid = new CheckTokenValid(request);
		try {
			GenericUser genuser = tokenValid.getUser();
			if(genuser==null) {
				String returnurl = "/welcome.jsp";
				response.addHeader("Access-Control-Allow-Origin", "*");
				response.sendRedirect(returnurl);
			} else {
				username_email = genuser.getEmail();
			}
		} catch (NullPointerException e) {
			String returnurl = "/welcome.jsp";
			response.addHeader("Access-Control-Allow-Origin", "*");
			response.sendRedirect(returnurl);
		}
		String placeIDvalue = request.getParameter("pid");
		String iFID = request.getParameter("ifid");
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
			Filter ifidfilter = new FilterPredicate("ifid", FilterOperator.EQUAL, iFID);
			Query piq = new Query("IFrames").setFilter(ifidfilter);
			PreparedQuery sbpiq = datastore.prepare(piq);
			Entity ifidEntity = sbpiq.asSingleEntity();
			if (ifidEntity != null) {
				datastore.delete(ifidEntity.getKey());
				txn.commit();
				map.put("status", "removed");
			} else {
				map.put("status", "notremoved");
			}
		}
		
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(JsonUtils.serialize(map));
	}

}
