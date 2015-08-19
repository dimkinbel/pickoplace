package com.dimab.pp.search;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import com.dimab.pp.dto.PlaceNameAddressSearch;
import com.dimab.pp.dto.SearchRequestJSON;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.search.Document;
import com.google.appengine.api.search.Field;
import com.google.appengine.api.search.GeoPoint;
import com.google.appengine.api.search.Index;
import com.google.appengine.api.search.IndexSpec;
import com.google.appengine.api.search.PutException;
import com.google.appengine.api.search.Results;
import com.google.appengine.api.search.ScoredDocument;
import com.google.appengine.api.search.SearchException;
import com.google.appengine.api.search.SearchServiceFactory;
import com.google.appengine.api.search.StatusCode;

public class SearchFabric {
   public void CreatePlaceDocument(Entity canvasState) {

			String placeID = (String) canvasState.getProperty("placeUniqID");
			String placeName = (String) canvasState.getProperty("placeName");
			String placeBranchName = (String)  canvasState.getProperty("placeBranchName");
			String latString = (String)  canvasState.getProperty("lat");
			String lngString = (String)  canvasState.getProperty("lng");
			String address = (String)  canvasState.getProperty("address");
			double lat = Double.parseDouble(latString);
			double lng = Double.parseDouble(lngString);
			GeoPoint geoPoint = new GeoPoint(lat,lng);
			
			String searchCombination = "";
			String temp = "";
			for (int i = 0; i < placeName.length(); i++){
			    char c = placeName.charAt(i);        
			    if(i<2) {
			    	temp+=c;
			    } else {
			    	temp+=c;
			    	searchCombination= searchCombination + temp + " ";
			    }
			}
			temp = "";
			for (int i = 0; i < placeBranchName.length(); i++){
			    char c = placeBranchName.charAt(i);        
			    if(i<2) {
			    	temp+=c;
			    } else {
			    	temp+=c;
			    	searchCombination= searchCombination + temp + " ";
			    }
			}
			
			
			Document doc = Document.newBuilder()
					.setId(placeID) // Setting the document identifer is optional. If omitted, the search service will create an identifier.
				    .addField(Field.newBuilder().setName("PlaceName").setText(placeName))
				    .addField(Field.newBuilder().setName("branch").setText(placeBranchName))
				    .addField(Field.newBuilder().setName("NameCombinations").setText(searchCombination))
				    .addField(Field.newBuilder().setName("location").setGeoPoint(geoPoint))
				    .build();
			
		    IndexSpec indexSpec = IndexSpec.newBuilder().setName("Places").build(); 
		    Index index = SearchServiceFactory.getSearchService().getIndex(indexSpec);
		    
		    try {
		        index.put(doc);
		    } catch (PutException e) {
		        if (StatusCode.TRANSIENT_ERROR.equals(e.getOperationResult().getCode())) {
		            // retry putting the document
		        }
		    }
			Document docName = Document.newBuilder()
					.setId(placeID+"_name") // Setting the document identifer is optional. If omitted, the search service will create an identifier.
				    .addField(Field.newBuilder().setName("PlaceName").setText(placeName))
				    .addField(Field.newBuilder().setName("branch").setText(placeBranchName))
				    .addField(Field.newBuilder().setName("NameCombinations").setText(searchCombination))
				    .addField(Field.newBuilder().setName("address").setText(address))
				    .build();
			
		    IndexSpec indexSpecName = IndexSpec.newBuilder().setName("PlaceNames").build(); 
		    Index indexName = SearchServiceFactory.getSearchService().getIndex(indexSpecName);
		    
		    try {
		    	indexName.put(docName);
		    } catch (PutException e) {
		        if (StatusCode.TRANSIENT_ERROR.equals(e.getOperationResult().getCode())) {
		            // retry putting the document
		        }
		    }
   }
   
   public void deletePlaceDocument(String id) {
	    List<String> ids = new ArrayList<String>();
	    ids.add(id);
	    ids.add(id+"_name");
	    
	    IndexSpec indexSpec = IndexSpec.newBuilder().setName("Places").build(); 
	    Index index = SearchServiceFactory.getSearchService().getIndex(indexSpec);
	    index.delete(ids);
	    
	    IndexSpec indexSpecName = IndexSpec.newBuilder().setName("PlaceNames").build(); 
	    Index indexName = SearchServiceFactory.getSearchService().getIndex(indexSpecName);
	    indexName.delete(ids);
	    
   }
   public List<PlaceNameAddressSearch> getPlaceNames(String search_query) {
	   List<PlaceNameAddressSearch> names = new ArrayList<PlaceNameAddressSearch>();
	   IndexSpec indexSpecName = IndexSpec.newBuilder().setName("PlaceNames").build(); 
	   Index indexName = SearchServiceFactory.getSearchService().getIndex(indexSpecName);
	   try {
		    Results<ScoredDocument> result = indexName.search("NameCombinations = "+search_query);

		    for (ScoredDocument doc : result) {
		    	PlaceNameAddressSearch place_ = new PlaceNameAddressSearch();
		    	place_.setName(doc.getOnlyField("PlaceName").getText());
		    	place_.setBranch(doc.getOnlyField("branch").getText());
		    	place_.setAddress(doc.getOnlyField("address").getText());
		    	names.add(place_);
		    }
		} catch (SearchException e) {
			System.out.println(e);
		    // handle exception...
			 return null;
		}
	   return names;
   }
   
   public List<String> getPlacesBySearchObject(SearchRequestJSON search) {
	   List<String> pids = new ArrayList<String>();
	   IndexSpec indexSpec = IndexSpec.newBuilder().setName("Places").build(); 
	   Index index = SearchServiceFactory.getSearchService().getIndex(indexSpec);
	   
	   String query = "";
	   Integer radius = Math.round((float)(search.getRadius() * 0.8));

	   if(search.getName()==null || search.getName().length()<3) {
			   query = "distance(location, geopoint("+search.getLat()+", "+search.getLng()+")) < "+radius;	   
	   } else {
		       query = "distance(location, geopoint("+search.getLat()+", "+search.getLng()+")) < "+radius;
		       query += " AND NameCombinations = "+search.getName();
	   }
	   System.out.println("Search Query:"+query);
	   
	   Results<ScoredDocument> result;   
	   try {
		   result = index.search(query);
		   for (ScoredDocument doc : result) {
			   pids.add(doc.getId());
		    }
	   } catch (SearchException e) {
			System.out.println(e);
		    // handle exception...
			return null;
		}
	   return pids;
   }
}
