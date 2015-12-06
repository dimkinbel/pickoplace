package com.dimab.pickoplace.websession;

import com.dimab.pickoplace.json.JsonValueDescription;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

/**
 * you can store session data everywhere
 */
public interface WebSessionStorage {

    @Nullable
    <T> T getData(@Nonnull JsonValueDescription<T> jsonValueDescription);

    <T> void setData(@Nonnull JsonValueDescription<T> jsonValueDescription, @Nonnull T value);

    void clearData(@Nonnull JsonValueDescription jsonValueDescription);
}
