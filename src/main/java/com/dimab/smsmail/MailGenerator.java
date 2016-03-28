package com.dimab.smsmail;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import com.dimab.pp.dto.BookingRequest;
import com.dimab.pp.dto.BookingRequestWrap;
import com.dimab.pp.dto.PlaceInfo;
import com.dimab.pp.login.GenericUser;

public class MailGenerator {

    public String GetCancellationEmail(BookingRequestWrap bookingRequestsWrap, PlaceInfo placeInfo) {
        String message = "";
        message = message.concat("<div  border='0' cellpadding='0' cellspacing='0' height='100%' width='100%' style='background-color: #F7F7F7;width: 100%;padding-top: 50px;padding-bottom: 50px; font-family: \'Helvetica neue\',Helvetica,arial,sans-serif;'>");
        message = message.concat(" Unfortunately your booking has been cancelled by Administrator<br>");
        message = message.concat(" At:" + placeInfo.getUserPlace().getPlace() + "," + placeInfo.getUserPlace().getBranch());
        message = message.concat(" Address:" + placeInfo.getUserPlace().getAddress());
        message = message.concat(" Time:" + bookingRequestsWrap.getPlaceLocalTime());
        message = message.concat("</div>");
        return message;
    }

    public String GetConfirmationMail(Boolean automatic, BookingRequestWrap bookingRequestsWrap, PlaceInfo placeInfo) {
        String message = "";
        String topwhiteIcon = "https://storage.googleapis.com/pp_icons/splittertopwhite.jpg";
        String topgreyIcon = "https://storage.googleapis.com/pp_icons/splittertopgrey.jpg";
        String phoneIcon = "https://storage.googleapis.com/pp_icons/phonegrey.png";
        String mailIcon = "https://storage.googleapis.com/pp_icons/mailicon.png";
        String markerIcon = "https://storage.googleapis.com/pp_icons/markergrey.png";
        String homeurlIcon = "https://storage.googleapis.com/pp_icons/homeurlicon.png";
        String clockIcon = "https://storage.googleapis.com/pp_icons/clockgrey.png";

        SimpleDateFormat dateFormat = new SimpleDateFormat("dd MMM , HH:mm");

        String fromTime = dateFormat.format(bookingRequestsWrap.getPlaceLocalTime());

        Calendar calendar = Calendar.getInstance();
        calendar.setTime(bookingRequestsWrap.getPlaceLocalTime());
        Calendar endCalendar = calendar;
        endCalendar.add(Calendar.SECOND, bookingRequestsWrap.getPeriod());

        String endTime = dateFormat.format(endCalendar.getTime());


        message = message.concat("<div  border='0' cellpadding='0' cellspacing='0' height='100%' width='100%' style='background-color: #F7F7F7;width: 100%;padding-top: 50px;padding-bottom: 50px; font-family: \'Helvetica neue\',Helvetica,arial,sans-serif;'>");
        message = message.concat("<table class='main_mail_body' style='width:100%;max-width: 600px;margin: auto;border-collapse: collapse' cellspacing='0' cellpadding='0'><tr><td>");
        message = message.concat("<div style='background-color: white;font-family: sans-serif;font-size: 19px;color:black;padding-left: 10px;height: 100px;padding-top: 10px;text-align:center;'>");
        message = message.concat("Hello," + bookingRequestsWrap.getUser().getName() + "<br>");
        if(automatic) {
            message = message.concat("This is your order confirmation at:<br>");
        } else {
            message = message.concat("Your booking request at ");
        }
        message = message.concat("<span style='color: #2196F3;'>" + placeInfo.getUserPlace().getPlace() + "," + placeInfo.getUserPlace().getBranch() + "</span>");
        if(!automatic) {
            message = message.concat(" has been send for confirmation.<br>");
            message = message.concat("<span style='color: grey;font-family: sans-serif;line-height: 40px;'>Please wait for approval</span>");
        }
        message = message.concat("</div></td></tr><tr><td style='position:relative; '>");
        message = message.concat("<img src='" + topwhiteIcon + "' style='width: 100%;position:absolute;bottom:0px;display: block;border:none;'></td></tr><tr><td>");
        message = message.concat("<div style='background-color: #EDEDED;padding: 10px;'>");
        message = message.concat("<table class='mail_details_table' cellspacing='0' cellpadding='0' style='width: 100%; border-collapse: collapse'>");
        message = message.concat("<tbody><tr>");
        message = message.concat(" <td class='mdh' style='width: 100%;height: 60px;vertical-align: top;position: relative;' colspan='4'>");
        message = message.concat("   <div style='float: left;font-size: 18px;'>Order Summary</div>");
        if(!automatic) {
            message = message.concat("   <div style='float:left;font-size: 13px;font-family: Calibri;background-color: #FF5722;font-weight: 600;color: white;padding: 3px;border-radius: 8px;margin-left: 10px;box-shadow: 0 3px 8px white;'>pending approval</div>");
        }
        message = message.concat("   <div style='float: right;font-size: 14px;color: grey;'>" + fromTime + "</div>");
        message = message.concat("   <div style='position: relative;margin-top: 30px;border-bottom: 1px  #B9B9B9;border-bottom-style: dashed;'></div>");
        message = message.concat("   <div style='margin-top: 5px;color: grey;'>Order #: <span style='color: #2196F3;'>" + bookingRequestsWrap.getBookID() + "</span></div>");
        message = message.concat(" </td>");
        message = message.concat("</tr>");
        message = message.concat("<tr style='text-align: center;height: 30px;color: grey;font-size: 14px;'>");
        message = message.concat("  <td>Name</td>");
        message = message.concat("  <td>Persons</td>");
        message = message.concat("  <td>Time</td>");
        message = message.concat("  <td>Till</td>");
        message = message.concat("</tr>");
        message = message.concat("<tr style='text-align: center;height: 50px;border-bottom: 1px dashed #D2D2D2;'>");
        message = message.concat("  <td>" + bookingRequestsWrap.getUser().getName() + " " + bookingRequestsWrap.getUser().getFamily() + "</td>");
        message = message.concat("  <td>" + bookingRequestsWrap.getTotalPersons() + "</td>");
        message = message.concat("  <td>" + fromTime + "</td>");
        message = message.concat("  <td>" + endTime + "</td>");
        message = message.concat("</tr>");
        message = message.concat("<tr style='height: 30px;'><td colspan='4' style='text-align: left;height: 30px;font-size: 14px;color: grey;'>");
        message = message.concat("  <div> Ordered places details</div>");
        message = message.concat("  </td>");
        message = message.concat("</tr>");
        message = message.concat("<tr style='height: 30px;text-align: center;color: grey;font-size: 14px;'>");
        message = message.concat("  <td></td>");
        message = message.concat("  <td>name</td>");
        message = message.concat("  <td>floor</td>");
        message = message.concat("  <td>persons</td>");
        message = message.concat("</tr>");

        Integer ind = 1;
        for (BookingRequest singlePlace : bookingRequestsWrap.getBookingList()) {
            message = message.concat("<tr style='text-align: center;'>");
            message = message.concat("  <td>" + ind + "</td>");
            message = message.concat("  <td>" + placeInfo.getUserPlace().getNameBySid(singlePlace.getSid()) + "</td>");
            message = message.concat("  <td>" + placeInfo.getUserPlace().getFloorBySid(singlePlace.getSid()) + "</td>");
            message = message.concat("  <td>" + singlePlace.getPersons() + "</td>");
            message = message.concat("</tr>");
            ind += 1;
        }

        message = message.concat("</tbody></table>");
        message = message.concat("</div></td></tr><tr><td style='position:relative; '>");
        message = message.concat("<img src='" + topgreyIcon + "' style='width: 100%;position:absolute;top:0px;display: block;border:none;'></td></tr><tr><td>");
        message = message.concat("<div style='background: white;padding: 10px;'>");
        message = message.concat("<table cellspacing='0' cellpadding='0' style='width: 100%; border-collapse: collapse;'>");
        message = message.concat(" <tbody><tr>");
        message = message.concat("   <td style=' vertical-align: top; padding-top: 10px;  text-align: right; width:60%'>");


        dateFormat = new SimpleDateFormat("HH:mm");
        String fromTime_ = dateFormat.format(bookingRequestsWrap.getPlaceLocalTime());
        Date toTimeDate = bookingRequestsWrap.getPlaceLocalTime();
        toTimeDate.setTime(toTimeDate.getTime() + bookingRequestsWrap.getPeriod() * 1000);
        String toTime = dateFormat.format(toTimeDate);
        dateFormat = new SimpleDateFormat("dd MMMM");
        String longDate = dateFormat.format(bookingRequestsWrap.getPlaceLocalTime());

        message = message.concat(" <table cellspacing='0' cellpadding='0' style='height: 40px;width: 100%; border-collapse: collapse;margin-bottom: 10px;'>");
        message = message.concat("  <tbody><tr><td style='width: 30px;vertical-align: top;'><img src='" + clockIcon + "' style='width: 20px;'></td>");
        message = message.concat("  <td style='float: left;text-align: left;padding-left: 10px;font-style: italic;font-size: 14px;color: grey;'>" + longDate + " , from " + fromTime_ + " to " + toTime + "</td></tr></tbody></table>");
        message = message.concat("  <table cellspacing='0' cellpadding='0' style='height: 40px;width: 100%; border-collapse: collapse;margin-bottom: 10px;'>");
        message = message.concat("  <tbody><tr><td style='width: 30px;vertical-align: top;'><img src='" + markerIcon + "' style='width: 20px;'></td>");
        message = message.concat("  <td style='float: left;text-align: left;padding-left: 10px;font-style: italic;font-size: 14px;color: grey;'>" + placeInfo.getUserPlace().getAddress() + "</td></tr></tbody></table>");
        if (!placeInfo.getPlacePhone().equals("")) {
            message = message.concat("  <table cellspacing='0' cellpadding='0' style='height: 40px;width: 100%; border-collapse: collapse;margin-bottom: 10px;'>");
            message = message.concat("  <tbody><tr><td style='width: 30px;vertical-align: top;'><img src='" + phoneIcon + "' style='width: 20px;'></td>");
            message = message.concat("  <td style='float: left;text-align: left;padding-left: 10px;font-style: italic;font-size: 14px;color: grey;'>" + placeInfo.getPlacePhone() + "</td></tr></tbody></table>");
        }
        if (!placeInfo.getPlaceMail().equals("")) {
            message = message.concat("  <table cellspacing='0' cellpadding='0' style='height: 40px;width: 100%; border-collapse: collapse;margin-bottom: 10px;'>");
            message = message.concat("  <tbody><tr><td style='width: 30px;vertical-align: top;'><img src='" + mailIcon + "' style='width: 20px;'></td>");
            message = message.concat("  <td style='float: left;text-align: left;padding-left: 10px;font-style: italic;font-size: 14px;color: grey;'>" + placeInfo.getPlaceMail() + "</td></tr></tbody></table>");
        }
        if (!placeInfo.getPlaceSiteURL().equals("")) {
            message = message.concat("  <table cellspacing='0' cellpadding='0' style='height: 40px;width: 100%; border-collapse: collapse;margin-bottom: 10px;'>");
            message = message.concat("  <tbody><tr><td style='width: 30px;vertical-align: top;'><img src='" + homeurlIcon + "' style='width: 20px;'></td>");
            message = message.concat("  <td style='float: left;text-align: left;padding-left: 10px;font-style: italic;font-size: 14px;color: grey;'>" + placeInfo.getPlaceSiteURL() + "</td></tr></tbody></table>");
        }
        message = message.concat("   </td>");
        message = message.concat("   <td style='width:40%;text-align:right'>");
        message = message.concat("   <img style='width:100%;' src='http://maps.googleapis.com/maps/api/staticmap?center=" + placeInfo.getUserPlace().getLat() + "," + placeInfo.getUserPlace().getLng() + "&zoom=14&amp;size=250x250&markers=" + placeInfo.getUserPlace().getLat() + "," + placeInfo.getUserPlace().getLng() + "'>");
        message = message.concat("   </td>");
        message = message.concat("</tr>  ");
        message = message.concat("</tbody></table>");
        message = message.concat("</div></td></tr><tr><td style='position:relative; '>");
        message = message.concat("<img src='" + topwhiteIcon + "' style='width: 100%;position:absolute;bottom:0px;display: block;border:none;'></td></tr><tr><td>");
        message = message.concat("<div style='background-color:#ededed;vertical-align:bottom;padding:10px;width:100%;max-width:580px;display: inline-block;'>");
        message = message.concat("<div style='margin-top: 10px;text-align: center;'><a href='https://www.pickoplace.com/ppunsubscribe?servlet=unsubscribe&umail=" + bookingRequestsWrap.getUser().getEmail() + "&uekey=" + bookingRequestsWrap.getUserEntityKeyString() + "' style='font-size: 14px;color: #2196F3;text-decoration: none;'>You can unsubscribe from receiving future orders confirmations</a></div>");
        message = message.concat("<div style='margin-top: 10px;margin-bottom: 20px;text-align: center;'><a href='https://www.pickoplace.com/frommailaction?servlet=userbookings' style='font-size: 14px;color: #2196F3;text-decoration: none;'>Check your orders at Pickoplace account</a></div>");
        message = message.concat("<div style='font-size: 12px;color: grey;font-family: inherit;text-align: center;'>You received that message by making online order using Pickoplace extention.</div>");
        message = message.concat("<div style='font-size: 12px;color: grey;font-family: inherit;text-align: center;'>In case this message was sent by mistake , please ignore it</div>");
        message = message.concat("<div style='float: right;text-align: center;font-size: 10px;margin-top: 30px;color: #B5B5B5;'>Contact Pickoplace:<br>+972526775065<br>contact@pickoplace.com</div>");
        message = message.concat("</div>");
        message = message.concat("</tr></td></table>");
        message = message.concat("</div>");

        return message;
    }

