package com.dimab.pp.login;
import java.io.*;
import java.lang.reflect.Type;
import java.util.Map;


import com.dimab.pickoplace.utils.JsonUtils;
import com.dimab.pp.login.dto.FBmeResponseJSON;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
 


public class FBVerifyToken {
      HttpClient client = new DefaultHttpClient();
	  HttpGet request;
	  HttpResponse response;

	  String longLiveToken = "";


	public String getLongLiveToken() {
		return longLiveToken;
	}

	public void setLongLiveToken(String longLiveToken) {
		this.longLiveToken = longLiveToken;
	}

	private static String CLIENT_ID;
	private static String CLIENT_SECRET;

	static {
		try {
			Reader reader = new FileReader("admin/facebook_secrets.json");
			JsonElement element =new JsonParser().parse(reader);
			JsonObject jso = element.getAsJsonObject();
			Type type = new TypeToken<Map<String,String>>(){}.getType();
			Map<String,String> facebookSecrets = JsonUtils.deserialize(jso,type);
			CLIENT_ID = facebookSecrets.get("client_id");
			CLIENT_SECRET = facebookSecrets.get("client_secret");
		} catch (IOException e) {
			throw new Error("No client_secrets.json found", e);
		}
	}
	public String getLongLivedAccessToken(String access_token) {
		String long_lived_access_token = "";
		this.request = new HttpGet("https://graph.facebook.com/oauth/access_token?client_id="+CLIENT_ID+"&client_secret="+CLIENT_SECRET+"&grant_type=fb_exchange_token&fb_exchange_token="+access_token);
		StringBuilder builder = new StringBuilder();
		String line = "";
		try {
			this.response = client.execute(request);
			if(response.getStatusLine().getStatusCode()==200) {
				BufferedReader rd;
				try {
					rd = new BufferedReader (new InputStreamReader(this.response.getEntity().getContent()));
					while ((line = rd.readLine()) != null) {
						builder.append(line);
					}
					String responseString = builder.toString();
					System.out.println("LongLived Response:"+responseString);
					long_lived_access_token = responseString.replace("access_token=","").replaceAll("\\&expires=.*","");
					System.out.println(long_lived_access_token);
				} catch (IllegalStateException | IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}


			} else {
				System.out.println("RETURN NULL");
			}
		} catch (ClientProtocolException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return long_lived_access_token;
	}
	public FBVerifyToken() {
		super();
	}

	public FBVerifyToken(String token) {
		super();
		this.longLiveToken = this.getLongLivedAccessToken(token);
	}

	public boolean isValid()  {
		 if(response.getStatusLine().getStatusCode()==200) {
			 return true;
		 } else {
			 return false;
		 }

	}

	public FBmeResponseJSON getData(String token) {
		FBmeResponseJSON fbjson;
		StringBuilder builder = new StringBuilder();
	    String line = "";
		this.request = new HttpGet("https://graph.facebook.com/me?access_token="+token);
		try {
			this.response = client.execute(request);
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

					if(fbjson.getError() == null) {
						return fbjson;
					} else {
						return null;
					}
				} catch (IllegalStateException | IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
					return null;
				}


			} else {
				return null;
			}

		} catch (ClientProtocolException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
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
