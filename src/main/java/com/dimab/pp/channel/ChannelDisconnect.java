package com.dimab.pp.channel;

import com.dimab.pickoplace.json.GsonUtils;
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
import java.util.List;

public class ChannelDisconnect extends HttpServlet {
    private static final long serialVersionUID = 1L;

    public ChannelDisconnect() {
        super();
        // TODO Auto-generated constructor stub
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        ChannelService channelService = ChannelServiceFactory.getChannelService();
        ChannelPresence presence = channelService.parsePresence(request);
        String user = presence.clientId();
        System.out.println("CHANNEL_DISCONNECT:" + user);

        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        TransactionOptions options = TransactionOptions.Builder.withXG(true);
        Transaction txn = datastore.beginTransaction(options);

        String[] ops = presence.clientId().split("_PPID_");
        String pid = ops[1];
        Filter UserExists = new FilterPredicate("pid", FilterOperator.EQUAL, pid);
        Query q = new Query("AdminChannels").setFilter(UserExists);
        PreparedQuery pq = datastore.prepare(q);
        Entity result = pq.asSingleEntity();
        if (result == null) {

        } else {
            String clientsJSON = (String) result.getProperty("clients");
            Type collectionType = new TypeToken<List<String>>() {
            }.getType();
            List<String> connected = GsonUtils.GSON.fromJson(clientsJSON, collectionType);
            if (connected.contains(presence.clientId())) {
                connected.remove(presence.clientId());
                if (connected.size() == 0) {
                    datastore.delete(result.getKey());
                } else {
                    result.setProperty("clients", GsonUtils.GSON.toJson(connected));
                    datastore.put(result);
                }
            }

        }
        txn.commit();
    }
}
