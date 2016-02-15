package com.dimab.pp.server;

import com.dimab.pickoplace.entity.EntityKind;
import com.dimab.pp.functions.RandomStringGenerator;
import com.dimab.pp.login.CheckTokenValid;
import com.dimab.pp.login.GenericUser;
import com.google.appengine.api.datastore.*;
import com.google.appengine.api.datastore.Query.CompositeFilterOperator;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.Date;


public class CreatePlaceInfo extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        TransactionOptions options = TransactionOptions.Builder.withXG(true);
        Transaction txn = datastore.beginTransaction(options);
        HttpSession session = request.getSession();

        String username = new String();
        CheckTokenValid tokenValid = new CheckTokenValid(request);
        GenericUser genuser = tokenValid.getUser();
        System.out.println("Session:" + session.getId());
        if (genuser != null) {
            username = genuser.getEmail();
            String placeName = request.getParameter("buisnessName");
            String placeBranchName = request.getParameter("branchName");
            String placeAddress = request.getParameter("buisnessAddress");
            String placeLat = request.getParameter("address_hidden_lat");
            String placeLng = request.getParameter("address_hidden_lng");
            String placePhone = request.getParameter("buisnessPhone");
            String placeFax = request.getParameter("buisnessFax");
            //Long time2000 = Long.valueOf(request.getParameter("timeat2000_hidden"));
            Double UTCoffcet = Double.valueOf(request.getParameter("UTCoffcet_hidden"));
            String TimeZoneID = request.getParameter("timeZoneId");
            GeoPt center = new GeoPt(Float.valueOf(placeLat), Float.valueOf(placeLng));

            RandomStringGenerator randomGen = new RandomStringGenerator();
            String Placerandom = "PID_" + randomGen.generateRandomString(12, RandomStringGenerator.Mode.ALPHANUMERIC);

            Filter UserExists = new FilterPredicate("username", FilterOperator.EQUAL, username);
            Query q = new Query(EntityKind.Users).setFilter(UserExists);
            PreparedQuery pq = datastore.prepare(q);
            Entity result = pq.asSingleEntity();
            if (result != null) {
                Key userKey = result.getKey();
                Filter UserPlaceFilterAddress = new FilterPredicate("placeAddress", FilterOperator.EQUAL, placeAddress);
                Filter UserPlaceFilterName = new FilterPredicate("placeName", FilterOperator.EQUAL, placeName);
                Filter UserPlaceFilterBranch = new FilterPredicate("placeBranchName", FilterOperator.EQUAL, placeBranchName);
                Filter UserPlaceLat = new FilterPredicate("placeLat", FilterOperator.EQUAL, Double.parseDouble(placeLat));
                Filter UserPlaceLng = new FilterPredicate("placeLng", FilterOperator.EQUAL, Double.parseDouble(placeLng));

                Filter composeFilter = CompositeFilterOperator.and(UserPlaceFilterAddress,
                        UserPlaceFilterName,
                        UserPlaceFilterBranch,
                        UserPlaceLat,
                        UserPlaceLng);
                Query qup = new Query("UserPlace").setFilter(composeFilter);
                PreparedQuery pqup = datastore.prepare(qup);
                Entity userPlace = pqup.asSingleEntity();

                System.out.println(placeAddress + " " + placeName + " " + placeBranchName + " " + placeLat + " " + placeLng);
                System.out.println(userPlace);
                if (userPlace == null) {
                    userPlace = new Entity("UserPlace", userKey);
                    String entityKey = KeyFactory.keyToString(userKey);
                    userPlace.setProperty("userKey", entityKey);

                    userPlace.setProperty("placeName", placeName);
                    userPlace.setProperty("placeBranchName", placeBranchName);
                    userPlace.setProperty("placeAddress", placeAddress);
                    userPlace.setProperty("placeUniqID", Placerandom);
                    userPlace.setProperty("sessionSaved", session.getId());
                    //userPlace.setProperty("TimeAt2000", time2000);
                    userPlace.setProperty("UTCoffcet", UTCoffcet);
                    userPlace.setProperty("TimeZoneID", TimeZoneID);


                    if (placeLat != null && !placeLat.isEmpty()) {
                        userPlace.setProperty("placeLat", Double.parseDouble(placeLat));
                        userPlace.setProperty("placeLng", Double.parseDouble(placeLng));
                        userPlace.setProperty("location", center);
                    } else {
                        userPlace.setProperty("placeLat", null);
                        userPlace.setProperty("placeLng", null);
                    }
                    userPlace.setUnindexedProperty("placePhone", placePhone);
                    userPlace.setUnindexedProperty("placeFax", placeFax);

                    Date date = new Date();
                    result.setUnindexedProperty("lastDateInSec", date.getTime() / 1000);
                    result.setUnindexedProperty("lastDate", date.toString());
                    Key userPlaceKey = datastore.put(userPlace);
                    datastore.put(result);


                    // Create canvasStates and ImageVersions
                    Entity imageVersionEntity;
                    Entity canvasState;
                    try {
                        Key pidKey = KeyFactory.createKey("ImageVersion", Placerandom);
                        imageVersionEntity = datastore.get(pidKey);
                        // TBD Place exists
                        String returnurl = "/welcome.jsp";
                        response.addHeader("Access-Control-Allow-Origin", "*");
                        response.sendRedirect(returnurl);
                        return;
                    } catch (EntityNotFoundException e) {
                        imageVersionEntity = new Entity("ImageVersion", Placerandom);
                        imageVersionEntity.setProperty("PID", Placerandom);
                        datastore.put(imageVersionEntity);
                    }
                    try {
                        Key pidKey = KeyFactory.createKey(userPlaceKey, "CanvasState", Placerandom);
                        canvasState = datastore.get(pidKey);
                        // TBD Place exists
                        String returnurl = "/welcome.jsp";
                        response.addHeader("Access-Control-Allow-Origin", "*");
                        response.sendRedirect(returnurl);
                        return;
                    } catch (EntityNotFoundException e) {
                        canvasState = new Entity("CanvasState", Placerandom, userPlaceKey);
                        canvasState.setProperty("placeUniqID", Placerandom);
                        datastore.put(canvasState);
                    }
                    txn.commit();
                } else {
                    //-------------------------------
                    // UserPlace exists
                    //-------------------------------

                    String savedSession = (String) userPlace.getProperty("sessionSaved");
                    String savedUser = (String) userPlace.getProperty("userKey");

                    if (savedUser.equals(KeyFactory.keyToString(userKey))) {
                        // Same user
                        Date date = new Date();
                        result.setUnindexedProperty("lastDateInSec", date.getTime() / 1000);
                        result.setUnindexedProperty("lastDate", date.toString());
                        datastore.put(result);
                        txn.commit();
                        Placerandom = (String) userPlace.getProperty("placeUniqID");

                        if (session.getId().equals(savedSession)) {
                            // Same session
                            if (userPlace.getProperty("mainFloorID") == null) {
                                // No SAVE applied yet (reload)
                                // Regular behavior

                            } else {
                                request.setAttribute("pid", Placerandom);
                                RequestDispatcher dispathser = request.getRequestDispatcher("/proceedToEdit.jsp");
                                dispathser.forward(request, response);
                                return;
                            }
                        } else {
                            // Other session - same User
                            userPlace.setProperty("sessionSaved", session.getId());
                            if (userPlace.getProperty("mainFloorID") == null) {
                                // No SAVE applied yet (reload)
                                // Regular behavior

                            } else {
                                request.setAttribute("pid", Placerandom);
                                RequestDispatcher dispathser = request.getRequestDispatcher("/proceedToEdit.jsp");
                                dispathser.forward(request, response);
                                return;
                            }
                        }
                    } else {
                        System.out.println("ERROR:Place exists.Different User");
                        String returnurl = "/welcome.jsp";
                        response.addHeader("Access-Control-Allow-Origin", "*");
                        response.sendRedirect(returnurl);
                        return;
                    }

                }


                TimeZoneService timezoneService = new TimeZoneService();
                timezoneService.updateTimeZonePID(TimeZoneID, UTCoffcet, Placerandom, Double.parseDouble(placeLat), Double.parseDouble(placeLng));

            } else {
                // TBD : Create User Entity
                System.out.println("ERROR:No user exists");
                String returnurl = "/welcome.jsp";
                response.addHeader("Access-Control-Allow-Origin", "*");
                response.sendRedirect(returnurl);
                return;
            }


            request.setAttribute("creatingFlow", "true");
            request.setAttribute("placeName", placeName);
            request.setAttribute("placeBranchName", placeBranchName);
            request.setAttribute("placeAddress", placeAddress);
            request.setAttribute("placeUniqID", Placerandom);


            if (placeLat != null && !placeLat.isEmpty()) {
                request.setAttribute("placeLat", Double.parseDouble(placeLat));
                request.setAttribute("placeLng", Double.parseDouble(placeLng));
            }
            RequestDispatcher dispathser = request.getRequestDispatcher("/drawing.jsp");
            dispathser.forward(request, response);

        } else {
            System.out.println("ERROR:No user connection exists");
            String returnurl = "/welcome.jsp";
            response.addHeader("Access-Control-Allow-Origin", "*");
            response.sendRedirect(returnurl);
            return;
        }
    }
}


