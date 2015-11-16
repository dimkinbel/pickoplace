<%@page contentType="text/html" pageEncoding="UTF-8" %>
<%@taglib prefix="layout" tagdir="/WEB-INF/tags/layout" %>

<layout:html pageTitle="some page title">
    <jsp:attribute name="headerBlock">
        <link rel="stylesheet" href="css/login.css" type="text/css" media="screen" />
        <link rel="stylesheet" href="css/style.css" type="text/css" media="screen" />
        <link rel="stylesheet" href="css/style2.css" type="text/css" media="screen" />
    </jsp:attribute>

    <jsp:attribute name="bodyBlock">
        ${requestScope.i18n['someKey']}
    </jsp:attribute>
</layout:html>