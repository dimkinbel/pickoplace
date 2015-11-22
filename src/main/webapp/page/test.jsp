<%@page contentType="text/html" pageEncoding="UTF-8" %>
<%@taglib prefix="layout" tagdir="/WEB-INF/tags/layout" %>
<%@taglib prefix="common" tagdir="/WEB-INF/tags/common" %>

<layout:baseHtml>
    <jsp:attribute name="headerBlock">
        <div>some-header-div</div>
    </jsp:attribute>

    <jsp:attribute name="bodyBlock">
        ${i18n['someKey']}

        ${model.userInfo.userName}

        <common:languageSelector/>
    </jsp:attribute>
</layout:baseHtml>