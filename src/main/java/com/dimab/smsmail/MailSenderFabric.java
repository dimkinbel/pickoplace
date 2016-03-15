package com.dimab.smsmail;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import com.dimab.pp.dto.BookingRequestWrap;
import com.dimab.pp.dto.PlaceInfo;
import com.dimab.pp.login.GenericUser;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.CompositeFilterOperator;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;

public class MailSenderFabric {


	public void SendEmail(String type,String from , String to , BookingRequestWrap bookingRequestsWrap,PlaceInfo placeInfo,String VerificationCode) {
		String message = "";
		MailGenerator mailGenerator = new MailGenerator();
		switch(type){
			case "userConfirmation":
				message = mailGenerator.GetConfirmationMail(bookingRequestsWrap, placeInfo);
				break;
			case "waiterCancelUserBooking":
				message = mailGenerator.GetCancellationEmail(bookingRequestsWrap,placeInfo);
				break;
			case "NewAdminNotification":
				message = mailGenerator.GetNewAdminConfirmationEmail(placeInfo,VerificationCode);
				break;
			case "RemoveAdminNotification":
				message = mailGenerator.GetRemoveAdminConfirmationEmail(placeInfo,VerificationCode);
				break;
			case "SendVerificationCode":
				message = mailGenerator.VerificationCodeEmail(placeInfo,VerificationCode);
				break;
			case "SendVerificationCodeForAutomatic":
				message = mailGenerator.VerificationCodeEmailAuto(placeInfo,VerificationCode);
				break;
			case "RemoveConfirmationEmail":
				message = mailGenerator.RemoveConfirmationEmail(placeInfo);
				break;
			case "RemoveAutoNotificationEmail":
				message = mailGenerator.RemoveNotificationEmail(placeInfo);
				break;
			case "BBBBAa": break;
			case "BBBBBB": break;
		}

		Properties props = new Properties();
		Session session = Session.getDefaultInstance(props, null);
		try {
			Message msg = new MimeMessage(session);
			msg.setFrom(new InternetAddress(from, "PickoPlace"));
			msg.addRecipient(Message.RecipientType.TO,
					new InternetAddress(to, "You"));

			switch(type){
				case "userConfirmation":
					msg.setSubject("Order Confirmation");
					break;
				case "waiterCancelUserBooking":
					msg.setSubject("Order Cancellation");
					break;
				case "NewAdminNotification":
					msg.setSubject("Pickoplace: New Admin Confirmation ");
					break;
				case "RemoveAdminNotification":
					msg.setSubject("Pickoplace: Admin Removal Notification");
					break;
				case "RemoveConfirmationEmail":
					msg.setSubject("Pickoplace: Confirmation mail removed");
					break;
				case "SendVerificationCode":
					msg.setSubject("Pickoplace: One time passcode");
					break;
				case "SendVerificationCodeForAutomatic":
					msg.setSubject("Pickoplace: One time passcode");
					break;
				case "RemoveAutoNotificationEmail":
					msg.setSubject("Pickoplace: Notification eMail removal");
					break;

			}

			System.out.println(message);
			msg.setContent(message, "text/html; charset=utf-8");
			msg.setSentDate(new Date());

			Transport.send(msg);

		} catch (AddressException e) {
			// ...
		} catch (MessagingException e) {
			// ...
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public boolean isSubscribed(DatastoreService datastore,GenericUser genuser) {
		Filter UserEmail = new  FilterPredicate("username",FilterOperator.EQUAL,genuser.getEmail());
		Filter UserSubscribed = new  FilterPredicate("emailsend",FilterOperator.EQUAL,false);
		Filter composeFilter = CompositeFilterOperator.and(UserEmail,UserSubscribed);
		Query q = new Query("Users").setFilter(composeFilter).setKeysOnly();
		PreparedQuery pq = datastore.prepare(q);
	    Entity result = pq.asSingleEntity();
	    if (result == null) {
	    	return true;
	    }
	    return false;
	}
	public String getUserKey(DatastoreService datastore,GenericUser genuser) {

		Filter UserEmail = new  FilterPredicate("username",FilterOperator.EQUAL,genuser.getEmail());
		Query q = new Query("Users").setFilter(UserEmail).setKeysOnly(); 
		
		PreparedQuery pq = datastore.prepare(q);
	    Entity result = pq.asSingleEntity();
	    if (result != null) {
	    	return KeyFactory.keyToString(result.getKey());
	    } else {
	    	return "nokey";
	    }
	}
}
