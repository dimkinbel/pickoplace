<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<script type="text/javascript">
function bodyOnloadHandler() {
	document.getElementById("_editform").submit();
};
</script>
<title>Edit proceed</title>

</head>
<body onload="bodyOnloadHandler()">
<%
 String PlaceID = (String) request.getAttribute("pid");
%>
<form id="_editform" style="diaplay:none" action="editplacefromAccount" method="post">
		<input name="placeIDvalue" value="<%=PlaceID%>">
</form>
</body>
</html>