package com.dimab.pp.channel;

import com.dimab.pickoplace.utils.GsonUtils;
import com.google.appengine.api.channel.ChannelPresence;
import com.google.appengine.api.channel.ChannelService;
import com.google.appengine.api.channel.ChannelServiceFactory;
import com.google.appengine.api.datastore.*;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.gson.reflect.TypeToken;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;


public class ChannelConnect extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        TransactionOptions options = TransactionOptions.Builder.withXG(true);
        Transaction txn = datastore.beginTransaction(options);
        ChannelService channelService = ChannelServiceFactory.getChannelService();
        ChannelPresence presence = channelService.parsePresence(request);
        System.out.println("CHANNEL_CONNECT:" + presence.clientId());

        String[] ops = presence.clientId().split("_PPID_");
        String pid = ops[1];
        Filter UserExists = new FilterPredicate("pid", FilterOperator.EQUAL, pid);
        Query q = new Query("AdminChannels").setFilter(UserExists);
        PreparedQuery pq = datastore.prepare(q);
        Entity result = pq.asSingleEntity();
        if (result == null) {
            Entity channelEntity = new Entity("AdminChannels");
            List<String> connected = new ArrayList<String>();
            connected.add(presence.clientId());

            channelEntity.setProperty("pid", pid);
            channelEntity.setUnindexedProperty("clients", GsonUtils.toJson(connected));
            datastore.put(channelEntity);
        } else {
            String clientsJSON = (String) result.getProperty("clients");
            Type collectionType = new TypeToken<List<String>>() {
            }.getType();
            List<String> connected = GsonUtils.fromJson(clientsJSON, collectionType);
            if (!connected.contains(presence.clientId())) {
                connected.add(presence.clientId());
                result.setUnindexedProperty("clients", GsonUtils.toJson(connected));
            }
            datastore.put(result);
        }
        txn.commit();
    }
}
