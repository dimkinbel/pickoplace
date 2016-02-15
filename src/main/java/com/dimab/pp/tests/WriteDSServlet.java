package com.dimab.pp.tests;

import com.dimab.pickoplace.json.GsonUtils;
import com.google.appengine.tools.cloudstorage.*;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.lang.reflect.Type;
import java.nio.channels.Channels;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class WriteDSServlet extends HttpServlet {

    /**
     * Used below to determine the size of chucks to read in. Should be > 1kb and < 10MB
     */
    private static final int BUFFER_SIZE = 2 * 1024 * 1024;

    /**
     * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
     */
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String jsontext = new String("{\"name\":\"Name\",\"list\":[\"aaa\",\"bbb\"]}");
        Map<String, Object> map = new HashMap<String, Object>();
        JSONObject school = new JSONObject();
        ArrayList<String> list = new ArrayList<String>();
        list.add("john");
        list.add("mat");
        list.add("jason");
        list.add("matthew");
        map.put("list", list);

        jsontext = GsonUtils.toJson(map);
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
        JsonElement element = new JsonParser().parse(Channels.newReader(readChannel, "UTF-8"));
        JsonObject jso = element.getAsJsonObject();
        map = new HashMap<String, Object>();
        Type mapobj = new TypeToken<Map<String, Object>>() {
        }.getType();
        map = GsonUtils.fromJson(jso, mapobj);

        System.out.println(GsonUtils.toJson(map));
        System.out.println(element);
        System.out.println(jso.has("list"));

        String lisl = jso.get("list").toString();

        Type closeDateType = new TypeToken<List<String>>() {
        }.getType();
        List<String> list__ = GsonUtils.fromJson(lisl, closeDateType);
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
}
