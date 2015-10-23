package com.dimab.pp.dto;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class BookingListForJSON {
   List<SingleTimeRangeLong> ordersList = new ArrayList<SingleTimeRangeLong>();

public List<SingleTimeRangeLong> getOrdersList() {
	return ordersList;
}

public void setOrdersList(List<SingleTimeRangeLong> ordersList) {
	this.ordersList = ordersList;
}
public boolean isAvailable(SingleTimeRangeLong  tr,int minSeconds){
	  Long tr_from = tr.getFrom();
	  Long tr_to = tr.getTo();
	  
	  boolean foundPlace = false;
	  if(this.ordersList.size() == 0) {
		  foundPlace = true;
	  } else {
		  for (int i = 0; i < this.ordersList.size(); i ++) {
			   if (i == 0) {
				   if (tr_to + minSeconds <= ordersList.get(0).getFrom()) {
					   foundPlace = true;
				       break;
				   } 
				   
			   } else  {
				 // Next exists
			     if (ordersList.get(i-1).getTo() + minSeconds <= tr_from && tr_to + minSeconds <= ordersList.get(i).getFrom()) {
					   foundPlace = true;
					   break;
			     } 
			   } 
            if (i == ordersList.size()-1) {
				   // Check last
				   if(ordersList.get(i).getTo() + minSeconds <=tr_from) {
					   foundPlace = true;
					   break;
				   }
			   }
			}
	  }
	  if (foundPlace ) {
		  return true;
	  } else {
		  return false;
	  }	
}
public boolean add(SingleTimeRangeLong  tr,int minSeconds) {
	  Long tr_from = tr.getFrom();
	  Long tr_to = tr.getTo();
	  
	  boolean foundPlace = false;
	  if(this.ordersList.size() == 0) {
		  this.ordersList.add(0,tr); 
		  foundPlace = true;
		  System.out.println("BookingListForJSON added order (0):BID="+tr.getBid()+",FROM="+tr_from+",TO="+tr_to);
	  } else {
		  for (int i = 0; i < this.ordersList.size(); i ++) {
			   if (i == 0) {
				   if (tr_to + minSeconds <= ordersList.get(0).getFrom()) {
					   ordersList.add(0, tr);
					   foundPlace = true;
					   System.out.println("BookingListForJSON added order (0):BID="+tr.getBid()+",FROM="+tr_from+",TO="+tr_to);
				       break;
				   } 
				   
			   } else  {
				 // Next exists
			     if (ordersList.get(i-1).getTo() + minSeconds <= tr_from && tr_to + minSeconds <= ordersList.get(i).getFrom()) {
			    	 ordersList.add(i, tr);
					   foundPlace = true;
					   System.out.println("BookingListForJSON added order ("+i+"):BID="+tr.getBid()+",FROM="+tr_from+",TO="+tr_to);
					   break;
			     } 
			   } 
              if (i == ordersList.size()-1) {
				   // Check last
				   if(ordersList.get(i).getTo() + minSeconds <=tr_from) {
					   ordersList.add(i+1, tr);
				       int sizen = i+1;
					   foundPlace = true;
					   System.out.println("BookingListForJSON added order ("+sizen+"):BID="+tr.getBid()+",FROM="+tr_from+",TO="+tr_to);
					   break;
				   }
			   }
			}
	  }
	  if (foundPlace ) {
		  return true;
	  } else {
		  return false;
	  }
   }
public List<SingleTimeRangeLong> getInRange(Long dateSeconds,Long period) {
	List<SingleTimeRangeLong>  ordersListr = new ArrayList<SingleTimeRangeLong>();
	SingleTimeRangeLong requestDate = new SingleTimeRangeLong();
	requestDate.setFrom(dateSeconds);
	requestDate.setTo(dateSeconds+period);
	Date from = new Date(dateSeconds*1000);
	Date to = new Date((dateSeconds+period)*1000);
	System.out.println("GetRangeRequest:"+ from + "-----" + to);
	for (SingleTimeRangeLong shapeBooked : this.ordersList) {
		if(rangeMatch(shapeBooked,requestDate)) {
			SingleTimeRangeLong nobid = new SingleTimeRangeLong();
			nobid.setFrom(shapeBooked.getFrom());
			nobid.setTo(shapeBooked.getTo());
			nobid.setTestID(shapeBooked.getTestID());
			nobid.setPersons(shapeBooked.getPersons());
			ordersListr.add(nobid);
		}
	}
	return ordersListr;
}
public List<SingleTimeRangeLong> getInRangeWithBID(Long dateSeconds,Long period) {
	List<SingleTimeRangeLong>  ordersListr = new ArrayList<SingleTimeRangeLong>();
	SingleTimeRangeLong requestDate = new SingleTimeRangeLong();
	requestDate.setFrom(dateSeconds);
	requestDate.setTo(dateSeconds+period);
	Date from = new Date(dateSeconds*1000);
	Date to = new Date((dateSeconds+period)*1000);
	System.out.println("GetRangeRequest:"+ from + "-----" + to);
	for (SingleTimeRangeLong shapeBooked : this.ordersList) {
		if(rangeMatch(shapeBooked,requestDate)) {
			SingleTimeRangeLong withbid = new SingleTimeRangeLong();
			withbid.setFrom(shapeBooked.getFrom());
			withbid.setTo(shapeBooked.getTo());
			withbid.setTestID(shapeBooked.getTestID());
			withbid.setBid(shapeBooked.getBid());
			withbid.setPersons(shapeBooked.getPersons());
			ordersListr.add(withbid);
		}
	}
	return ordersListr;
}
public boolean rangeMatch(SingleTimeRangeLong req,SingleTimeRangeLong base) {
	if (req.getTo() <= base.getFrom() || req.getFrom() >= base.getTo()) {
		// Outside base
	} else {
		Date from = new Date(req.getFrom()*1000);
		Date to = new Date(req.getTo()*1000);
		System.out.println("   RangeMatch:"+ from + "-----" + to);
		return true;
	}
	return false;
}
public boolean remove(String bid) {
	  for (int i = 0; i < this.ordersList.size(); i ++) {
		  if(bid.equals(ordersList.get(i).getBid())) {
			  ordersList.remove(i);
			  return true;
		  }
	  }
	return false;
}
}
