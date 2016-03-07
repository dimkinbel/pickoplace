package com.dimab.pp.account;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


import com.dimab.pickoplace.utils.JsonUtils;
import com.dimab.pp.dto.IFsave;
import com.dimab.pp.dto.iFrameObj;
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
 

public class SaveIframe extends HttpServlet {
	private static final long serialVersionUID = 1L;

    public SaveIframe() {
        super();
    }

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		TransactionOptions options = TransactionOptions.Builder.withXG(true);
		Transaction txn = datastore.beginTransaction(options);
  		Map <String , Object> map = new HashMap<String , Object>();
		Date date = new Date();

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
			response.addHeader("Access-Control-Allow-Origin", "*");
			response.sendRedirect(returnurl);
		} else {
			genuser = tokenValid.getUser();
			username_email = genuser.getEmail();
		}
		SimpleDateFormat dateFormat = new SimpleDateFormat("ddMMMy HH:mm");

		String placeIDvalue = request.getParameter("pid");
		String ifid = request.getParameter("ifid");
		String ifsaveString = request.getParameter("ifsave");
		iFrameObj SaveObject = JsonUtils.deserialize(ifsaveString, iFrameObj.class);
		SaveObject.setIfid(ifid);
		SaveObject.setUser(username_email);
		SaveObject.setDate(dateFormat.format( date ));
		SaveObject.setTime(date.getTime());

		Filter ifidfilter = new  FilterPredicate("ifid",FilterOperator.EQUAL,ifid);
 	    Query piq = new Query("IFrames").setFilter(ifidfilter);
        PreparedQuery sbpiq = datastore.prepare(piq);
  		Entity ifidEntity = sbpiq.asSingleEntity();
  		if (ifidEntity == null) {

  			ifidEntity = new Entity("IFrames");
  			ifidEntity.setProperty("ifid", ifid);
  			ifidEntity.setProperty("pid", placeIDvalue);
  			ifidEntity.setProperty("savedby", username_email);
  			ifidEntity.setProperty("date", date);
			ifidEntity.setUnindexedProperty("width",SaveObject.getWidth());
			ifidEntity.setUnindexedProperty("height",SaveObject.getHeight());
			ifidEntity.setUnindexedProperty("booking",SaveObject.getBooking());
			ifidEntity.setUnindexedProperty("theme",SaveObject.getTheme());
  			map.put("newifid", true);
  		} else {
  			ifidEntity.setProperty("ifid", ifid);
  			ifidEntity.setProperty("pid", placeIDvalue);
  			ifidEntity.setProperty("savedby", username_email);
  			ifidEntity.setProperty("date", date);
			ifidEntity.setUnindexedProperty("width",SaveObject.getWidth());
			ifidEntity.setUnindexedProperty("height",SaveObject.getHeight());
			ifidEntity.setUnindexedProperty("booking",SaveObject.getBooking());
			ifidEntity.setUnindexedProperty("theme",SaveObject.getTheme());
  			map.put("newifid", false);
  		}
  		datastore.put(ifidEntity);
  		txn.commit();

		List<iFrameObj> iframeList = new ArrayList<iFrameObj>();
		iframeList.add(SaveObject);

		map.put("ifid", ifid);
		map.put("list", iframeList);
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(JsonUtils.serialize(map));
	}

}
