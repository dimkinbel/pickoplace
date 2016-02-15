package com.dimab.pickoplace.json;

import com.google.gson.Gson;

import java.lang.reflect.Type;

public class GsonUtils {

    public static Gson GSON = new Gson();

    public static <T> T fromJson(String json, Type typeOfT) {
        return GSON.fromJson(json, typeOfT);
    }
}
