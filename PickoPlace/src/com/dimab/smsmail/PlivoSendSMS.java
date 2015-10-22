package com.dimab.smsmail;

import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.util.LinkedHashMap;  
  
import com.plivo.helper.api.client.*;
import com.plivo.helper.api.response.message.MessageResponse;
import com.plivo.helper.exception.PlivoException;
 


public class PlivoSendSMS {
 

	public static final String PLIVO_AUTH_ID = "MAN2MWODJLNWQXYTC1NT";
	public static final String PLIVO_AUTH_TOKEN = "M2I1Nzg1N2E2MTQyNDBkMWI0OGU5NzI1YTE1MjJj";
	public static final String PLIVO_NUMBER = "14154847489";
	
	public MessageResponse sendSMSPlivio(String src , String dst, String text) {
		 
		    RestAPI api = new RestAPI(PLIVO_AUTH_ID, PLIVO_AUTH_TOKEN, "v1");
	        
	        LinkedHashMap<String, String> parameters = new LinkedHashMap<String, String>();
	        parameters.put("src", src); // Sender's phone number with country code
	        parameters.put("dst", dst); // Receiver's phone number with country code
	        parameters.put("text", text); // Your SMS text message
	        parameters.put("url", "http://www.pickoplace.com/plivioresponse"); // The URL to which with the status of the message is sent
	        parameters.put("method", "POST"); // The method used to call the url
	            
	        try {
	            // Send the message
	            MessageResponse msgResponse = api.sendMessage(parameters);

	            // Print the response
	            System.out.print(getFields(msgResponse));
	            // Print the Api ID
	            // System.out.println("Api ID : " + msgResponse.apiId);
	            // Print the Response Message
	            // System.out.println("Message : " + msgResponse.message);
	            /*
	            if (msgResponse.serverCode == 202) {
	                // Print the Message UUID
	                System.out.println("Message UUID : " + msgResponse.messageUuids.get(0).toString());
	            } else {
	                System.out.println(msgResponse.error); 
	            }
	            */
	            return msgResponse;
	        } catch (PlivoException e) {
	            System.out.println(e.getLocalizedMessage());
	        } catch (IllegalAccessException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
	        return null;
	}
 
	
    public static String getFields(Object obj) throws IllegalAccessException {
        StringBuffer buffer = new StringBuffer();
        Field[] fields = obj.getClass().getDeclaredFields();
        for (Field f : fields) {
          if (!Modifier.isStatic(f.getModifiers())) {
            f.setAccessible(true);
            Object value = f.get(obj);
            buffer.append(f.getName());
            buffer.append("=");
            buffer.append("" + value);
            buffer.append("\n");
          }
        }
        return buffer.toString();
    }
}
