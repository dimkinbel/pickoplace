package com.dimab.pp.cron;

import com.dimab.pp.dto.GoogleTimezoneResponse;
import com.dimab.pp.dto.TimeZonePair;
import com.google.appengine.api.datastore.*;
import com.google.appengine.api.urlfetch.*;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.Type;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


/**
 */
public class UpdateTimezone extends HttpServlet {

    private static final long serialVersionUID = 1L;

    public UpdateTimezone() {
        super();
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("UpdateTimezone.doGet");
        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        TransactionOptions options = TransactionOptions.Builder.withXG(true);
        Transaction txn = datastore.beginTransaction(options);
        Gson gson = new Gson();

        Query.Filter timezonesParamsFilter = new Query.FilterPredicate("parameter_", Query.FilterOperator.EQUAL, "timezones");
        Query qs = new Query("SystemParams").setFilter(timezonesParamsFilter);
        PreparedQuery pqs = datastore.prepare(qs);
        Entity timezonesEntity = pqs.asSingleEntity();
        if (timezonesEntity != null) {
            String timezonesJSON = ((Text) timezonesEntity.getProperty("value_")).getValue();
            System.out.println(timezonesJSON);
            List<TimeZonePair> timezonePairs = new ArrayList<>();
            Type collectionType = new TypeToken<List<TimeZonePair>>() {}.getType();
            timezonePairs = gson.fromJson(timezonesJSON, collectionType);

            List<TimeZonePair> newTimezonePairs = new ArrayList<>();

            boolean timzonechanged = false;

            HTTPRequest req_;
            HTTPResponse resp_ ;
            for (TimeZonePair timezonePair : timezonePairs) {
                if(timezonePair.getLat()==null || timezonePair.getLat().isNaN() || timezonePair.getLng()==null || timezonePair.getLng().isNaN()) {
                    newTimezonePairs.add(timezonePair);
                    continue;
                }
                Calendar rightNow = Calendar.getInstance();
                rightNow.setTime(new Date());
                Double tzoffsetm = timezonePair.getOffset()*(double)60;
                Integer offsetMinutes = tzoffsetm.intValue();
                System.out.println("offsetMinutes:"+offsetMinutes);
                rightNow.add(Calendar.MINUTE,offsetMinutes);
                int hour = rightNow.get(Calendar.HOUR_OF_DAY);
                System.out.println(hour);

                if(hour >= 6 && hour <= 24) {
                    newTimezonePairs.add(timezonePair);
                    continue;
                }


                Double lat = timezonePair.getLat();
                Double lng = timezonePair.getLng();
                Integer seconds = Math.round((new Date().getTime())/1000);

                System.out.println( "https://maps.googleapis.com/maps/api/timezone/json?location="+lat+","+lng+"&timestamp="+seconds.toString()+"&sensor=false&key=AIzaSyBNaUZS38pz7ptKEl4I4JmY-f4EdPnWyGo");

                String json ="{}";
                URL url;
                try {
                    url = new URL("https://maps.googleapis.com/maps/api/timezone/json?location="+lat+","+lng+"&timestamp="+seconds.toString()+"&sensor=false&key=AIzaSyBNaUZS38pz7ptKEl4I4JmY-f4EdPnWyGo");
                    req_ = new HTTPRequest(url, HTTPMethod.GET);
                    req_.addHeader(new HTTPHeader("Content-Type","application/json"));
                    req_.setPayload(json.getBytes("UTF-8"));
                    resp_ = URLFetchServiceFactory.getURLFetchService().fetch(req_);
                } catch (MalformedURLException e) {
                    e.printStackTrace();
                    resp_ = null;
                    newTimezonePairs.add(timezonePair);
                    continue;
                } catch (IOException e) {
                    e.printStackTrace();
                    resp_ = null;
                    newTimezonePairs.add(timezonePair);
                    continue;
                }

                GoogleTimezoneResponse timezoneResponse = new GoogleTimezoneResponse();
                if(resp_!=null) {
                    String responseString;
                    try {
                        responseString = new String(resp_.getContent(),"UTF-8");
                        timezoneResponse = gson.fromJson(responseString, GoogleTimezoneResponse.class);
                        System.out.println(new Gson().toJson(timezoneResponse));
                    } catch (UnsupportedEncodingException e) {
                        e.printStackTrace();
                    }
                } else {
                    newTimezonePairs.add(timezonePair);
                    continue;
                }
                Double newOffset =  timezoneResponse.getRawOffset().doubleValue()/3600 + timezoneResponse.getDstOffset().doubleValue()/3600;
                if(newOffset.compareTo(timezonePair.getOffset()) != 0) {
                    timzonechanged = true;
                    System.out.println("New Offset:"+newOffset+". Old offset:  " + timezonePair.getOffset() );

                    Query.Filter timezoneIDfilter = new Query.FilterPredicate("timezoneID", Query.FilterOperator.EQUAL,timezonePair.getTimezoneID());
                    Query q = new Query("TimeZoneToPID").setFilter(timezoneIDfilter);
                    PreparedQuery pq = datastore.prepare(q);
                    Entity result = pq.asSingleEntity();
                    if (result != null) {
                        collectionType = new TypeToken<List<String>>(){}.getType();
                        List<String> pidlist = new ArrayList<String>();
                        if(result.getProperty("PIDlist")!=null) {
                            pidlist = gson.fromJson((String)result.getProperty("PIDlist"),collectionType);

                            for(String pid : pidlist) {
                                Query.Filter userPlaceEntityFilterByID = new Query.FilterPredicate("placeUniqID", Query.FilterOperator.EQUAL,pid);
                                Query q_ = new Query("UserPlace").setFilter(userPlaceEntityFilterByID);
                                PreparedQuery pq_ = datastore.prepare(q_);
                                Entity userPlaceEntity = pq_.asSingleEntity();
                                if(userPlaceEntity!=null) {
                                    System.out.println("userPlaceEntity offset Updated:"+pid);
                                    userPlaceEntity.setProperty("UTCoffcet",newOffset);
                                    datastore.put(userPlaceEntity);

                                    Key pidkey = KeyFactory.createKey(userPlaceEntity.getKey(),"CanvasState", pid);
                                    try {
                                        Entity canvasState = datastore.get(pidkey);
                                        canvasState.setUnindexedProperty("UTCoffcet",newOffset);
                                        datastore.put(canvasState);
                                        System.out.println("canvasState offset Updated:"+pid);
                                    } catch (EntityNotFoundException e) {

                                    }
                                }
                            }
                        }
                        result.setUnindexedProperty("offset",newOffset);
                        datastore.put(result);
                    }

                    timezonePair.setOffset(newOffset);

                } else {
                    System.out.println("Same Timezone Offset ("+timezonePair.getTimezoneID()+"):" + timezonePair.getOffset());
                }
                newTimezonePairs.add(timezonePair);
            }

            if(timzonechanged) {
                String timezonesString = gson.toJson(newTimezonePairs);
                Text timezonesText = new Text(timezonesString);
                timezonesEntity.setUnindexedProperty("value_", timezonesText);
                datastore.put(timezonesEntity);
            }
            txn.commit();
        } else {


        }
    }
}