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
import java.util.HashMap;
import java.util.Map;


public class I18nService {

    private final static Type LOCALIZATION_TYPE = new TypeToken<Map<String, Message>>() {
    }.getType();

    private final Map<String, Message> messages;
    private final Map<Language, I18nMap> messagesByLanguage;

    public final static I18nService INSTANCE = new I18nService(); // todo(egor): use IoC

    public I18nService() {
        InputStream localizationResource = I18nService.class.getResourceAsStream("/com/pickoplace/localization.json");

        String localizationAsString;
        try {
            localizationAsString = CharStreams.toString(new InputStreamReader(localizationResource, Charsets.UTF_8));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        messages = JsonUtils.deserialize(localizationAsString, LOCALIZATION_TYPE);

        messagesByLanguage = new HashMap<>();
        messagesByLanguage.put(Language.ENGLISH, new I18nMap());
        messagesByLanguage.put(Language.HEBREW, new I18nMap());
        messagesByLanguage.put(Language.RUSSIAN, new I18nMap());
        for (Map.Entry<String, Message> mapEntry : messages.entrySet()) {
            messagesByLanguage.get(Language.ENGLISH).put(mapEntry.getKey(), mapEntry.getValue().english);
            messagesByLanguage.get(Language.RUSSIAN).put(mapEntry.getKey(), mapEntry.getValue().russian);
            messagesByLanguage.get(Language.HEBREW).put(mapEntry.getKey(), mapEntry.getValue().hebrew);
        }
    }

    public String getMessage(Language language, String key) {
        Message message = Preconditions.checkNotNull(messages.get(key), "can't find i18n message with key `%s`", key);

        switch (language) {
            case ENGLISH:
                return message.english;

            case RUSSIAN:
                return message.russian;

            case HEBREW:
                return message.hebrew;

            default:
                throw new RuntimeException("unsupported language " + language);
        }
    }

    public String getMessage(String key) {
        return getMessage(I18nContext.getCurrentLanguage(), key);
    }

    public Map<String, String> getMessages(Language language) {
        return messagesByLanguage.get(language);
    }

    private final static class Message {
        private String english;
        private String hebrew;
        private String russian;
    }

    private final static class I18nMap extends HashMap<String, String> {
        public String get(Object key) {
            if(!this.containsKey(key)) {
                throw new RuntimeException("can't find localozation message by key `" + key + "`");
            }

            return super.get(key);
        }
    }
}
