package com.dimab.pickoplace.utils;

import com.google.gson.Gson;
import com.google.gson.JsonElement;

import java.lang.reflect.Type;

public final class GsonUtils {

    public static Gson GSON = new Gson();

    public static <T> T fromJson(String json, Type typeOfT) {
        return GSON.fromJson(json, typeOfT);
    }

    public static <T> T fromJson(JsonElement json, Type typeOfT) {
        return GSON.fromJson(json, typeOfT);
    }

    public static String toJson(Object src) {
        return GSON.toJson(src);
    }
}
