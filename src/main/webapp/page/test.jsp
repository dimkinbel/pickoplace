<%@page contentType="text/html" pageEncoding="UTF-8" %>
<%@taglib prefix="layout" tagdir="/WEB-INF/tags/layout" %>

<layout:html pageTitle="some page title">
    <jsp:attribute name="headerBlock">
    </jsp:attribute>

    <jsp:attribute name="bodyBlock">
        ${requestScope.i18n['someKey']}
    </jsp:attribute>
</layout:html>