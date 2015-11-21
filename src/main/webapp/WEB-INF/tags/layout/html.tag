<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@tag description="Simple page template" pageEncoding="UTF-8"%>
<%@attribute name="pageTitle" required="false" type="java.lang.String" %>
<%@attribute name="headerBlock" fragment="true" %>
<%@attribute name="bodyBlock" fragment="true" %>
<c:if test="${empty pageTitle}" >
    <c:set var="pageTitle" value="${requestScope.i18n['defaultPageTitle']}" />
</c:if>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

        <title>${pageTitle}</title>
        <script type="text/javascript" src="/rest/i18n.js"></script>

        <jsp:invoke fragment="headerBlock"/>
    </head>

    <body style="margin: 0px;" class="main_body">
        <jsp:invoke fragment="bodyBlock"/>
    </body>
</html>