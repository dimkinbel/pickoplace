package com.dimab.pickoplace.jersey;

import com.dimab.pickoplace.utils.JsonUtils;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.ws.rs.ext.ContextResolver;
import javax.ws.rs.ext.Provider;

@Provider
public class ObjectMapperProvider implements ContextResolver<ObjectMapper> {

    @Override
    public ObjectMapper getContext(Class<?> type) {
        return JsonUtils.OBJECT_MAPPER;
    }
}
