package com.dimab.pp.dto;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by dima on 13-Feb-16.
 */
public class WeekDay {
    boolean open = true;
    List<WeekDayOpenClose> openList = new ArrayList<WeekDayOpenClose>();

    public List<WeekDayOpenClose> getOpenList() {
        return openList;
    }

    public void setOpenList(List<WeekDayOpenClose> openList) {
        this.openList = openList;
    }

    public boolean isOpen() {
        return open;
    }

    public void setOpen(boolean open) {
        this.open = open;
    }
}

