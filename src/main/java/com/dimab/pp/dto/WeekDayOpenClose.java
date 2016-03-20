package com.dimab.pp.dto;

public class WeekDayOpenClose {
    boolean open = true;
    int from = 28800;
    int to = 72000;

    public boolean isOpen() {
        return open;
    }

    public void setOpen(boolean open) {
        this.open = open;
    }

    public int getFrom() {
        return from;
    }

    public void setFrom(int from) {
        this.from = from;
    }

    public int getTo() {
        return to;
    }

    public void setTo(int to) {
        this.to = to;
    }

    public String getFromString() {
        String time_ = "00:00";
        Integer hours = (this.from % (3600 * 24)) / 3600;
        String Shours;
        if (hours < 10) {
            Shours = "0" + hours.toString();
        } else {
            Shours = hours.toString();
        }

        Integer minutes = (this.from % 3600) / 60;
        String Sminutes;
        if (minutes < 10) {
            Sminutes = "0" + minutes.toString();
        } else {
            Sminutes = minutes.toString();
        }

        time_ = Shours + ":" + Sminutes;
        return time_;
    }
    public String getToString() {
        String time_ = "00:00";
        Integer hours = (this.to % (3600 * 24)) / 3600;
        String Shours;
        if (hours < 10) {
            Shours = "0" + hours.toString();
        } else {
            Shours = hours.toString();
        }

        Integer minutes = (this.to % 3600) / 60;
        String Sminutes;
        if (minutes < 10) {
            Sminutes = "0" + minutes.toString();
        } else {
            Sminutes = minutes.toString();
        }

        time_ = Shours + ":" + Sminutes;
        return time_;
    }
}
