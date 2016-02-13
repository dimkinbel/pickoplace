package com.dimab.pp.login;
import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;


import com.dimab.pickoplace.utils.JsonUtils;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
 


public class FBVerifyToken {
      HttpClient client = new DefaultHttpClient();
	  HttpGet request;
	  HttpResponse response;


	public FBVerifyToken(String token) {
		super();
		this.request = new HttpGet("https://graph.facebook.com/me?access_token="+token);
		try {
			this.response = client.execute(request);
		} catch (ClientProtocolException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
    
	public boolean isValid()  { 
		 if(response.getStatusLine().getStatusCode()==200) {
			 return true;
		 } else {
			 return false;
		 }
		
	}
	
	public FBmeResponseJSON getData() {
		FBmeResponseJSON fbjson = new FBmeResponseJSON(); 
		StringBuilder builder = new StringBuilder();
	    String line = "";
	    
		if(response.getStatusLine().getStatusCode()==200) {
			BufferedReader rd;
			try {
				rd = new BufferedReader (new InputStreamReader(this.response.getEntity().getContent()));
			    while ((line = rd.readLine()) != null) {
			        builder.append(line);
			    }
				String responseString = builder.toString();
				System.out.println("ssss:"+responseString);
				fbjson = JsonUtils.deserialize(responseString, FBmeResponseJSON.class);
				System.out.println(JsonUtils.serialize(fbjson));
				return fbjson;
			} catch (IllegalStateException | IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				return null;
			}


		} else {
			System.out.println("RETURN NULL");
			return null;
		}
	}

    static void getContent(InputStream inputStream, ByteArrayOutputStream outputStream)
            throws IOException {
          // Read the response into a buffered stream
          BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
          int readChar;
          while ((readChar = reader.read()) != -1) {
            outputStream.write(readChar);
          }
          reader.close();
        }
}
