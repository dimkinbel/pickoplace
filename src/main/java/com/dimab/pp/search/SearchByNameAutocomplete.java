package com.dimab.pp.search;

import com.dimab.pickoplace.utils.ServletUtils;
import com.dimab.pp.dto.PlaceNameAddressSearch;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class SearchByNameAutocomplete extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String name = request.getParameter("name");
        SearchFabric searchIndexFabrix = new SearchFabric();
        Map<String, Object> map = new HashMap<String, Object>();
        List<PlaceNameAddressSearch> placeNames = searchIndexFabrix.getPlaceNames(name);
        if (placeNames == null) {
            map.put("status", "SearchError");
        } else if (placeNames.size() == 0) {
            map.put("status", "zeroResults");
        } else {
            map.put("status", "OK");
            map.put("places", placeNames);
        }

        ServletUtils.writeJsonResponse(response, map);
    }
}