    public String GetNewAdminConfirmationEmail(PlaceInfo placeInfo, String verificationCode) {
        String message = "";
        message = message.concat("<div  border='0' cellpadding='0' cellspacing='0' height='100%' width='100%' style='background-color: #F7F7F7;width: 100%;padding-top: 50px;padding-bottom: 50px; font-family: \'Helvetica neue\',Helvetica,arial,sans-serif;'>");
        message = message.concat("Your email was registered in Pickoplace service as site administrator for:<br>");
        message = message.concat(placeInfo.getUserPlace().getPlace() + "," + placeInfo.getUserPlace().getBranch() + "<br>");
        message = message.concat("<br><div style=\"color:#999;text-align:center;font:11px Arial;line-height:1.4em;max-width:600px;\"><p style=\"text-decoration:none;color:#999;display:inline-block;padding-bottom:4px\">This message was sent from a notification-only email address that does not accept incoming email.</p></div> ");
        message = message.concat("<div style=\"color:#999;text-align:center;font:11px Arial;line-height:1.4em;max-width:600px;\"><p style=\"text-decoration:none;color:#999;display:inline-block;padding-bottom:4px\">If you did not make this request, simply ignore this message.</p></div> ");
        message = message.concat("</div>");
        return message;
    }

    public String GetRemoveAdminConfirmationEmail(PlaceInfo placeInfo, String verificationCode) {
        String message = "";
        message = message.concat("<div  border='0' cellpadding='0' cellspacing='0' height='100%' width='100%' style='background-color: #F7F7F7;width: 100%;padding-top: 50px;padding-bottom: 50px; font-family: \'Helvetica neue\',Helvetica,arial,sans-serif;'>");
        message = message.concat("Your email has been removed from Pickoplace service as site administrator for:<br>");
        message = message.concat(placeInfo.getUserPlace().getPlace() + "," + placeInfo.getUserPlace().getBranch() + "<br>");
        message = message.concat("<br><div style=\"color:#999;text-align:center;font:11px Arial;line-height:1.4em;max-width:600px;\"><p style=\"text-decoration:none;color:#999;display:inline-block;padding-bottom:4px\">This message was sent from a notification-only email address that does not accept incoming email.</p></div> ");
        message = message.concat("<div style=\"color:#999;text-align:center;font:11px Arial;line-height:1.4em;max-width:600px;\"><p style=\"text-decoration:none;color:#999;display:inline-block;padding-bottom:4px\">If you did not make this request, simply ignore this message.</p></div> ");
        message = message.concat("</div>");
        return message;
    }

