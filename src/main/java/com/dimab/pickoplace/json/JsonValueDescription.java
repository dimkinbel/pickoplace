package com.dimab.pickoplace.json;

import com.dimab.pickoplace.utils.JsonUtils;
import com.google.common.base.MoreObjects;
import com.google.common.base.Strings;

import javax.annotation.Nullable;

public final class JsonValueDescription<T> {
    private final String name;

    private final Class<T> aClass;

    public JsonValueDescription(String name, Class<T> aClass) {
        this.name = name;
        this.aClass = aClass;
    }

    @Nullable
    public final T deserialize(String valueAsString) {
        if (Strings.isNullOrEmpty(valueAsString)) {
            return null;
        }

        return JsonUtils.deserialize(valueAsString, aClass);
    }

    public final String serialize(T object) {
        return JsonUtils.serialize(object);
    }

    @Override
    public String toString() {
        return MoreObjects.toStringHelper(getClass())
                .add("name", name)
                .add("aClass", aClass)
                .toString();
    }

    public final String getName() {
        return name;
    }
}
