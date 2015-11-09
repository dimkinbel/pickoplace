package com.dimab.pickoplace.utils;

import com.google.gson.Gson;

import java.lang.reflect.Type;

public final class JsonUtils {

    private final static Gson GSON = new Gson();

    private JsonUtils() {
    }

    public static <T> T deserializeFromJson(String objectAsJson, Class<T> clazz) {
        return GSON.fromJson(objectAsJson, clazz);
    }

    public static <T> T deserializeFromJson(String objectAsJson, Type type) {
        return GSON.fromJson(objectAsJson, type);
    }
}
