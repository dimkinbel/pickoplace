package com.dimab.pp.search;

import com.dimab.pickoplace.json.GsonUtils;
import com.dimab.pp.database.FreePlaceFactory;
import com.dimab.pp.database.GetPlaceInfoFactory;
import com.dimab.pp.dto.*;
import com.google.appengine.api.datastore.*;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.gson.reflect.TypeToken;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class SearchWizardServlet extends HttpServlet {

    private String lastCursor = "";

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String name = request.getParameter("name");
        String lats = request.getParameter("lat");
        String lngs = request.getParameter("lng");
        String rads = request.getParameter("rad");
        String dateUTCsecondsS = request.getParameter("dateUTCseconds");
        String timeSecondsS = request.getParameter("timeSeconds");
        String personsS = request.getParameter("persons");
        String cursor_ = request.getParameter("cursor");
        String typeS = request.getParameter("type");
        String weekDayS = request.getParameter("weekDay");
        String subTypeS = request.getParameter("subType");
        String periodS = request.getParameter("period");
        String ratingS = request.getParameter("rating");
        String amounts = request.getParameter("amount");

        Map<String, Object> map = new HashMap<String, Object>();
        if (name == null || lats == null || lngs == null || rads == null) {
            map.put("status", "requestError");
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(GsonUtils.toJson(map));
            return;
        }
        System.out.println(name + " " + lats + " " + lngs + " " + rads);
        Double lat = Double.parseDouble(lats);
        Double lng = Double.parseDouble(lngs);
        Integer rad = Integer.parseInt(rads);
        Integer weekDay = Integer.parseInt(weekDayS);
        Integer amount = Integer.parseInt(amounts);
        Integer dateUTCseconds = Integer.parseInt(dateUTCsecondsS);
        Integer timeSeconds = Integer.parseInt(timeSecondsS);
        Integer period = Integer.parseInt(periodS);
        Integer persons = Integer.parseInt(personsS);
        Double rating = Double.parseDouble(ratingS);

        SearchRequestWizJSON serachObjectWiz = new SearchRequestWizJSON();
        serachObjectWiz.getSerachRequest().setName(name);
        serachObjectWiz.getSerachRequest().setLat(lat);
        serachObjectWiz.getSerachRequest().setLng(lng);
        serachObjectWiz.getSerachRequest().setRadius(rad);
        serachObjectWiz.setWeekDay(weekDay);
        serachObjectWiz.setDateUTC(dateUTCseconds);
        serachObjectWiz.setTime(timeSeconds);
        serachObjectWiz.setPersons(persons);
        serachObjectWiz.setPeriodSeconds(period);
        serachObjectWiz.setRating(rating);

        SearchPidsAndCursor searchResult = new SearchPidsAndCursor();
        SearchPidsAndCursor reducedResult = new SearchPidsAndCursor();
        boolean initial = false;
        if (cursor_ == null || cursor_.isEmpty()) {
            cursor_ = "";
            SearchFabric searchIndexFabrix = new SearchFabric();
            searchResult = searchIndexFabrix.getPlacesBySearchObjectWizSortByRating(serachObjectWiz);
            initial = true;

        } else {
            Type collectionType = new TypeToken<SearchPidsAndCursor>() {
            }.getType();
            searchResult = GsonUtils.fromJson(cursor_, collectionType);
        }
        reducedResult.setCursor(searchResult.getCursor());
        System.out.println(searchResult.getPids());

        WizResultData wizResultData = new WizResultData();
        Integer foundPlaces = 0;
        if (searchResult.getPids().size() == 0) {
            map.put("status", "NO_SEARCH_FOUND");
            if (initial) {
                wizResultData.setCursor("");
            } else {
                wizResultData.setCursor("last");
            }

        } else {
            GetPlaceInfoFactory placeInfoFactory = new GetPlaceInfoFactory();
            DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

            FreePlaceFactory freeFactory = new FreePlaceFactory();
            for (String pidByNameAndLocation : searchResult.getPids()) {
                if (foundPlaces >= amount) {
                    // Add to reduced list
                    reducedResult.getPids().add(pidByNameAndLocation);
                } else {
                    Filter pidFilter = new FilterPredicate("placeUniqID", FilterOperator.EQUAL, pidByNameAndLocation);
                    Query q = new Query("CanvasState").setFilter(pidFilter);
                    PreparedQuery pq = datastore.prepare(q);
                    if (pq.asSingleEntity() != null) {
                        Entity csEntity = pq.asSingleEntity();
                        if (!isPlaceOpenCurrently(csEntity, serachObjectWiz)) {
                            System.out.println("Time Passed at Place");
                        } else if (!isPlaceOpen(csEntity, serachObjectWiz)) {
                            System.out.println("Place closed");
                        } else {
                            List<FreePlaceOption> freeOptions = freeFactory.listFreeOptionsGCS(datastore, csEntity, serachObjectWiz);

                            for (FreePlaceOption op : freeOptions) {
                                System.out.println("Persons:" + op.getPersons() + ",Count:" + op.getCount());
                            }
                            if (!freeOptions.isEmpty()) {
                                PlaceInfo placeInfo = placeInfoFactory.getPlaceInfo(datastore, csEntity, 222);
                                FreePlaceInfo freePlaceInfo = new FreePlaceInfo();
                                freePlaceInfo.setFreeOptions(freeOptions);
                                freePlaceInfo.setPlaceInfo(placeInfo);
                                wizResultData.getPlaces().add(freePlaceInfo);
                                foundPlaces += 1;
                            }
                        }
                    }
                }
            }
        }

        if (wizResultData.getPlaces().size() >= 1) {
            if (reducedResult.getPids().size() == 0) {
                wizResultData.setCursor("last");
            } else {
                wizResultData.setCursor(GsonUtils.toJson(reducedResult));
            }

            map.put("status", "OK");
            map.put("freePlaces", wizResultData);
        } else {
            map.put("status", "NO_EMPTY_FOUND");
            if (initial) {
                wizResultData.setCursor("");
            } else {
                wizResultData.setCursor("last");
            }
        }

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(GsonUtils.toJson(map));
    }

    public Boolean isPlaceOpenCurrently(Entity CanvasStateEntity, SearchRequestWizJSON serachObjectWiz) {
        double UTCoffcet = 0;
        if (CanvasStateEntity.getProperty("UTCoffcet") == null) {
            UTCoffcet = (double) 0;
        } else {
            UTCoffcet = (double) CanvasStateEntity.getProperty("UTCoffcet");

        }
        Double placeUTCoffset = new Double(UTCoffcet);
        Double placeUTCoffsetSeconds = placeUTCoffset * 3600;
        Date date = new Date();
        Long currentUTCSeconds = date.getTime() / 1000;
        Integer currentPlaceSeconds = currentUTCSeconds.intValue() + placeUTCoffsetSeconds.intValue();
        Date currentTimeAtPlace = new Date(currentPlaceSeconds.longValue() * 1000L);
        if (currentPlaceSeconds > serachObjectWiz.getDateUTC() + serachObjectWiz.getTime()) {
            System.out.println("Time at (" + (String) CanvasStateEntity.getProperty("address") + "):" + currentTimeAtPlace);
            return false;
        }
        return true;
    }

    public Boolean isPlaceOpen(Entity CanvasStateEntity, SearchRequestWizJSON serachObjectWiz) {
        Integer weekday = serachObjectWiz.getWeekDay();
        String closeDatesString = (String) CanvasStateEntity.getProperty("closeDates");
        Type closeDateType = new TypeToken<List<Integer>>() {
        }.getType();
        List<Integer> closeDates = GsonUtils.fromJson(closeDatesString, closeDateType);
        // Check for dates the place is close (set by Administrator)
        if (closeDates.contains(serachObjectWiz.getDateUTC())) {
            return false;
        } else if (serachObjectWiz.getTime() + serachObjectWiz.getPeriodSeconds() > 86400) {
            if (closeDates.contains(serachObjectWiz.getDateUTC() + 86400)) {
                return false;
            }
        }
        String weekdays = (String) CanvasStateEntity.getProperty("workinghours");
        WorkingWeek weekdaysObject = GsonUtils.fromJson(weekdays, WorkingWeek.class);
        WeekDayOpenClose today, tomorrow;
        if (weekday < 6) {
            today = weekdaysObject.getWeekDayOpenClose(weekday);
            tomorrow = weekdaysObject.getWeekDayOpenClose(weekday + 1);
        } else {
            today = weekdaysObject.getWeekDayOpenClose(weekday);
            tomorrow = weekdaysObject.getWeekDayOpenClose(0);
        }

        if (!today.isOpen()) {
            return false;
        } else if (serachObjectWiz.getTime() + serachObjectWiz.getPeriodSeconds() > 86400) {
            if (!tomorrow.isOpen()) {
                return false;
            }
        }

        if (today.isOpen()) {
            if (serachObjectWiz.getTime() + serachObjectWiz.getPeriodSeconds() > 86400) {
                // Search both days
                if (today.getTo() - 86400 < tomorrow.getFrom()) {
                    // Gap between today and tomorrow
                    if (serachObjectWiz.getTime() + serachObjectWiz.getPeriodSeconds() > today.getTo()) {
                        return false;
                    } else {
                        // Search today only
                        Integer openFrom = today.getFrom();
                        Integer close = today.getTo();
                        if (serachObjectWiz.getTime() >= openFrom && serachObjectWiz.getTime() <= close &&
                                serachObjectWiz.getTime() + serachObjectWiz.getPeriodSeconds() >= openFrom &&
                                serachObjectWiz.getTime() + serachObjectWiz.getPeriodSeconds() <= close) {

                        } else {
                            return false;
                        }
                    }
                } else {
                    Integer openFrom = today.getFrom();
                    Integer close = 86400 + tomorrow.getTo();
                    if (serachObjectWiz.getTime() >= openFrom && serachObjectWiz.getTime() <= close &&
                            serachObjectWiz.getTime() + serachObjectWiz.getPeriodSeconds() >= openFrom &&
                            serachObjectWiz.getTime() + serachObjectWiz.getPeriodSeconds() <= close) {

                    } else {
                        return false;
                    }
                }
            } else {
                // Search today only
                Integer openFrom = today.getFrom();
                Integer close = today.getTo();
                if (serachObjectWiz.getTime() >= openFrom && serachObjectWiz.getTime() <= close &&
                        serachObjectWiz.getTime() + serachObjectWiz.getPeriodSeconds() >= openFrom &&
                        serachObjectWiz.getTime() + serachObjectWiz.getPeriodSeconds() <= close) {

                } else {
                    return false;
                }
            }
        }

        return true;
    }

    QueryResultList<Entity> getNEntities(DatastoreService datastore, int n, String cursor, Filter wizFilter) {


        FetchOptions fetchOptions = FetchOptions.Builder.withLimit(n);
        if (cursor != null && !cursor.isEmpty()) {
            fetchOptions.startCursor(Cursor.fromWebSafeString(cursor));
        }

        Query q = new Query("CanvasState").setFilter(wizFilter)
                .addSort("TotalRating", SortDirection.DESCENDING);

        PreparedQuery pq = datastore.prepare(q);
        QueryResultList<Entity> results = pq.asQueryResultList(fetchOptions);
        if (results.getCursor() == null) {
            this.lastCursor = "last";
        } else {
            this.lastCursor = results.getCursor().toWebSafeString();
        }

        return results;
    }
}
