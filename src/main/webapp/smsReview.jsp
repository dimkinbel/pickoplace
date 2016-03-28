<%@ page import="com.dimab.pp.dto.BookingRequestWrap" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%@ page import="java.util.Calendar" %>
<%@ page import="com.dimab.pp.dto.BookingRequestPlaceView" %>
<%@ page import="com.dimab.pp.dto.ShapeDimentions" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script type="text/javascript" src="js/jquery-1.11.1.min.js"></script>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Booking review</title>

    <link rel="stylesheet" href="css/bootstrap/bootstrap.min.css" type="text/css">
    <link  rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <script type="text/javascript" src="js/bootstrap/bootstrap.min.js"></script>
    <link rel="stylesheet" href="css/booking_review.css">
    <script type="text/javascript">

        $(document).ready(function() {

        });
    </script >
</head>
<%
    BookingRequestWrap booking =  (BookingRequestWrap) request.getAttribute("bookingRequest");
    SimpleDateFormat dateFormat = new SimpleDateFormat("HH:mm");
    String fromTime = dateFormat.format(booking.getPlaceLocalTime());
    Calendar calendar = Calendar.getInstance();
    calendar.setTime(booking.getPlaceLocalTime());
    Calendar endCalendar = calendar;
    endCalendar.add(Calendar.SECOND, booking.getPeriod());
    String endTime = dateFormat.format(endCalendar.getTime());

    dateFormat = new SimpleDateFormat("DD MMMM");
    String dateString = dateFormat.format(booking.getPlaceLocalTime());

    String imgUrl = "";
    String fullName = "";
    if (booking.getUser().isGoogle()) {
        imgUrl = booking.getUser().getGouser().getPicture();
        fullName = booking.getUser().getGouser().getName() + " " + booking.getUser().getGouser().getFamily_name();
    } else if (booking.getUser().isFacebook()) {
        imgUrl = "http://graph.facebook.com/" + booking.getUser().getFbuser().getId() + "/picture";
        fullName = booking.getUser().getFbuser().getFirst_name() + " " + booking.getUser().getFbuser().getLast_name();
    }

%>
<body   style="overflow-x:hidden;margin:0px;font-size: 16px;">
<div id="rev_wrap">
    <div id="header_td_div" class="main_page_header relative_header">
        <div id="header" >
            <div id="logo_"><img src="img/pplogomarker.png" id="pplogoo"/><div id="logotext">ickoplace</div></div>

        </div>
    </div>
    <div class="container-fluid" >
        <div class="row ">
            <div class="col-xs-12" id="ascasd">
                התקבלה הזמנה חדשה ב <br>
                <span id="place_name"><%=booking.getPlaceName()%> , <%=booking.getBranchName()%></span>
            </div>
        </div>
        <div class="details_top_text">פרטי הזמנה</div>
        <div class="row " id="order_details">
            <div class="col-xs-12">
                <div class="row contact_header_notif">
                    <div class="col-sm-1"><img id="fg_profile_img" src="http://graph.facebook.com/768185026593187/picture"></div>
                    <div class="col-sm-11"><span class="notification_name_"><%=fullName%></span> <span
                            class="label label-success notif_phone_label"><%=booking.getPhone()%></span></div>
                </div>
                <div class="row">
                    <div class="col-sm-12">
                        <ul class="list-group notif_book_info">
                            <li class="list-group-item nbi_list"><i class=" nbi_mat nbi_mat_text">id</i><%=booking.getNum()%></li>
                            <li class="list-group-item nbi_list"><i class="material-icons nbi_mat">event</i><%=dateString%></li>
                            <li class="list-group-item nbi_list"><i class="material-icons nbi_mat">schedule</i><%=fromTime%>&nbsp;-&nbsp;<%=endTime%></li>
                            <li class="list-group-item nbi_list"><i class="material-icons nbi_mat">group</i><%=booking.getPersons()%>&nbsp;persons</li>
                            <li class="list-group-item nbi_list"><i class="material-icons nbi_mat">pin_drop</i><%=booking.getBookingList().size()%>&nbsp;places</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <% if(booking.getTextRequest()!= null && !booking.getTextRequest().isEmpty()) {%>
            <div class="row details_top_text">בקשות מיוחדות</div>
            <div id="special_request">
                <%=booking.getTextRequest()%>
            </div>
        <%}%>
        <div class="row details_top_text">פרטי מקום</div>
        <% for(BookingRequestPlaceView Floorview: booking.getBookingView()) {
             Integer personsAtFloor  = 0;
             for(ShapeDimentions sd:Floorview.getShapes()) {
                personsAtFloor += sd.getPersons();
             }
        %>
            <div class=" row panel panel-default floor_panel">
                <div class="panel-heading"><%=Floorview.getFloorName()%>&nbsp;<span class="floor_order_data"><%=Floorview.getShapes().size()%>&nbsp;places,<%=personsAtFloor%>&nbsp;persons</span></div>
                <div class="panel-body">
                    <div class="overview_wrap" id="overview-<%=Floorview.getFloorID()%>">
                        <img class="server_overview" src="<%=Floorview.getOverviewURL()%>">
                        <%for(ShapeDimentions sd:Floorview.getShapes()) {%>
                           <div class="place_pointer material-icons" style="left:<%=sd.getXperc()%>;top:<%=sd.getYperc()%>">room</div>
                        <%}%>
                    </div>
                </div>
            </div>
        <%}%>
        <div class="row details_top_text">יש לאשר או לבטל</div>
        <div class="row" id="review_buttons">
            <div class="col-xs-6">
               <a  style="text-decoration: none;" href='https://www.pickoplace.com/waiterLinkActions/declineBooking?pid=<%=booking.getPid()%>&bid=<%=booking.getBookID()%>&code=<%=booking.getReviewCode()%>'>
                <div class="buttons" id="decline_btn">Decline</div>
               </a>
            </div>
            <div class="col-xs-6">
                <a  style="text-decoration: none;" href='https://www.pickoplace.com/waiterLinkActions/acceptBooking?pid=<%=booking.getPid()%>&bid=<%=booking.getBookID()%>&code=<%=booking.getReviewCode()%>'>
                    <div class="buttons" id="accept_btn">Accept</div>
                </a>
            </div>
        </div>
    </div>
</div>
</body>
</html>
