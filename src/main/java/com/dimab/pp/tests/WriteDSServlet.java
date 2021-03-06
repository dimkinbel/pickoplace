package com.dimab.pp.tests;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.lang.reflect.Type;
import java.nio.ByteBuffer;
import java.nio.channels.Channels;
import java.nio.channels.ReadableByteChannel;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;


import com.google.appengine.tools.cloudstorage.GcsFileOptions;
import com.google.appengine.tools.cloudstorage.GcsFilename;
import com.google.appengine.tools.cloudstorage.GcsInputChannel;
import com.google.appengine.tools.cloudstorage.GcsOutputChannel;
import com.google.appengine.tools.cloudstorage.GcsService;
import com.google.appengine.tools.cloudstorage.GcsServiceFactory;
import com.google.appengine.tools.cloudstorage.RetryParams;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;


public class WriteDSServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	  private final GcsService gcsService = GcsServiceFactory.createGcsService(new RetryParams.Builder()
      .initialRetryDelayMillis(10)
      .retryMaxAttempts(10)
      .totalRetryPeriodMillis(15000)
      .build());

  /**Used below to determine the size of chucks to read in. Should be > 1kb and < 10MB */
  private static final int BUFFER_SIZE = 2 * 1024 * 1024;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public WriteDSServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		 Gson gson = new Gson();
		String jsontext = new String("{\"name\":\"Name\",\"list\":[\"aaa\",\"bbb\"]}");
		Map<String,Object> map = new HashMap<String,Object>();
		JSONObject school = new JSONObject();
		ArrayList<String> list = new ArrayList<String>();
		list.add("john");
		list.add("mat");
		list.add("jason");
		list.add("matthew");
		map.put("list", list);
 
		jsontext = gson.toJson(map);
		final GcsService gcsService = GcsServiceFactory.createGcsService(RetryParams.getDefaultInstance());
		GcsFileOptions.Builder optionsBuilder = new GcsFileOptions.Builder();
        GcsOutputChannel outputChannel;
        GcsInputChannel readChannel = null;
		
		  GcsFilename Sname = new GcsFilename("pp_free_place_json", "MyJSON.json");
          optionsBuilder = new GcsFileOptions.Builder();
          optionsBuilder.mimeType("application/json");
          outputChannel = gcsService.createOrReplace(Sname, optionsBuilder.build());
          copy(jsontext.getBytes(), Channels.newOutputStream(outputChannel));
		
         
          readChannel = gcsService.openReadChannel(Sname, 0);
          JsonElement element =new JsonParser().parse(Channels.newReader(readChannel,"UTF-8"));
          JsonObject jso = element.getAsJsonObject();
          map = new HashMap<String,Object>();
          Type mapobj = new TypeToken<Map<String,Object>>(){}.getType();
          map = gson.fromJson(jso, mapobj);
          
          System.out.println(gson.toJson(map));
          System.out.println(element);
          System.out.println(jso.has("list"));

          String lisl = jso.get("list").toString();
         
          Type closeDateType = new TypeToken<List<String>>(){}.getType();
  		  List<String> list__  = gson.fromJson(lisl, closeDateType);
  		  System.out.println(list__.size()); 
           for (String singleListVal : list__) {
               System.out.println(singleListVal);
            }
          

	}
	public static List<String> getStringListFromJsonArray(JSONArray jArray) throws JSONException {
	      List<String> returnList = new ArrayList<String>();
	      for (int i = 0; i < jArray.length(); i++) {
	        String val = jArray.getString(i);
	        returnList.add(val);
	      }
	      return returnList;
	 }
	private void copy(byte[] Byteinput, OutputStream output) throws IOException {
	    try {
	      InputStream input = new ByteArrayInputStream(Byteinput);
	      byte[] buffer = new byte[BUFFER_SIZE];
	      int bytesRead = input.read(buffer);
	      while (bytesRead != -1) {
	        output.write(buffer, 0, bytesRead);
	        bytesRead = input.read(buffer);
	      }
	    } finally {
	      output.close();
	    }
	  }

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

}
