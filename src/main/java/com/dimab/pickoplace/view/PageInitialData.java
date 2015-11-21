package com.dimab.pickoplace.view;

import java.util.HashMap;
import java.util.Map;

/**
 * see `/src/main/webapp/js/modules/src/services/pageDataService.js`
 */
public class PageInitialData {

    private final Map<String, Object> data = new HashMap<>();

    public void addData(String key, Object value) {
        if (data.containsKey(key)) {
            throw new RuntimeException("data with key `" + key + "` already exists");
        }

        data.put(key, value);
    }
}
