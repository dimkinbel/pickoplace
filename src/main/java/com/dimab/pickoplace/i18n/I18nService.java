package com.dimab.pickoplace.i18n;

import com.dimab.pickoplace.utils.JsonUtils;
import com.google.common.base.Charsets;
import com.google.common.base.Preconditions;
import com.google.common.io.CharStreams;
import com.google.gson.reflect.TypeToken;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.reflect.Type;
import java.util.Map;


public class I18nService {

    private final static Type LOCALIZATION_TYPE = new TypeToken<Map<String, Message>>() {
    }.getType();

    private final Map<String, Message> messages;

    public final static I18nService INSTANCE = new I18nService(); // todo(egor): use IoC

    public I18nService() {
        InputStream localizationResource = I18nService.class.getResourceAsStream("/com/pickoplace/localization.json");

        String localizationAsString;
        try {
            localizationAsString = CharStreams.toString(new InputStreamReader(localizationResource, Charsets.UTF_8));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        messages = JsonUtils.deserializeFromJson(localizationAsString, LOCALIZATION_TYPE);
    }

    public String getMessage(Language language, String key) {
        Message message = Preconditions.checkNotNull(messages.get(key), "can't find i18n message with key `%s`", key);

        switch (language) {
            case ENGLISH:
                return message.english;

            case HEBREW:
                return message.hebrew;

            default:
                throw new RuntimeException("unsupported language " + language);
        }
    }

    public String getMessage(String key) {
        return getMessage(I18nContext.getCurrentLanguage(), key);
    }

    private final static class Message {
        private String english;
        private String hebrew;
    }
}
