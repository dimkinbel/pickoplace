<%@page contentType="text/html" pageEncoding="UTF-8" %>
<%@taglib prefix="layout" tagdir="/WEB-INF/tags/layout" %>
<%@taglib prefix="common" tagdir="/WEB-INF/tags/common" %>
<%@taglib prefix="pages" tagdir="/WEB-INF/tags/pages" %>

<layout:baseHtml>
    <jsp:attribute name="headerBlock">
        <script type="text/javascript">
            var pagetype = 'welcome';
        </script>

        <pages:welcomeHeader/>
    </jsp:attribute>

    <jsp:attribute name="bodyBlock">
        <pages:welcomeBody/>
    </jsp:attribute>
</layout:baseHtml>