    public String VerificationCodeEmail(PlaceInfo placeInfo, String verificationCode) {
        String message = "";
        message = message.concat("<div  border='0' cellpadding='0' cellspacing='0' height='100%' width='100%' style='background-color: #F7F7F7;width: 100%;padding-top: 50px;padding-bottom: 50px; font-family: \'Helvetica neue\',Helvetica,arial,sans-serif;'>");
        message = message.concat("Your email has been set to receive Booking Approval requests for:<br>");
        message = message.concat(placeInfo.getUserPlace().getPlace() + "," + placeInfo.getUserPlace().getBranch() + "<br>");
        message = message.concat("Please verify it at administration console with the next passcode (Valid for 10 minutes)<br>");
        message = message.concat("<div style=\"font-size:16px;color:red;font-weight: bold;\">" + verificationCode + "</div><br>");
        message = message.concat("<br><div style=\"color:#999;text-align:center;font:11px Arial;line-height:1.4em;max-width:600px;\"><p style=\"text-decoration:none;color:#999;display:inline-block;padding-bottom:4px\">This message was sent from a notification-only email address that does not accept incoming email.</p></div> ");
        message = message.concat("<div style=\"color:#999;text-align:center;font:11px Arial;line-height:1.4em;max-width:600px;\"><p style=\"text-decoration:none;color:#999;display:inline-block;padding-bottom:4px\">If you did not make this request, simply ignore this message.</p></div> ");
        message = message.concat("</div>");
        return message;
    }

