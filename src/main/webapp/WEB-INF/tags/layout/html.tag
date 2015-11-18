<%@tag description="Simple page template" pageEncoding="UTF-8"%>
<%@attribute name="pageTitle" required="true" type="java.lang.String" %>
<%@attribute name="headerBlock" fragment="true" %>
<%@attribute name="bodyBlock" fragment="true" %>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

        <title>${pageTitle}</title>
        <script type="text/javascript" src="/rest/i18n.js"></script>

        <jsp:invoke fragment="headerBlock"/>
    </head>

    <body>
        <jsp:invoke fragment="bodyBlock"/>
    </body>
</html>