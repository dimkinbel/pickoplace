package com.dimab.pickoplace.utils;

import java.util.regex.Pattern;

public enum WebResourceType {

    JS(".js"),

    CSS(".css"),

    LESS(".less"),

    JPG(".jpg"),

    PNG(".jpg");

    public final static String JS_EXTENSION = ".js";
    public final static String JS_MIME_TYPE = "text/javascript";

    public final static String CSS_EXTENSION = ".css";
    public final static String CSS_MIME_TYPE = "text/css";

    public final static String LESS_EXTENSION = ".less";

    public final static String JPG_EXTENSION_WITHOUT_DOT = "jpg";
    public final static String JPG_EXTENSION = "." + JPG_EXTENSION_WITHOUT_DOT;
    public final static String JPG_MIME_TYPE = "image/jpeg";

    public final static String PNG_EXTENSION_WITHOUT_DOT = "png";
    public final static String PNG_EXTENSION = "." + PNG_EXTENSION_WITHOUT_DOT;
    public final static String PNG_MIME_TYPE = "image/png";

    public final static String GIF_EXTENSION_WITHOUT_DOT = "gif";
    public final static String GIF_EXTENSION = "." + GIF_EXTENSION_WITHOUT_DOT;
    public final static String GIF_MIME_TYPE = "image/gif";

    public final static String SVG_EXTENSION_WITHOUT_DOT = "svg";
    public final static String SVG_EXTENSION = "." + SVG_EXTENSION_WITHOUT_DOT;
    public final static String SVG_MIME_TYPE = "image/svg+xml";

    public final static Pattern JS_SRC_PATTERN = Pattern.compile("src=\"(.*?)\"", Pattern.DOTALL);
    public final static Pattern CSS_SRC_PATTERN = Pattern.compile("href=\"(.*?)\"", Pattern.DOTALL);

    private final String extension;

    WebResourceType(String extension) {
        this.extension = extension;
    }

    public String getHtmlCode(String path) {
        switch (this) {
            case JS:
                return "<script type=\"text/javascript\" charset=\"utf-8\" src=\"{URL}\"></script>"
                        .replace("{URL}", path);

            case CSS:
                return "<link rel=\"stylesheet\" type=\"text/css\" href=\"{URL}\" media=\"all\" />"
                        .replace("{URL}", path);

            case LESS:
                return "<link rel=\"stylesheet/less\" type=\"text/css\" href=\"{URL}\"/>"
                        .replace("{URL}", path);

            default:
                throw new RuntimeException("unknown ProcessGroup.Type = `" + this + "`");
        }
    }

    public static HtmlBuilder htmlBuilder(WebResourceType webResourceType, String path) {

        return new HtmlBuilder(webResourceType, path);
    }

    public static HtmlBuilder htmlBuilder(String path) {
        return new HtmlBuilder(path);
    }

    public static WebResourceType getWebResourceType(String path) {
        String extension = getFileExtensionWithDot(path);

        switch (extension) {
            case JS_EXTENSION:
                return JS;

            case CSS_EXTENSION:
                return CSS;

            case LESS_EXTENSION:
                return LESS;

            default:
                throw new RuntimeException("unknown WebResourceType for path = `" + path + "`");
        }
    }

    public String getExtension() {
        return extension;
    }

    private static String getFileExtension(String path) {
        int indexOfExtensionDot = path.lastIndexOf(".");

        if (indexOfExtensionDot < 0) {
            return "";
        }

        if (indexOfExtensionDot + 1 == path.length()) {
            return "";
        }

        return path.substring(indexOfExtensionDot + 1, path.length());
    }

    private static String getFileExtensionWithDot(String path) {
        String extension = getFileExtension(path);

        if (!extension.isEmpty()) {
            return "." + getFileExtension(path);
        } else {
            return extension;
        }
    }

    public static final class HtmlBuilder {

        private final StringBuilder stringBuilder;

        private HtmlBuilder(String path) {

            stringBuilder = new StringBuilder();


            addResource(path);
        }

        private HtmlBuilder(WebResourceType webResourceType, String path) {

            stringBuilder = new StringBuilder();

            addResource(webResourceType, path);
        }

        public HtmlBuilder addResource(WebResourceType webResourceType, String path) {

            stringBuilder.append(webResourceType.getHtmlCode(path));

            return this;
        }

        public HtmlBuilder addResource(String path) {

            return addResource(WebResourceType.getWebResourceType(path), path);
        }

        public String toHtml() {
            return stringBuilder.toString();
        }
    }
}
