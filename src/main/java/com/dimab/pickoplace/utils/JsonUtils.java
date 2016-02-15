package com.dimab.pickoplace.utils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;

public final class JsonUtils {

    public static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    private JsonUtils() {
    }

    public static String serialize(Object o) {
        try {
            return OBJECT_MAPPER.writeValueAsString(o);
        } catch (IOException e) {
            throw new RuntimeException("can`t serialize object `" + o + "`", e);
        }
    }

    public static <T> T deserialize(String objectAsJson, Class<T> clazz) {
        try {
            return (T) OBJECT_MAPPER.readValue(objectAsJson, clazz);
        } catch (IOException e) {
            throw new RuntimeException("can`t deserialize object from json`" + objectAsJson + "`", e);
        }
    }

    public static <T> T deserialize(String objectAsJson, TypeReference typeReference) {
        try {
            return OBJECT_MAPPER.readValue(objectAsJson, typeReference);
        } catch (IOException e) {
            throw new RuntimeException("can`t deserialize object from json`" + objectAsJson + "`", e);
        }
    }
}
