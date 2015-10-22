package com.dimab.pp.search;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import com.dimab.pp.dto.PlaceNameAddressSearch;
import com.dimab.pp.dto.SearchPidsAndCursor;
import com.dimab.pp.dto.SearchRequestJSON;
import com.dimab.pp.dto.SearchRequestWizJSON;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.search.Document;
import com.google.appengine.api.search.Field;
import com.google.appengine.api.search.GeoPoint;
import com.google.appengine.api.search.GetRequest;
import com.google.appengine.api.search.GetResponse;
import com.google.appengine.api.search.Index;
import com.google.appengine.api.search.IndexSpec;
import com.google.appengine.api.search.PutException;
import com.google.appengine.api.search.Query;
import com.google.appengine.api.search.QueryOptions;
import com.google.appengine.api.search.Results;
import com.google.appengine.api.search.ScoredDocument;
import com.google.appengine.api.search.SearchException;
import com.google.appengine.api.search.SearchServiceFactory;
import com.google.appengine.api.search.SortExpression;
import com.google.appengine.api.search.SortOptions;
import com.google.appengine.api.search.StatusCode;

public class SearchFabric {
   public void CreatePlaceDocument(Entity canvasState) {

			String placeID = (String) canvasState.getProperty("placeUniqID");
			String placeName = (String) canvasState.getProperty("placeName");
			String placeBranchName = (String)  canvasState.getProperty("placeBranchName");
			String latString = (String)  canvasState.getProperty("lat");
			String lngString = (String)  canvasState.getProperty("lng");
			String address = (String)  canvasState.getProperty("address");
			double rating = (double) canvasState.getProperty("TotalRating");
			List<String> typesList = (ArrayList<String>) canvasState.getProperty("PlaceType");
			List<String> subtypesList = (ArrayList<String>) canvasState.getProperty("PlaceSubType");
			String types = "";
			for(String type : typesList) {
				types = types + type + " ";
			}
			String subtypes = "";
			for(String type : subtypesList) {
				subtypes = subtypes + type + " ";
			}
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
			    	searchCombination= searchCombination + temp.toLowerCase() + " ";
			    }
			}
			temp = "";
			for (int i = 0; i < placeBranchName.length(); i++){
			    char c = placeBranchName.charAt(i);        
			    if(i<2) {
			    	temp+=c;
			    } else {
			    	temp+=c;
			    	searchCombination= searchCombination + temp.toLowerCase() + " ";
			    }
			}
			
			
			Document doc = Document.newBuilder()
					.setId(placeID) // Setting the document identifer is optional. If omitted, the search service will create an identifier.
				    .addField(Field.newBuilder().setName("PlaceName").setText(placeName))
				    .addField(Field.newBuilder().setName("branch").setText(placeBranchName))
				    .addField(Field.newBuilder().setName("NameCombinations").setText(searchCombination))
				    .addField(Field.newBuilder().setName("location").setGeoPoint(geoPoint))
				    .addField(Field.newBuilder().setName("rating").setNumber(0.0))
				    .addField(Field.newBuilder().setName("type").setText(types))
				    .addField(Field.newBuilder().setName("subtype").setText(subtypes))
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
   public void updateRating(String pid , Double rating_) {
	   IndexSpec indexSpec = IndexSpec.newBuilder().setName("Places").build(); 
	   Index index = SearchServiceFactory.getSearchService().getIndex(indexSpec);
	       
	   // Fetch a single document by its  doc_id
	   Document doc = index.get(pid);
	   String placeName = doc.getOnlyField("PlaceName").getText();
	   String placeBranchName =  doc.getOnlyField("branch").getText();
	   String searchCombination =  doc.getOnlyField("NameCombinations").getText();
	   GeoPoint geoPoint =  doc.getOnlyField("location").getGeoPoint();
	   Double rating = rating_;
	   String types =  doc.getOnlyField("type").getText();
	   String subtypes =  doc.getOnlyField("subtype").getText();
	   
	   Document docout = Document.newBuilder()
		.setId(pid) // Setting the document identifer is optional. If omitted, the search service will create an identifier.
	    .addField(Field.newBuilder().setName("PlaceName").setText(placeName))
	    .addField(Field.newBuilder().setName("branch").setText(placeBranchName))
	    .addField(Field.newBuilder().setName("NameCombinations").setText(searchCombination))
	    .addField(Field.newBuilder().setName("location").setGeoPoint(geoPoint))
	    .addField(Field.newBuilder().setName("rating").setNumber(rating))
	    .addField(Field.newBuilder().setName("type").setText(types))
	    .addField(Field.newBuilder().setName("subtype").setText(subtypes))
	    .build();
	   
	    try {
	        index.put(docout);
	    } catch (PutException e) {
	        if (StatusCode.TRANSIENT_ERROR.equals(e.getOperationResult().getCode())) {
	            // retry putting the document
	        }
	    }
   }
   public void deleteAll() {
	    List<String> ids = new ArrayList<String>();
	    IndexSpec indexSpec = IndexSpec.newBuilder().setName("Places").build(); 
	    Index index = SearchServiceFactory.getSearchService().getIndex(indexSpec);

	    
	    GetResponse<Document> docs = index.getRange(GetRequest.newBuilder().setLimit(1000).build());
	    for(Document doc:docs) {
	    	System.out.println("DELETE:"+doc.getId());
	    	ids.add(doc.getId());
	    }
	    index.delete(ids);
	    ids = new ArrayList<String>();
	    IndexSpec indexSpecName = IndexSpec.newBuilder().setName("PlaceNames").build(); 
	    Index indexName = SearchServiceFactory.getSearchService().getIndex(indexSpecName);
	    docs = indexName.getRange(GetRequest.newBuilder().setLimit(1000).build());
	    
	    for(Document doc:docs) {
	    	System.out.println("DELETE Name:"+doc.getId());
	    	ids.add(doc.getId());
	    }
	    indexName.delete(ids);
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
   
   public SearchPidsAndCursor getPlacesBySearchObject(SearchRequestJSON search) {
	   SearchPidsAndCursor searchResponse = new SearchPidsAndCursor();
	   List<String> pids = new ArrayList<String>();
	   IndexSpec indexSpec = IndexSpec.newBuilder().setName("Places").build(); 
	   Index index = SearchServiceFactory.getSearchService().getIndex(indexSpec);
	   
	   String squery = "";
	   Integer radius = Math.round((float)(search.getRadius() * 0.8));

	   if(search.getName()==null || search.getName().length()<3) {
		   squery = "distance(location, geopoint("+search.getLat()+", "+search.getLng()+")) < "+radius;	   
	   } else {
		   squery = "distance(location, geopoint("+search.getLat()+", "+search.getLng()+")) < "+radius;
		   squery += " AND NameCombinations = "+search.getName();
	   }
	   
	   SortOptions sortOptions = SortOptions.newBuilder()
		        .addSortExpression(SortExpression.newBuilder()
		            .setExpression("distance(location, geopoint("+search.getLat()+", "+search.getLng()+"))")
		            .setDirection(SortExpression.SortDirection.ASCENDING)
		            .setDefaultValueNumeric(0))
		        .setLimit(1000)
		        .build();
	   Integer searchLimit;
	   QueryOptions options ;
	   if(search.getSearchLimit()==-1) {
		   options = QueryOptions.newBuilder()
				    .setLimit(100)
			        .setFieldsToReturn("ID") 
			        .build();
	   } else {
		   searchLimit = search.getSearchLimit();
		   options = QueryOptions.newBuilder()
			        .setLimit(searchLimit)
			        .setFieldsToReturn("ID")
			        .setSortOptions(sortOptions)
			        .setCursor(search.getCursor())
			        .build();
	   }
 
	   Query query = Query.newBuilder().setOptions(options).build(squery);
	   
	   System.out.println("Search Query:"+query);
	   
	   Results<ScoredDocument> result;   
	   try {
		   result = index.search(query);
		   for (ScoredDocument doc : result) {
			   pids.add(doc.getId());
		    }
		   searchResponse.setCursor(result.getCursor());
		   searchResponse.setPids(pids);
	   } catch (SearchException e) {
			System.out.println(e);
		    // handle exception...
			return null;
		}
	   
	   return searchResponse;
   }
  
   public SearchPidsAndCursor getPlacesBySearchObjectWizSortByRating(SearchRequestWizJSON serachObjectWiz) {
	   
	   SearchPidsAndCursor searchResponse = new SearchPidsAndCursor();
	   SearchRequestJSON search = serachObjectWiz.getSerachRequest();
	   List<String> pids = new ArrayList<String>();
	   IndexSpec indexSpec = IndexSpec.newBuilder().setName("Places").build(); 
	   Index index = SearchServiceFactory.getSearchService().getIndex(indexSpec);
	   
	   String squery = "";
	   Integer radius = Math.round((float)(search.getRadius() * 0.8));

	   if(search.getName()==null || search.getName().length()<3) {
		   squery = "distance(location, geopoint("+search.getLat()+", "+search.getLng()+")) < "+radius;	   
	   } else {
		   squery = "distance(location, geopoint("+search.getLat()+", "+search.getLng()+")) < "+radius;
		   squery += " AND NameCombinations = "+search.getName();
	   }
	   if(serachObjectWiz.getRating() > (double)0) {
		   squery += " AND rating >= " + serachObjectWiz.getRating();
	   }
	   if(serachObjectWiz.getType()!= null && !serachObjectWiz.getType().isEmpty() ) {
		   squery += " AND type >= " + serachObjectWiz.getType();
	   }
	   if(serachObjectWiz.getSubtype()!= null && !serachObjectWiz.getSubtype().isEmpty() ) {
		   squery += " AND subtype >= " + serachObjectWiz.getSubtype();
	   }
	   
	   SortOptions sortOptions = SortOptions.newBuilder()
		        .addSortExpression(SortExpression.newBuilder()
		            .setExpression("rating")
		            .setDirection(SortExpression.SortDirection.DESCENDING)
		            .setDefaultValueNumeric(0))
		        .setLimit(1000)
		        .build();
	    
	   QueryOptions options   = QueryOptions.newBuilder() 
			        .setFieldsToReturn("ID")
			        .setSortOptions(sortOptions)
			        .setCursor(search.getCursor())
			        .build();
	   
 
	   Query query = Query.newBuilder().setOptions(options).build(squery);
	   
	   System.out.println("Search Query:"+query);
	   
	   Results<ScoredDocument> result;   
	   try {
		   result = index.search(query);
		   for (ScoredDocument doc : result) {
			   pids.add(doc.getId());
		    }
		   searchResponse.setCursor(result.getCursor());
		   searchResponse.setPids(pids);
	   } catch (SearchException e) {
			System.out.println(e);
		    // handle exception...
			return null;
		}
	   
	   return searchResponse;
   }
   
   public SearchPidsAndCursor getPlacesBySearchObjectNameOnly(SearchRequestJSON search) {
	   SearchPidsAndCursor searchResponse = new SearchPidsAndCursor();
	   List<String> pids = new ArrayList<String>();
	   IndexSpec indexSpec = IndexSpec.newBuilder().setName("Places").build(); 
	   Index index = SearchServiceFactory.getSearchService().getIndex(indexSpec);
	   
	   
	   SortOptions sortOptions = SortOptions.newBuilder()
		        .addSortExpression(SortExpression.newBuilder()
		            .setExpression("distance(location, geopoint("+search.getLat()+", "+search.getLng()+"))")
		            .setDirection(SortExpression.SortDirection.ASCENDING)
		            .setDefaultValueNumeric(0))
		        .setLimit(1000)
		        .build();
	   QueryOptions options = QueryOptions.newBuilder()
		        .setLimit(6)
		        .setFieldsToReturn("ID")
		        .setSortOptions(sortOptions)
		        .setCursor(search.getCursor())
		        .build();

		    // A query string
	   String squery ="NameCombinations = "+search.getName();

		    //  Build the Query and run the search
	   Query query = Query.newBuilder().setOptions(options).build(squery);
	   System.out.println("Search Query:"+query);
	   
	   Results<ScoredDocument> result;   
	   try {
		   result = index.search(query);
		   for (ScoredDocument doc : result) {
			   pids.add(doc.getId());
		    }
		   searchResponse.setCursor(result.getCursor());
		   searchResponse.setPids(pids);
	   } catch (SearchException e) {
			System.out.println(e);
		    // handle exception...
			return null;
		}
	  
	   return searchResponse;
   }
}
