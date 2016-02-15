package com.dimab.pp.channel;

import com.dimab.pickoplace.json.GsonUtils;
import com.dimab.pp.dto.BookingRequestWrap;
import com.google.appengine.api.channel.ChannelFailureException;
import com.google.appengine.api.channel.ChannelMessage;
import com.google.appengine.api.channel.ChannelService;
import com.google.appengine.api.channel.ChannelServiceFactory;
import com.google.appengine.api.datastore.*;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ChannelMessageFactory {
    private static ChannelService channelService = ChannelServiceFactory.getChannelService();

    public boolean SendBookingUpdate(String pid, BookingRequestWrap message) {
        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        Filter UserExists = new FilterPredicate("pid", FilterOperator.EQUAL, pid);
        Query q = new Query("AdminChannels").setFilter(UserExists);
        PreparedQuery pq = datastore.prepare(q);
        Entity result = pq.asSingleEntity();

        if (result == null) {
            return false;
        } else {
            String clientsJSON = (String) result.getProperty("clients");
            Type collectionType = new TypeToken<List<String>>() {
            }.getType();
            List<String> connected = GsonUtils.fromJson(clientsJSON, collectionType);

            for (String cliendID : connected) {
                Map<String, Object> map = new HashMap<String, Object>();
                map.put("status", "valid");
                map.put("subject", "booking");
                map.put("message", message);

                try {
                    sendMessageToChannel(cliendID, new Gson().toJson(map));
                } catch (ChannelFailureException channelFailure) {
                    System.out.println("Failed in sending message to channel:" + channelFailure);

                } catch (Exception e) {
                    System.out.println("Unknow error while sending message to the channel:" + e);
                }
            }
        }

        return false;
    }

    public void sendMessageToChannel(String userName, String message) throws ChannelFailureException {
        System.out.println("Sending message to channel:" + userName + ". Message:" + message);
        channelService.sendMessage(new ChannelMessage(userName, message));
    }
}