    public String RemoveConfirmationEmail(PlaceInfo placeInfo) {
        String message = "";
        message = message.concat("<div  border='0' cellpadding='0' cellspacing='0' height='100%' width='100%' style='background-color: #F7F7F7;width: 100%;padding-top: 50px;padding-bottom: 50px; font-family: \'Helvetica neue\',Helvetica,arial,sans-serif;'>");
        message = message.concat("Your email has been removed from Pickoplace service. You will not be able to review booking request<br>");
        message = message.concat(placeInfo.getUserPlace().getPlace() + "," + placeInfo.getUserPlace().getBranch() + "<br>");
        message = message.concat("<br><div style=\"color:#999;text-align:center;font:11px Arial;line-height:1.4em;max-width:600px;\"><p style=\"text-decoration:none;color:#999;display:inline-block;padding-bottom:4px\">This message was sent from a notification-only email address that does not accept incoming email.</p></div> ");
        message = message.concat("<div style=\"color:#999;text-align:center;font:11px Arial;line-height:1.4em;max-width:600px;\"><p style=\"text-decoration:none;color:#999;display:inline-block;padding-bottom:4px\">If you did not make this request, simply ignore this message.</p></div> ");
        message = message.concat("</div>");
        return message;
    }

    public String RemoveNotificationEmail(PlaceInfo placeInfo) {
        String message = "";
        message = message.concat("<div  border='0' cellpadding='0' cellspacing='0' height='100%' width='100%' style='background-color: #F7F7F7;width: 100%;padding-top: 50px;padding-bottom: 50px; font-family: \'Helvetica neue\',Helvetica,arial,sans-serif;'>");
        message = message.concat("Your email has been removed from Pickoplace service. You will not receive booking notification emails for<br>");
        message = message.concat(placeInfo.getUserPlace().getPlace() + "," + placeInfo.getUserPlace().getBranch() + "<br>");
        message = message.concat("<br><div style=\"color:#999;text-align:center;font:11px Arial;line-height:1.4em;max-width:600px;\"><p style=\"text-decoration:none;color:#999;display:inline-block;padding-bottom:4px\">This message was sent from a notification-only email address that does not accept incoming email.</p></div> ");
        message = message.concat("<div style=\"color:#999;text-align:center;font:11px Arial;line-height:1.4em;max-width:600px;\"><p style=\"text-decoration:none;color:#999;display:inline-block;padding-bottom:4px\">If you did not make this request, simply ignore this message.</p></div> ");
        message = message.concat("</div>");
        return message;
    }

