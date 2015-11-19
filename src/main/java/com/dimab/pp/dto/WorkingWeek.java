package com.dimab.pp.dto;

import com.google.gson.Gson;

import java.util.ArrayList;
import java.util.List;

public class WorkingWeek {
	WeekDayOpenClose sun = new WeekDayOpenClose();
	WeekDayOpenClose mon = new WeekDayOpenClose();
	WeekDayOpenClose tue = new WeekDayOpenClose();
	WeekDayOpenClose wed = new WeekDayOpenClose();
	WeekDayOpenClose thu = new WeekDayOpenClose();
	WeekDayOpenClose fri = new WeekDayOpenClose();
	WeekDayOpenClose sat = new WeekDayOpenClose();
	public WeekDayOpenClose  getWeekDayOpenClose(int getDayValue) {
		if(getDayValue == 7) {
			getDayValue = 1;
		}
		if(getDayValue == -1) {
			getDayValue = 6;
		}
		WeekDayOpenClose returnDay;
	        switch (getDayValue) {
	            case 0:  returnDay = sun;
	                     break;
	            case 1:  returnDay = mon;
	            		break;
	            case 2:  returnDay = tue;
	                     break;
	            case 3:  returnDay = wed;
	                     break;
	            case 4:  returnDay = thu;
	                     break;
	            case 5:  returnDay = fri;
	                     break;
	            case 6:  returnDay = sat;
	                     break;
	            default: returnDay = sun;
                         break;
	        }
	      return  returnDay;
	}
	public List<SingleTimeRangeLong> deleteRangeFromList(List<SingleTimeRangeLong> inList , int from , int to) {
		List<SingleTimeRangeLong> returnRanges = new ArrayList<SingleTimeRangeLong>();

		for(SingleTimeRangeLong range:inList) {
			if(from<=range.getFrom() && range.getTo()<= to){
				//
				// Remove whole range
			} else {
				if(from <= range.getFrom()  && to < range.getTo() ) {
					SingleTimeRangeLong newRange = new SingleTimeRangeLong();
					newRange.setFrom(new Integer(to).longValue());
					newRange.setTo(range.getTo());
					returnRanges.add(newRange);
				} else if(range.getFrom() < from && to < range.getTo()) {
					SingleTimeRangeLong newRange = new SingleTimeRangeLong();
					newRange.setFrom(range.getFrom());
					newRange.setTo(new Integer(from).longValue());
					returnRanges.add(newRange);

					newRange = new SingleTimeRangeLong();
					newRange.setFrom(new Integer(to).longValue());
					newRange.setTo(range.getTo());
					returnRanges.add(newRange);
				} else if (range.getFrom() < from && range.getTo() <=to  ) {
					SingleTimeRangeLong newRange = new SingleTimeRangeLong();
					newRange.setFrom(range.getFrom());
					newRange.setTo(new Integer(from).longValue());
					returnRanges.add(newRange);
				}

			}

		}

		return returnRanges;
	}
	public boolean isInRangeList(List<SingleTimeRangeLong> tempRanges , int from , int to) {
		for(SingleTimeRangeLong range :tempRanges ) {
			if(range.getFrom() <= from && to <= range.getTo()) {
				return true;
			}
		}
		return false;
	}
	public List<SingleTimeRangeLong> getRangesList(int dayStart , int daysTotal) {
		Gson gson = new Gson();
		List<SingleTimeRangeLong> returnRanges = new ArrayList<SingleTimeRangeLong>();
		int i = 0;
		int addDaySeconds = 0;
		while (i < daysTotal) {
			List<SingleTimeRangeLong> singleDayRanges = new ArrayList<SingleTimeRangeLong>();
			WeekDayOpenClose prevDay = this.getWeekDayOpenClose(dayStart-1);
			WeekDayOpenClose currDay = this.getWeekDayOpenClose(dayStart);

			if(prevDay.isOpen()) {
				if(prevDay.getTo() > 86400) { // End period of previous day is later than today starts
					if(currDay.isOpen()) {
						SingleTimeRangeLong range = new SingleTimeRangeLong();
						range.setFrom(new Integer(addDaySeconds + 0).longValue());
						range.setTo(new Integer(addDaySeconds + (prevDay.getTo() - 86400)).longValue()); // Add open range from previous day
						singleDayRanges.add(range);
					}
				}
			}
			if(currDay.isOpen()) {
				SingleTimeRangeLong range = new SingleTimeRangeLong();
				if(currDay.getTo() > 86400) {
					range.setFrom(new Integer(addDaySeconds + currDay.getFrom()).longValue());
					range.setTo(new Integer(addDaySeconds + 86400).longValue());
				} else {
					range.setFrom(new Integer(addDaySeconds + currDay.getFrom()).longValue());
					range.setTo(new Integer(addDaySeconds + currDay.getTo()).longValue());
				}
				if(singleDayRanges.size()>0) {
					// Check previous range to merge
					SingleTimeRangeLong prevRange = singleDayRanges.get(singleDayRanges.size()-1);
					if(prevRange.getTo() >= range.getFrom()) {
						// Need to merge
						SingleTimeRangeLong newRange = new SingleTimeRangeLong();
						if(range.getFrom() < prevRange.getFrom()) {
							newRange.setFrom(range.getFrom());
						} else {
							newRange.setFrom(prevRange.getFrom());
						}
						if(range.getTo() <  prevRange.getTo()) {
							newRange.setTo(prevRange.getTo());
						} else {
							newRange.setTo(range.getTo());
						}
						singleDayRanges.set(singleDayRanges.size()-1,newRange);
					} else {
						// Just add today range
						singleDayRanges.add(range);
					}
				} else {
					singleDayRanges.add(range);
				}
			}

			// Now add today ranges to the whole ranges list (Merge if required)
			if(returnRanges.size()==0) {
				for(SingleTimeRangeLong range : singleDayRanges) {
					returnRanges.add(range);
				}
			} else {
				SingleTimeRangeLong lastRange = returnRanges.get(returnRanges.size()-1);

				for(SingleTimeRangeLong range : singleDayRanges) {

						if (lastRange.getTo() >= range.getFrom()) {
							if (lastRange.getTo() >= range.getTo()) {
								// Previous range is greater than current - no adding
							} else {
								// Need to merge
								SingleTimeRangeLong mergedRange = new SingleTimeRangeLong();
								mergedRange.setFrom(lastRange.getFrom());
								if(range.getTo() > lastRange.getTo()) {
									mergedRange.setTo(range.getTo());
								} else {
									mergedRange.setTo(lastRange.getTo());
								}
								returnRanges.set(returnRanges.size()-1,mergedRange);
							}
						} else {
							// No merge . just add new one
							returnRanges.add(range);
						}

				}
			}
			i+=1;
			addDaySeconds+=86400;
		}
		return returnRanges;
	}
	public WeekDayOpenClose getSun() {
		return sun;
	}
	public void setSun(WeekDayOpenClose sun) {
		this.sun = sun;
	}
	public WeekDayOpenClose getMon() {
		return mon;
	}
	public void setMon(WeekDayOpenClose mon) {
		this.mon = mon;
	}
	public WeekDayOpenClose getTue() {
		return tue;
	}
	public void setTue(WeekDayOpenClose tue) {
		this.tue = tue;
	}
	public WeekDayOpenClose getWed() {
		return wed;
	}
	public void setWed(WeekDayOpenClose wed) {
		this.wed = wed;
	}
	public WeekDayOpenClose getThu() {
		return thu;
	}
	public void setThu(WeekDayOpenClose thu) {
		this.thu = thu;
	}
	public WeekDayOpenClose getFri() {
		return fri;
	}
	public void setFri(WeekDayOpenClose fri) {
		this.fri = fri;
	}
	public WeekDayOpenClose getSat() {
		return sat;
	}
	public void setSat(WeekDayOpenClose sat) {
		this.sat = sat;
	}

	
}
