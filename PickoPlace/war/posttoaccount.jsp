<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"
    import="com.google.appengine.api.users.*"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<script type="text/javascript" src="js/jquery-1.11.1.min.js" ></script>
    <script type="text/javascript" src="js/jquery-migrate-1.2.1.js" ></script>
<script type="text/javascript">

function goToAccountMenu() {
	document.getElementById("master_account").submit();
}
$(document).ready(function() {
	goToAccountMenu();
});
</script>
<title>PickoPlace</title>
</head>
<body style="margin: 0px;">
	<table id="body_table" cellspacing="0" cellpadding="0"
		style="width: 100%; height: 100%; border-collapse: collapse">
		<tr id="header_tr">
			<td id="header_td">
				<div id="header">
					<div id="logo_"><img src="img/pplogo.png" id="pplogoo"/></div>
					<div class="login_in_header_wrap">
					   <%
					     request.getSession().setAttribute("urlreturn", request.getRequestURL().toString());					  
					     UserService userService = UserServiceFactory.getUserService();
					     if (!userService.isUserLoggedIn()) {
					        %>

					          <span>Login by <a class="loginLink" href="<%=userService.createLoginURL("/userLogin")%>">Google Account</a></span>
 
					      <% 
					       } else { 
						   request.getSession().setAttribute("userEmail",userService.getCurrentUser().getEmail());
					       %>	
					       <table style="border-collapse: collapse;" cellspacing="0" cellpadding="0"  >		
					         <tr><td>	      
					       <div class="oneline">Welcome, <span class="userNikname"><%= userService.getCurrentUser().getNickname() %></span>.</div> 
					         </td><td>
					        <div id="loginAccountOptions" class="oneline"><span class="acctoplinks">Account</span>
					          <div id="accountHiddenOptions" style="display:none;">
					            <table id="topOptionsTable"  cellspacing="0" cellpadding="0"  style="width:100%;">
					             <tr><td>
					                <div id="gotoaccountmenu" class="topAccOptList" onclick="goToAccountMenu()">Go to Account</div>
					                <form id="master_account" action="gotoaccountmenu" method="post"></form>
					              </td></tr>
					              <tr><td>
					                <div id="dotoadminzone" class="topAccOptList">AdminZone</div>
					              </td></tr>
					              <tr><td>
					                <div id="logoutmenu" class="topAccOptList">
					                  <a  class="loginLink loginlogout" href="<%=userService.createLogoutURL("/userLogin")%>">Logout</a>
					                </div>
					              </td></tr>
					            </table>
					          </div>
					        </div>
					        </td></tr>	
					        </table>					 
					   <%
					     }
					   %>				
				</div>
				</div>
			</td>
		</tr>

	</table>

</body>
</html>