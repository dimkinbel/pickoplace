package com.dimab.pp.dto;

/**
 * Created by dima on 28-Mar-16.
 */
public class ShapeDimentions {
    double w;
    double h;
    double x;
    double y;
    double angle;
    String name;
    String sid;
    Integer maxp;
    Integer minp;
    String xperc;
    String yperc;
    Integer persons;
    String floorName;
    String floorId;

    public String getFloorName() {
        return floorName;
    }

    public void setFloorName(String floorName) {
        this.floorName = floorName;
    }

    public String getFloorId() {
        return floorId;
    }

    public void setFloorId(String floorId) {
        this.floorId = floorId;
    }

    public Integer getPersons() {
        return persons;
    }

    public void setPersons(Integer persons) {
        this.persons = persons;
    }

    public String getXperc() {
        return xperc;
    }

    public void setXperc(String xperc) {
        this.xperc = xperc;
    }

    public String getYperc() {
        return yperc;
    }

    public void setYperc(String yperc) {
        this.yperc = yperc;
    }

    public double getW() {
        return w;
    }

    public void setW(double w) {
        this.w = w;
    }

    public double getH() {
        return h;
    }

    public void setH(double h) {
        this.h = h;
    }

    public double getX() {
        return x;
    }

    public void setX(double x) {
        this.x = x;
    }

    public double getY() {
        return y;
    }

    public void setY(double y) {
        this.y = y;
    }

    public double getAngle() {
        return angle;
    }

    public void setAngle(double angle) {
        this.angle = angle;
    }

    public String getSid() {
        return sid;
    }

    public void setSid(String sid) {
        this.sid = sid;
    }

    public Integer getMaxp() {
        return maxp;
    }

    public void setMaxp(Integer maxp) {
        this.maxp = maxp;
    }

    public Integer getMinp() {
        return minp;
    }

    public void setMinp(Integer minp) {
        this.minp = minp;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
