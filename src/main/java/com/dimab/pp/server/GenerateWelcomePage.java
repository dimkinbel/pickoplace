package com.dimab.pp.server;

import com.dimab.pickoplace.json.GsonUtils;
import com.dimab.pp.database.GetPlaceInfoFactory;
import com.dimab.pp.dto.PlaceInfo;
import com.dimab.pp.dto.WelcomePageData;
import com.google.appengine.api.datastore.*;
import com.google.appengine.api.datastore.Query.SortDirection;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;


public class GenerateWelcomePage extends HttpServlet {
    private String lastCursor = "";

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        String lastCursor = request.getParameter("cursor");
        String num = request.getParameter("num");
        Integer numInt = Integer.parseInt(num);
        if (lastCursor == null || lastCursor.isEmpty()) {
            lastCursor = "";
        } else {
            System.out.println("Cursor to POST:" + lastCursor);
        }

        System.out.println(request.getLocale());
        GetPlaceInfoFactory placeInfoFactory = new GetPlaceInfoFactory();
        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        WelcomePageData welcomePagedata = new WelcomePageData();

        QueryResultList<Entity> CanvasStateEntities = getNEntities(numInt, lastCursor);
        for (Entity csEntity : CanvasStateEntities) {
            PlaceInfo placeInfo = placeInfoFactory.getPlaceInfo(datastore, csEntity, 222);
            welcomePagedata.getPlaces().add(placeInfo);
        }

        welcomePagedata.setCursor(this.lastCursor);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(GsonUtils.toJson(welcomePagedata));
    }

    QueryResultList<Entity> getNEntities(int n, String cursor) {

        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        System.out.println("CURSOR:" + cursor);
        FetchOptions fetchOptions = FetchOptions.Builder.withLimit(n);
        if (cursor != null && !cursor.isEmpty()) {
            System.out.println("CURSOR USED");
            fetchOptions.startCursor(Cursor.fromWebSafeString(cursor));
        }

        Query q = new Query("CanvasState")
                .addSort("DateUpdatedSec", SortDirection.DESCENDING);

        PreparedQuery pq = datastore.prepare(q);
        QueryResultList<Entity> results = pq.asQueryResultList(fetchOptions);

        if (results.getCursor() == null) {
            this.lastCursor = null;
        } else {
            this.lastCursor = results.getCursor().toWebSafeString();
            System.out.println("UPDATED CURSOR:" + results.getCursor().toWebSafeString());
        }
        return results;
    }
}