    public String VerificationCodeEmailAuto(PlaceInfo placeInfo, String verificationCode) {
        String message = "";
        message = message.concat("<div  border='0' cellpadding='0' cellspacing='0' height='100%' width='100%' style='background-color: #F7F7F7;width: 100%;padding-top: 50px;padding-bottom: 50px; font-family: \'Helvetica neue\',Helvetica,arial,sans-serif;'>");
        message = message.concat("Your email has been set to receive Booking notifications for:<br>");
        message = message.concat(placeInfo.getUserPlace().getPlace() + "," + placeInfo.getUserPlace().getBranch() + "<br>");
        message = message.concat("Please verify it at administration console with the next passcode (Valid for 10 minutes)<br>");
        message = message.concat("<div style=\"font-size:16px;color:red;font-weight: bold;\">" + verificationCode + "</div><br>");
        message = message.concat("<br><div style=\"color:#999;text-align:center;font:11px Arial;line-height:1.4em;max-width:600px;\"><p style=\"text-decoration:none;color:#999;display:inline-block;padding-bottom:4px\">This message was sent from a notification-only email address that does not accept incoming email.</p></div> ");
        message = message.concat("<div style=\"color:#999;text-align:center;font:11px Arial;line-height:1.4em;max-width:600px;\"><p style=\"text-decoration:none;color:#999;display:inline-block;padding-bottom:4px\">If you did not make this request, simply ignore this message.</p></div> ");
        message = message.concat("</div>");
        return message;
    }

