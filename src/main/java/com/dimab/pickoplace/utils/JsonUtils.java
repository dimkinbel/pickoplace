package com.dimab.pickoplace.utils;

import com.google.gson.Gson;

import java.lang.reflect.Type;

public final class JsonUtils {

    // todo(egor): migrate to jackson
    private final static Gson GSON = new Gson();

    private JsonUtils() {
    }

    public static String serialize(Object o) {
        return GSON.toJson(o);
    }

    public static <T> T deserialize(String objectAsJson, Class<T> clazz) {
        return GSON.fromJson(objectAsJson, clazz);
    }

    public static <T> T deserialize(String objectAsJson, Type type) {
        return GSON.fromJson(objectAsJson, type);
    }
}
