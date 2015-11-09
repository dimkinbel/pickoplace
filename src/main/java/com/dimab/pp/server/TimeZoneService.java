package com.dimab.pp.server;

import com.dimab.pp.dto.TimeZonePair;
import com.google.appengine.api.datastore.*;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by dima on 07-Nov-15.
 */
public class TimeZoneService {
    public void updateTimeZonePID(String timezone,Double offset,String pid,Double lat , Double lng) {
        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        TransactionOptions options = TransactionOptions.Builder.withXG(true);
        Transaction txn = datastore.beginTransaction(options);
        Gson gson = new Gson();

        Filter timezoneIDfilter = new Query.FilterPredicate("timezoneID", Query.FilterOperator.EQUAL,timezone);
        Query q = new Query("TimeZoneToPID").setFilter(timezoneIDfilter);
        PreparedQuery pq = datastore.prepare(q);
        Entity result = pq.asSingleEntity();
        if (result != null) {
            Type collectionType = new TypeToken<List<String>>(){}.getType();
            List<String> pidlist = new ArrayList<String>();
            if(result.getProperty("PIDlist")!=null) {
                pidlist = gson.fromJson((String)result.getProperty("PIDlist"),collectionType);
                if(!pidlist.contains(pid)) {
                    pidlist.add(pid);
                    result.setUnindexedProperty("PIDlist",gson.toJson(pidlist));
                    result.setUnindexedProperty("offset",offset);
                    datastore.put(result);
                }
            }
        } else {
            Entity timezoneEntity = new Entity("TimeZoneToPID");
            List<String> pidlist = new ArrayList<String>();
            pidlist.add(pid);
            timezoneEntity.setProperty("timezoneID",timezone);
            timezoneEntity.setUnindexedProperty("PIDlist",gson.toJson(pidlist));
            timezoneEntity.setUnindexedProperty("offset",offset);
            datastore.put(timezoneEntity);
        }

        Filter timezonesParamsFilter = new Query.FilterPredicate("parameter_", Query.FilterOperator.EQUAL,"timezones");
        Query qs = new Query("SystemParams").setFilter(timezonesParamsFilter);
        PreparedQuery pqs = datastore.prepare(qs);
        Entity timezonesEntity = pqs.asSingleEntity();
        if (timezonesEntity != null) {
            String timezonesJSON =  ((Text) timezonesEntity.getProperty("value_")).getValue();
            List<TimeZonePair> timezonePairs = new ArrayList<TimeZonePair>();
            Type collectionType = new TypeToken<List<TimeZonePair>>(){}.getType();
            timezonePairs = gson.fromJson(timezonesJSON,collectionType);

            List<TimeZonePair> newTimezonePairs = new  ArrayList<TimeZonePair>();

            boolean timezonefound = false;
            boolean timzonechanged = false;
            for(TimeZonePair timezonePair:timezonePairs) {

                if(timezonePair.getTimezoneID().equals(timezone)) {
                    timezonefound = true;
                    if(timezonePair.getOffset() != offset) {
                        timzonechanged = true;
                        timezonePair.setOffset(offset);
                    }
                }
                newTimezonePairs.add(timezonePair);
            }
            if(timezonefound) {
                if(timzonechanged) {
                    // Update Timezone pair (new Offset)
                    String timezonesString = gson.toJson(newTimezonePairs);
                    Text timezonesText = new Text(timezonesString);
                    timezonesEntity.setUnindexedProperty("value_", timezonesText);
                    datastore.put(timezonesEntity);
                } else {
                    // No offset change. No need to update
                }
            } else {
                TimeZonePair timezonePair = new TimeZonePair();
                timezonePair.setTimezoneID(timezone);
                timezonePair.setOffset(offset);
                timezonePair.setLat(lat);
                timezonePair.setLng(lng);
                timezonePairs.add(timezonePair);
                String timezonesString = gson.toJson(timezonePairs);
                Text timezonesText = new Text(timezonesString);

                timezonesEntity.setUnindexedProperty("value_", timezonesText);
                datastore.put(timezonesEntity);
            }
        } else {
            timezonesEntity = new Entity("SystemParams");
            List<TimeZonePair> timezonePairs = new ArrayList<TimeZonePair>();
            TimeZonePair timezonePair = new TimeZonePair();
            timezonePair.setTimezoneID(timezone);
            timezonePair.setOffset(offset);
            timezonePair.setLat(lat);
            timezonePair.setLng(lng);
            timezonePairs.add(timezonePair);
            timezonesEntity.setProperty("parameter_","timezones");

            String timezonesString = gson.toJson(timezonePairs);
            Text timezonesText = new Text(timezonesString);

            timezonesEntity.setUnindexedProperty("value_", timezonesText);
            datastore.put(timezonesEntity);
        }

        txn.commit();
    }
}
