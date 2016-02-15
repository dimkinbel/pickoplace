package com.dimab.pickoplace.utils;

import com.dimab.pickoplace.json.GsonUtils;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public final class ServletUtils {
    private ServletUtils() {
    }

    /**
     * write correct Contet-Type header & serialize response as json
     * @throws IOException
     */
    public static void writeJsonResponse(HttpServletResponse httpServletResponse, Object object) throws IOException {
        httpServletResponse.setContentType("application/json");
        httpServletResponse.setCharacterEncoding("UTF-8");
        httpServletResponse.getWriter().write(GsonUtils.toJson(object));
    }
}
