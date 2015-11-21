package com.dimab.pickoplace.i18n;

import com.dimab.pickoplace.utils.JsonUtils;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;


//todo(egor): use Jersey!
/**
 * serve client localization
 */
public class I18nServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.addHeader("Content-Type", "application/x-javascript");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter writer = resp.getWriter();

        Language language = I18nContext.getCurrentLanguage();

        Map<String,String> messages = I18nService.INSTANCE.getMessages(language);
        String messagesAsString = JsonUtils.serialize(messages);

        writer.write("window.pickoplace = window.pickoplace || {};\n");
        writer.write("window.pickoplace.i18n = " + messagesAsString + ";\n");
        writer.write("function i18n(key) { return window.pickoplace.i18n[key]; }");
        writer.close();
    }
}
