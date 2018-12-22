package com.dimab.pp.dto;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by dima on 02-Mar-16.
 */
public class ConfigWokingHours {
    WorkingWeek workingWeek = new WorkingWeek();
    List<Integer> closeDates = new ArrayList<Integer>();

    public WorkingWeek getWorkingWeek() {
        return workingWeek;
    }

    public void setWorkingWeek(WorkingWeek workingWeek) {
        this.workingWeek = workingWeek;
    }

    public List<Integer> getCloseDates() {
        return closeDates;
    }

    public void setCloseDates(List<Integer> closeDates) {
        this.closeDates = closeDates;
    }
}
