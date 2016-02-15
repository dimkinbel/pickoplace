package com.dimab.pickoplace.websession;

import com.dimab.pickoplace.json.JsonValueDescription;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import javax.inject.Inject;
import javax.inject.Provider;
import javax.servlet.http.HttpSession;

/**
 * store data in HttpSession attributes
 */
public class SimpleWebSessionStorage implements WebSessionStorage {

    private final Provider<HttpSession> httpSessionProvider;

    @Inject
    SimpleWebSessionStorage(Provider<HttpSession> httpSessionProvider) {
        this.httpSessionProvider = httpSessionProvider;
    }

    @Nullable
    @Override
    public <T> T getData(@Nonnull JsonValueDescription<T> jsonValueDescription) {
        String attribute = (String) httpSessionProvider.get().getAttribute(jsonValueDescription.getName());

        if (attribute == null) {
            return null;
        }

        return jsonValueDescription.deserialize(attribute);
    }

    @Override
    public <T> void setData(@Nonnull JsonValueDescription<T> jsonValueDescription, @Nonnull T value) {
        httpSessionProvider.get().setAttribute(jsonValueDescription.getName(), jsonValueDescription.serialize(value));
    }

    @Override
    public void clearData(@Nonnull JsonValueDescription jsonValueDescription) {
        // no-op
    }
}
