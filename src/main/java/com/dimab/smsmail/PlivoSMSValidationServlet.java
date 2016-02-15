package com.dimab.smsmail;

import com.dimab.pickoplace.entity.EntityKind;
import com.dimab.pp.dto.PlivoSMSRequestJSON;
import com.dimab.pp.functions.RandomStringGenerator;
import com.google.appengine.api.datastore.*;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.gson.Gson;
import com.plivo.helper.api.response.message.MessageResponse;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Servlet implementation class PlivoSMSValidationServlet
 */
@WebServlet("/PlivoSMSValidationServlet")
public class PlivoSMSValidationServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
 
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		Map <String , Object> map = new HashMap<String , Object>();
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
 		TransactionOptions options = TransactionOptions.Builder.withXG(true);
 		Transaction txn = datastore.beginTransaction(options);
 		
		String jsonString =  request.getParameter("jsonObject");
		Gson gson = new Gson();
		PlivoSMSRequestJSON smsrequest = gson.fromJson(jsonString, PlivoSMSRequestJSON.class);
		String number = smsrequest.getNumber();
		PlivoSendSMS plivoFabric = new PlivoSendSMS();
		String sessionEmail = (String) request.getSession().getAttribute("userEmail");
		if( sessionEmail == null || sessionEmail.isEmpty() ) {
			map.put("status", "NOTLOGGED");
			response.setContentType("application/json");
			response.setCharacterEncoding("UTF-8");
			response.getWriter().write(new Gson().toJson(map));
			return;
		}
		System.out.println(sessionEmail);
		RandomStringGenerator randomGen = new RandomStringGenerator();
	    String verificationCode =  randomGen.generateRandomString(6,RandomStringGenerator.Mode.NUMERIC);
		
	    Filter UserExists = new  FilterPredicate("username",FilterOperator.EQUAL,sessionEmail);
		Query q = new Query(EntityKind.Users).setFilter(UserExists);
		PreparedQuery pq = datastore.prepare(q);
	    Entity result = pq.asSingleEntity();
	    if (result == null) {
	    	map.put("status", "NOTLOGGED");
			response.setContentType("application/json");
			response.setCharacterEncoding("UTF-8");
			response.getWriter().write(new Gson().toJson(map));
			return;	    	
	    } else {
	    	if(result.getProperty("validations") == null) {
	    		Integer validcount = 1;
	    		result.setUnindexedProperty("validations", validcount);
	    		Date date = new Date();
	    		result.setUnindexedProperty("lastvalidation", date);
	    	} else {
	    		Integer validcount = (int)(long)result.getProperty("validations");
	    		Date currentdate = new Date();
	    		if(validcount==5) {
	    			Date lastDate = (Date) result.getProperty("lastvalidation");
	    			Long secondsDifference = currentdate.getTime()/1000 - lastDate.getTime()/1000;
	    			if(secondsDifference < 1*60*60) {
	    				map.put("status", "WAIT");
	    				response.setContentType("application/json");
	    				response.setCharacterEncoding("UTF-8");
	    				response.getWriter().write(new Gson().toJson(map));
	    				return;	
	    			} else {
	    				// reset 5 SMS
	    				validcount = 1;
	    	    		result.setUnindexedProperty("validations", validcount);
	    	    		result.setUnindexedProperty("lastvalidation", currentdate);
	    			}
	    		} else {
	    			validcount+=1;
	    			result.setUnindexedProperty("validations", validcount); 
		    		result.setUnindexedProperty("lastvalidation", currentdate);
	    		}
	    	}
	    	result.setUnindexedProperty("validationCode", verificationCode);
	    	result.setUnindexedProperty("phone", number);
	    	result.setUnindexedProperty("phoneValid", false);
	    	result.setUnindexedProperty("phoneCountry", gson.toJson(smsrequest.getCountryData()));
	    	datastore.put(result);
	    	txn.commit();
	    
	    
			MessageResponse msgResponse = new MessageResponse();
			String message = "PickoPlace code: " + verificationCode;
			
			if(smsrequest.getCountryData().getIso2().equals("us")) {
				 msgResponse = plivoFabric.sendSMSPlivio("+972526775065", number, message);
			} else {
				 msgResponse = plivoFabric.sendSMSPlivio("PickoPlace", number, message);
			}
	        if(msgResponse == null) {
	        	map.put("status", "NULL");
	        	result.removeProperty("validationCode" );
		    	result.removeProperty("phone");
		    	result.removeProperty("phoneValid" );
		    	result.removeProperty("phoneCountry");
		    	datastore.put(result);
		    	txn.commit();
	        } else {
	        	if (msgResponse.serverCode == 202) {
	                // Print the Message UUID
	                System.out.println("Message UUID : " + msgResponse.messageUuids.get(0).toString());
	                map.put("status", "OK");
	            } else {
	                System.out.println(msgResponse.error); 
	                map.put("status", "ERROR");
	                
	                result.removeProperty("validationCode" );
			    	result.removeProperty("phone");
			    	result.removeProperty("phoneValid" );
			    	result.removeProperty("phoneCountry");
			    	datastore.put(result);
			    	txn.commit();
	            }
	        }
	        
			response.setContentType("application/json");
			response.setCharacterEncoding("UTF-8");
			response.getWriter().write(new Gson().toJson(map));
	    }
	}

}
