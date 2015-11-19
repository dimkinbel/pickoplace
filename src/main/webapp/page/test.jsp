<%@page contentType="text/html" pageEncoding="UTF-8" %>
<%@taglib prefix="layout" tagdir="/WEB-INF/tags/layout" %>
<%@taglib prefix="common" tagdir="/WEB-INF/tags/common" %>

<layout:baseHtml>
    <jsp:attribute name="headerBlock">
        <div>some-header-div</div>
    </jsp:attribute>

    <jsp:attribute name="bodyBlock">
        ${requestScope.i18n['someKey']}

        <common:languageSelector/>
    </jsp:attribute>
</layout:baseHtml>