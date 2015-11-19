<%@tag description="Simple page template" pageEncoding="UTF-8"%>
<%@taglib prefix="layout" tagdir="/WEB-INF/tags/layout" %>
<%@taglib prefix="common" tagdir="/WEB-INF/tags/common" %>
<%@attribute name="pageTitle" required="false" type="java.lang.String" %>
<%@attribute name="headerBlock" fragment="true" %>
<%@attribute name="bodyBlock" fragment="true" %>

<layout:html pageTitle="${pageTitle}">
    <jsp:attribute name="headerBlock">
        <common:baseStyles/>
        <common:baseScripts/>
        <common:baseSyncScripts/>

        <jsp:invoke fragment="headerBlock"/>
    </jsp:attribute>

    <jsp:attribute name="bodyBlock">
        <jsp:invoke fragment="bodyBlock"/>
    </jsp:attribute>
</layout:html>