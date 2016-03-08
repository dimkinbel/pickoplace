<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<!DOCTYPE html >
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Edit proceed</title>

    <script type="text/javascript">
        function bodyOnloadHandler() {
            document.getElementById("_editform").submit();
        }
    </script>
</head>
<body onload="bodyOnloadHandler()">
<%
    // todo(egor): push to controller
    String PlaceID = (String) request.getAttribute("pid");
%>
<form id="_editform" style="diaplay:none" action="editplacefromAccount" method="post">
    <input name="placeIDvalue" value="<%=PlaceID%>">
</form>
</body>
</html>