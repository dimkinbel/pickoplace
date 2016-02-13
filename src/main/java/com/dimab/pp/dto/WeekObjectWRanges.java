package com.dimab.pp.dto;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by dima on 13-Feb-16.
 */
public class WeekObjectWRanges {
    List<WeekDay> weekObject = new ArrayList<WeekDay>();

    public List<WeekDay> getWeekObject() {
        return weekObject;
    }

    public void setWeekObject(List<WeekDay> weekObject) {
        this.weekObject = weekObject;
    }
}