    public String waiterBookingNotification(Boolean automatic, BookingRequestWrap bookingRequestsWrap, PlaceInfo placeInfo, GenericUser genuser, String code) {
        String message = "";
        String topwhiteIcon = "https://storage.googleapis.com/pp_icons/splittertopwhite.jpg";
        String topgreyIcon = "https://storage.googleapis.com/pp_icons/splittertopgrey.jpg";

        SimpleDateFormat dateFormat = new SimpleDateFormat("dd MMM, HH:mm");
        String fromTime = dateFormat.format(bookingRequestsWrap.getPlaceLocalTime());

        Calendar calendar = Calendar.getInstance();
        calendar.setTime(bookingRequestsWrap.getPlaceLocalTime());
        Calendar endCalendar = calendar;
        endCalendar.add(Calendar.SECOND, bookingRequestsWrap.getPeriod());

        String endTime = dateFormat.format(endCalendar.getTime());


        String imgUrl = "";
        if (genuser.isGoogle()) {
            imgUrl = genuser.getGouser().getPicture();
        } else if (genuser.isFacebook()) {
            imgUrl = "http://graph.facebook.com/" + genuser.getFbuser().getId() + "/picture";
        }
        message = message.concat("<div  border='0' cellpadding='0' cellspacing='0' height='100%' width='100%' style='background-color: #F7F7F7;width: 100%;padding-top: 50px;padding-bottom: 50px; font-family: \'Helvetica neue\',Helvetica,arial,sans-serif;'>");
        message = message.concat("<table class='main_mail_body' style='width:100%;max-width: 600px;margin: auto;border-collapse: collapse' cellspacing='0' cellpadding='0'><tr><td>");
        message = message.concat("<div style='background-color: white;font-family: sans-serif;font-size: 19px;color:black;padding-left: 10px;height: 100px;padding-top: 10px;text-align:center'>");
        if (automatic) {
            message = message.concat("New booking received at:<br>");
        } else {
            message = message.concat("New booking request at:<br>");
        }
        message = message.concat("<span style='color: #2196F3;'>" + placeInfo.getUserPlace().getPlace() + "," + placeInfo.getUserPlace().getBranch() + "</span>");
        if (!automatic) {
            message = message.concat("<br><span  style = 'color: #B5B5B5;line-height: 40px;font-size: 17px;' > CONFIRMATION REQUIRED</span >");
        }
        message = message.concat("</div></td></tr><tr><td style='position:relative; '>");
        message = message.concat("<img src='" + topwhiteIcon + "' style='width: 100%;position:absolute;bottom:0px;display: block;border:none;'></td></tr><tr><td>");
        message = message.concat("<div style='background-color: #EDEDED;padding: 10px;'>");
        message = message.concat("<table class='mail_details_table' cellspacing='0' cellpadding='0' style='width: 100%; border-collapse: collapse'>");
        message = message.concat("<tbody><tr>");
        message = message.concat(" <td class='mdh' style='width: 100%;height: 60px;vertical-align: top;position: relative;' colspan='5'>");
        message = message.concat("   <div style='float: left;font-size: 18px;'>Order Summary</div>");
        message = message.concat("   <div style='float: right;font-size: 14px;color: grey;'>" + fromTime + "</div>");
        message = message.concat("   <div style='position: relative;margin-top: 30px;border-bottom: 1px  #B9B9B9;border-bottom-style: dashed;'></div>");
        message = message.concat("   <div style='margin-top: 5px;color: grey;'>Order #: <span style='color: #2196F3;'>" + bookingRequestsWrap.getBookID() + "</span></div>");
        message = message.concat(" </td>");
        message = message.concat("</tr>");
        message = message.concat("<tr style='text-align: center;height: 30px;color: grey;font-size: 14px;'>");
        message = message.concat("  <td colspan='2'>Name</td>");
        message = message.concat("  <td>Persons</td>");
        message = message.concat("  <td>Time</td>");
        message = message.concat("  <td>Till</td>");
        message = message.concat("</tr>");
        message = message.concat("<tr style='text-align: center;height: 50px;border-bottom: 1px dashed #D2D2D2;'>");
        message = message.concat("  <td><img src=\"" + imgUrl + "\" style='width:40px'/></td>");
        message = message.concat("  <td>" + bookingRequestsWrap.getUser().getName() + " " + bookingRequestsWrap.getUser().getFamily() + "</td>");
        message = message.concat("  <td>" + bookingRequestsWrap.getTotalPersons() + "</td>");
        message = message.concat("  <td>" + fromTime + "</td>");
        message = message.concat("  <td>" + endTime + "</td>");
        message = message.concat("</tr>");
        message = message.concat("<tr style='height: 30px;'><td colspan='5' style='text-align: left;height: 30px;font-size: 14px;color: grey;'>");
        message = message.concat("  <div> Ordered places details</div>");
        message = message.concat("  </td>");
        message = message.concat("</tr>");
        message = message.concat("<tr style='height: 30px;text-align: center;color: grey;font-size: 14px;'>");
        message = message.concat("  <td colspan='2'></td>");
        message = message.concat("  <td>name</td>");
        message = message.concat("  <td>floor</td>");
        message = message.concat("  <td>persons</td>");
        message = message.concat("</tr>");

        Integer ind = 1;
        for (BookingRequest singlePlace : bookingRequestsWrap.getBookingList()) {
            message = message.concat("<tr style='text-align: center;'>");
            message = message.concat("  <td colspan='2'>" + ind + "</td>");
            message = message.concat("  <td>" + placeInfo.getUserPlace().getNameBySid(singlePlace.getSid()) + "</td>");
            message = message.concat("  <td>" + placeInfo.getUserPlace().getFloorBySid(singlePlace.getSid()) + "</td>");
            message = message.concat("  <td>" + singlePlace.getPersons() + "</td>");
            message = message.concat("</tr>");
            ind += 1;
        }

        message = message.concat("</tbody></table>");
        message = message.concat("</div></td></tr><tr><td style='position:relative; '>");
        message = message.concat("<img src='" + topgreyIcon + "' style='width: 100%;position:absolute;top:0px;display: block;border:none;'></td></tr>");
        if (!automatic) {
            message = message.concat("<div style='position: relative;height: 100px;'>");
            message = message.concat("    <a  target=\"_blank\" href='https://www.pickoplace.com/waiterLinkActions/declineBooking?pid=" + placeInfo.getUserPlace().getPlaceID() + "&bid=" + bookingRequestsWrap.getBookID() + "&code=" + code + "'>");
            message = message.concat("        <div style='width: 40%;min-height:40px;background-color:#ff5252;color:white;font-family:Calibri;font-size: 1.5em;text-align:center;line-height:40px;margin-top:30px;margin-left: 5%;border-radius:3px;float:left;'>Decline</div>");
            message = message.concat("    </a>");
            message = message.concat("    <a  target=\"_blank\" href='https://www.pickoplace.com/waiterLinkActions/acceptBooking?pid=" + placeInfo.getUserPlace().getPlaceID() + "&bid=" + bookingRequestsWrap.getBookID() + "&code=" + code + "'>");
            message = message.concat("        <div style='width: 40%;min-height:40px;background-color:#4caf50;color:white;font-family:Calibri;font-size: 1.5em;text-align:center;line-height:40px;margin-top:30px;margin-right: 5%;border-radius:3px;float:right;'>Accept</div>");
            message = message.concat(" </div>");
        }
        message = message.concat("<tr><td style='position:relative;'>");
        message = message.concat("<img src='" + topwhiteIcon + "' style='width: 100%;position:absolute;bottom:0px;display: block;border:none;'></td></tr><tr><td>");
        message = message.concat("<div style='background-color:#ededed;vertical-align:bottom;padding:10px;width:100%;max-width:580px;display: inline-block;'>");
        message = message.concat("<div style='font-size: 12px;color: grey;font-family: inherit;text-align: center;'>You received that message cause your eMail mentioned at Pickoplace settings for " + placeInfo.getUserPlace().getPlace() + "," + placeInfo.getUserPlace().getBranch() + ".</div>");
        message = message.concat("<div style='font-size: 12px;color: grey;font-family: inherit;text-align: center;'>In case this message was sent by mistake , please ignore it</div>");
        message = message.concat("<div style='float: right;text-align: center;font-size: 10px;margin-top: 30px;color: #B5B5B5;'>Contact Pickoplace:<br>+972526775065<br>contact@pickoplace.com</div>");
        message = message.concat("</div>");
        message = message.concat("</tr></td></table>");
        message = message.concat("</div>");

        return message;
    }
}
