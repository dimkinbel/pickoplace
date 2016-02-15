package com.dimab.pp.dto;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class ShapesMapObject {
    Map<String, ShapePersons> shapesMap = new HashMap<String, ShapePersons>();
    Map<Integer, List<String>> personsMax = new HashMap<Integer, List<String>>();
    Map<Integer, List<String>> personsMin = new HashMap<Integer, List<String>>();
    Map<Integer, List<String>> personsAllowed = new HashMap<Integer, List<String>>();

    public Map<String, ShapePersons> getShapesMap() {
        return shapesMap;
    }

    public void setShapesMap(Map<String, ShapePersons> shapesMap) {
        this.shapesMap = shapesMap;
    }

    public void printString() {
        System.out.println("SHAPES MAP__________________");
        for (String personsSingleKey : shapesMap.keySet()) {
            System.out.println(personsSingleKey + ":" + shapesMap.get(personsSingleKey).getMin() + "-" + shapesMap.get(personsSingleKey).getMax());
        }
        System.out.println("personsMax___________________");
        for (Integer personsSingleKey : personsMax.keySet()) {
            System.out.println(personsSingleKey + ":" + personsMax.get(personsSingleKey));
        }
        System.out.println("personsMin___________________");
        for (Integer personsSingleKey : personsMin.keySet()) {
            System.out.println(personsSingleKey + ":" + personsMin.get(personsSingleKey));
        }
        System.out.println("personsAllowed___________________");
        for (Integer personsSingleKey : personsAllowed.keySet()) {
            System.out.println(personsSingleKey + ":" + personsAllowed.get(personsSingleKey));
        }
    }

    public Map<Integer, List<String>> getPersonsMax() {
        return personsMax;
    }

    public void setPersonsMax(Map<Integer, List<String>> personsMax) {
        this.personsMax = personsMax;
    }

    public Map<Integer, List<String>> getPersonsMin() {
        return personsMin;
    }

    public void setPersonsMin(Map<Integer, List<String>> personsMin) {
        this.personsMin = personsMin;
    }

    public Map<Integer, List<String>> getPersonsAllowed() {
        return personsAllowed;
    }

    public List<String> getPersonsAllowed(Integer persons) {
        if (this.personsAllowed.containsKey(persons)) {
            return this.personsAllowed.get(persons);
        } else {
            return null;
        }
    }

    public void setPersonsAllowed(Map<Integer, List<String>> personsAllowed) {
        this.personsAllowed = personsAllowed;
    }

}
