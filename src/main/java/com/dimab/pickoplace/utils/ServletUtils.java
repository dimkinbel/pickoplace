package com.dimab.pickoplace.utils;

import com.dimab.pickoplace.json.GsonUtils;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public final class ServletUtils {
    private ServletUtils() {
    }

    public static void writeJsonResponse(HttpServletResponse httpServletResponse, Object object) throws IOException {
        httpServletResponse.setContentType("application/json");
        httpServletResponse.setCharacterEncoding("UTF-8");
        httpServletResponse.getWriter().write(GsonUtils.toJson(object));
    }
}
