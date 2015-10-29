package com.dimab.pp.database;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.lang.reflect.Type;
import java.nio.channels.Channels;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


import com.dimab.pp.dto.BookingRequest;
import com.dimab.pp.dto.BookingRequestWrap;
import com.dimab.pp.dto.CanvasShape;
import com.dimab.pp.dto.FreePlaceOption;
import com.dimab.pp.dto.PPSubmitObject;
import com.dimab.pp.dto.PlaceInfo;
import com.dimab.pp.dto.SearchRequestWizJSON;
import com.dimab.pp.dto.ShapePersons;
import com.dimab.pp.dto.ShapesMapObject;
import com.dimab.pp.dto.UserPlace;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.GeoPt;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Text;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.appengine.tools.cloudstorage.GcsFileOptions;
import com.google.appengine.tools.cloudstorage.GcsFilename;
import com.google.appengine.tools.cloudstorage.GcsInputChannel;
import com.google.appengine.tools.cloudstorage.GcsOutputChannel;
import com.google.appengine.tools.cloudstorage.GcsService;
import com.google.appengine.tools.cloudstorage.GcsServiceFactory;
import com.google.appengine.tools.cloudstorage.RetryParams;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;

public class FreePlaceFactory {
  private final GcsService gcsService = GcsServiceFactory.createGcsService(new RetryParams.Builder()
      .initialRetryDelayMillis(10)
      .retryMaxAttempts(10)
      .totalRetryPeriodMillis(15000)
      .build());

  /**Used below to determine the size of chucks to read in. Should be > 1kb and < 10MB */
  private static final int BUFFER_SIZE = 2 * 1024 * 1024;
	public List<FreePlaceOption> listFreeOptionsGCS(DatastoreService datastore,Entity csEntity, SearchRequestWizJSON serachObjectWiz) {
		// TODO Auto-generated method stub
		 List<FreePlaceOption> returnList = new ArrayList<FreePlaceOption>();
		Integer defaultSeconds = new Integer(15*60);
		Integer Day = serachObjectWiz.getDateUTC();
		Integer Time = serachObjectWiz.getTime();
		Integer Period = serachObjectWiz.getPeriodSeconds();
		Integer Margin = serachObjectWiz.getMarginSeconds();
		
		Integer startAt = Day + Time - Margin;
		Integer periodAndMargin  = Period + 2 * Margin;
		List<Long> rangesList = getJSONRanges(defaultSeconds,startAt.longValue(), periodAndMargin);
		System.out.println("RANGE LIST:"+rangesList);
		GetPlaceInfoFactory placeFactory = new GetPlaceInfoFactory();
		PlaceInfo placeInfo = placeFactory.getPlaceInfoNoImage(datastore, csEntity);
		String shapesJSON =  ((Text) csEntity.getProperty("shapesJSON")).getValue();
		Gson gson = new Gson();
		Type CanvasListcollectionType = new TypeToken<List<PPSubmitObject>>(){}.getType();
		List<PPSubmitObject> floors = gson.fromJson(shapesJSON, CanvasListcollectionType);
		ShapesMapObject personsMap = getPersonsMap(floors);
		personsMap.printString();
		
		Map<String,Object> jsonmap = getJSONmapFromGCS(placeInfo);
		System.out.println(jsonmap);
		Map<Integer,Integer> placeVariations = getPlaceVariations(serachObjectWiz.getPersons());
		System.out.println(placeVariations);
		if(jsonmap.isEmpty()) {
			// Get free data based on shapesJSON
			for (Integer personsSingleKey : placeVariations.keySet()) {
				Integer requiredPlaces = placeVariations.get(personsSingleKey);
				if(personsMap.getPersonsAllowed().containsKey(personsSingleKey)) {
					if(personsMap.getPersonsAllowed().get(personsSingleKey).size() >= requiredPlaces) {
						// Has enough places of current persons per place
						FreePlaceOption singleOption = new FreePlaceOption();
						singleOption.setPersons(personsSingleKey);
						singleOption.setCount(personsMap.getPersonsAllowed().get(personsSingleKey).size());
						returnList.add(singleOption);
					}
				}
			}
			
		} else {			
			Map<String,Integer> sidToRangesMap = reverseJSONmap(jsonmap,rangesList);
			System.out.println(sidToRangesMap);
			if(sidToRangesMap.isEmpty()) {
				// Get free data based on shapesJSON
				for (Integer personsSingleKey : placeVariations.keySet()) {
					Integer requiredPlaces = placeVariations.get(personsSingleKey);
					if(personsMap.getPersonsAllowed().containsKey(personsSingleKey)) {
						if(personsMap.getPersonsAllowed().get(personsSingleKey).size() >= requiredPlaces) {
							// Has enough places of current persons per place
							FreePlaceOption singleOption = new FreePlaceOption();
							singleOption.setPersons(personsSingleKey);
							singleOption.setCount(personsMap.getPersonsAllowed().get(personsSingleKey).size());
							returnList.add(singleOption);
						}
					}
				}
			} else {
				// Get free data based on Occupied places and shapesJSON
				for (Integer personsSingleKey : placeVariations.keySet()) {
					Integer requiredPlaces = placeVariations.get(personsSingleKey);
					if(personsMap.getPersonsAllowed().containsKey(personsSingleKey)) {
						if(personsMap.getPersonsAllowed().get(personsSingleKey).size() >= requiredPlaces) {
							// Has enough places of current persons per place
							List<String> sidsAllowed = personsMap.getPersonsAllowed().get(personsSingleKey);
							Integer total_free = 0;
							for(String sid : sidsAllowed) {
								if(!sidToRangesMap.containsKey(sid)) {
 									// Sid totally free
									total_free+=1;
								}
							}
							if(total_free >= requiredPlaces) {
								FreePlaceOption singleOption = new FreePlaceOption();
								singleOption.setPersons(personsSingleKey);
								singleOption.setCount(total_free);
								returnList.add(singleOption);
							}
						}
					}
				}
			}
		}
		if(true) {
			Integer persons = serachObjectWiz.getPersons();
			List<FreePlaceOption> tempReturnList = new ArrayList<FreePlaceOption>();
			for(FreePlaceOption singleOption : returnList) {
				if(singleOption.getPersons() >= persons) {
					tempReturnList.add(singleOption);
				}
				
			}
			if(tempReturnList.size()>0) {
				returnList = tempReturnList;
			}
		}
		return returnList;
	}
   private Map<Integer, Integer> getPlaceVariations(Integer persons) {
	    Map<Integer, Integer> veriationsList = new HashMap<Integer, Integer>();
		for(int i = 1;i <= persons ; i++) { 
			Integer countOfcurrent = (int) Math.ceil( ((double)persons) / i);
			veriationsList.put(i, countOfcurrent);
		}
		return veriationsList;
	}
private ShapesMapObject getPersonsMap(List<PPSubmitObject> floors) {
	     ShapesMapObject personsMap = new ShapesMapObject();
	     for(PPSubmitObject floor:floors) {
	    	 List<CanvasShape> shapes = floor.getShapes();
	    	 for(CanvasShape shape : shapes) {
	    		 ShapePersons shapePersons = new ShapePersons();
	    		 shapePersons.setMin( shape.getBooking_options().getMinPersons());
	    		 shapePersons.setMax( shape.getBooking_options().getMaxPersons());
	    		 shapePersons.setSid( shape.getSid());
	    		 personsMap.getShapesMap().put(shape.getSid(), shapePersons);
	    		 for(Integer i = shape.getBooking_options().getMinPersons() ; i <= shape.getBooking_options().getMaxPersons() ; i++){
	    			 if(personsMap.getPersonsAllowed().containsKey(i)) {
	    				 List<String> allowedSIDs = personsMap.getPersonsAllowed().get(i);
	    				 allowedSIDs.add(shape.getSid());
	    				 personsMap.getPersonsAllowed().put(i, allowedSIDs);
	    			 } else {
	    				 List<String> allowedSIDs = new ArrayList<String>();
	    				 allowedSIDs.add(shape.getSid());
	    				 personsMap.getPersonsAllowed().put(i, allowedSIDs);
	    			 }
	    		 }
	    		 if(personsMap.getPersonsMax().containsKey(shape.getBooking_options().getMaxPersons())) {
	    			 List<String> maxStringList = personsMap.getPersonsMax().get(shape.getBooking_options().getMaxPersons());
	    			 maxStringList.add(shape.getSid());
	    			 personsMap.getPersonsMax().put(shape.getBooking_options().getMaxPersons(), maxStringList);
	    		 } else {
	    			 List<String> maxStringList = new ArrayList<String>();
	    			 maxStringList.add(shape.getSid());
	    			 personsMap.getPersonsMax().put(shape.getBooking_options().getMaxPersons(), maxStringList);
	    		 }
	    		 if(personsMap.getPersonsMin().containsKey(shape.getBooking_options().getMinPersons())) {
	    			 List<String> minStringList = personsMap.getPersonsMin().get(shape.getBooking_options().getMinPersons());
	    			 minStringList.add(shape.getSid());
	    			 personsMap.getPersonsMin().put(shape.getBooking_options().getMinPersons(), minStringList);
	    		 } else {
	    			 List<String> minStringList = new ArrayList<String>();
	    			 minStringList.add(shape.getSid());
	    			 personsMap.getPersonsMin().put(shape.getBooking_options().getMinPersons(), minStringList);
	    		 }
	    	 }
	     }
		return personsMap;
	}
private Map<String,Integer> reverseJSONmap(Map<String, Object> jsonmap ,List<Long> rangesList ) {
	    Map<String, Integer> returnMap  = new HashMap<String,Integer>();
	  //Map<  SID , Map< range, 1or0   >>
	    for(Long rangeVal : rangesList ){
      	  String rangeAsString = rangeVal.toString();
      	  if(jsonmap.containsKey(rangeAsString)) {
      		  // JSON contains bookings at that range
      		  @SuppressWarnings("unchecked")
			  List<String> rangeSIDList = (List<String>) jsonmap.get(rangeAsString); 
      		  for(String sid : rangeSIDList) {
      			  // Current SID is occupied in given range
      			  returnMap.put(sid, 1);
 
      		  }
      	  }
	    }
		return returnMap;
	}
public boolean UpdateFreePlaceRemoveBooking(Entity bookEntity , List<BookingRequest> bookingRequests,DatastoreService datastore ) {
	   Integer defaultSeconds = new Integer(15*60);
	   
	   Integer startAt = (int)(long)bookEntity.getProperty("UTCstartSeconds");
	   Integer period = (int)(long)bookEntity.getProperty("periodSeconds");
	   UserPlace userPlace = new UserPlace();
	   userPlace.setAddress((String)bookEntity.getProperty("address"));
	   userPlace.setPlace((String)bookEntity.getProperty("placeName"));
	   userPlace.setBranch((String)bookEntity.getProperty("placeBranchName"));
	   userPlace.setPlaceID((String)bookEntity.getProperty("pid"));
	   
	   List<Long> rangesList = getJSONRanges(defaultSeconds,startAt.longValue(), period);
	   // Delete SIDs from GCS JSON
	   deleteFreePlaceGCS( bookingRequests ,  rangesList  ,  userPlace);
	    
	   return true;
   }
   public boolean UpdateFreePlace(Entity canvasEntity ,List<Entity> shapesEntities , BookingRequestWrap bookingRequestsWrap , 
		                          DatastoreService datastore ) {
	   List<String> bookedShapes = new ArrayList<String>();
	   Integer defaultSeconds = new Integer(15*60);
	   List<Long> rangesList =  getJSONRanges(defaultSeconds,bookingRequestsWrap);
	   for (BookingRequest brequest :bookingRequestsWrap.getBookingList()) {
		   bookedShapes.add(brequest.getSid());
	   }
	    
	    
	   GetPlaceInfoFactory placeFactory = new GetPlaceInfoFactory();
	   PlaceInfo placeInfo = placeFactory.getPlaceInfoNoImage(datastore, canvasEntity);
	   
	   List<String> rangesFull = updateFreePlaceGCS(placeInfo , datastore , bookedShapes,rangesList);
	   
	   if(rangesFull != null && rangesFull.size() > 0) {
		   //UpdateOrCreateEmptyMapDatastoreEntity(defaultSeconds.longValue(),canvasEntity,placeInfo,rangesFull,datastore , bookedShapes,rangesList);
	   }
	   	 
	   return true;
   }
   public List<Long> getJSONRanges(Integer PropertyPeriodSeconds,Long Start, Integer bookPeriod) {
	   List<Long> list_ = new ArrayList<Long>();
 

	   Long BookingStartSecondsUTC = Start;	
	   Long BookingEndSecondsUTC = Start + bookPeriod.longValue(); 
	   Integer modulusS = (int) (BookingStartSecondsUTC % PropertyPeriodSeconds);
	   if(modulusS == 0) {
		   list_.add(BookingStartSecondsUTC);
	   } else {
		   Long adaptedStart = BookingStartSecondsUTC - modulusS.longValue();
		   list_.add(adaptedStart);
	   } 
	   Integer modulusF = (int) (BookingEndSecondsUTC % PropertyPeriodSeconds);
	   Long lastPeriod ;
	   if(modulusF == 0) {
		   if(BookingEndSecondsUTC - PropertyPeriodSeconds == list_.get(0)) {
			   // Booking added to the same period
			   lastPeriod = list_.get(0);
		   } else {
			   // At least two periods included
			   lastPeriod=BookingEndSecondsUTC-PropertyPeriodSeconds;
		   }
	   } else {
		   	if(BookingStartSecondsUTC - modulusF ==  list_.get(0)) {
		   	   // Booking added to the same period
		   		lastPeriod = list_.get(0);
		   	} else {
		   		lastPeriod=BookingStartSecondsUTC - modulusF;
		   	}
	   }
	   for(Long ind = list_.get(0) + PropertyPeriodSeconds ; ind <= lastPeriod ; ind += PropertyPeriodSeconds) {
		   list_.add(ind);
	   }
	   return list_;
   }   
   public List<Long> getJSONRanges(Integer PropertyPeriodSeconds,BookingRequestWrap bookingRequestsWrap) {
	   List<Long> list_ = new ArrayList<Long>();
 
	   Long fromSeconds = bookingRequestsWrap.getDateSeconds() + bookingRequestsWrap.getTime();
	   Long BookingStartSecondsUTC = fromSeconds - bookingRequestsWrap.getClientOffset()*60 - (long)(bookingRequestsWrap.getPlaceOffcet()*3600);	
	   Long BookingEndSecondsUTC = BookingStartSecondsUTC + bookingRequestsWrap.getPeriod(); 
	   Integer modulusS = (int) (BookingStartSecondsUTC % PropertyPeriodSeconds);
	   if(modulusS == 0) {
		   list_.add(BookingStartSecondsUTC);
	   } else {
		   Long adaptedStart = BookingStartSecondsUTC - modulusS.longValue();
		   list_.add(adaptedStart);
	   } 
	   Integer modulusF = (int) (BookingEndSecondsUTC % PropertyPeriodSeconds);
	   Long lastPeriod ;
	   if(modulusF == 0) {
		   if(BookingEndSecondsUTC - PropertyPeriodSeconds == list_.get(0)) {
			   // Booking added to the same period
			   lastPeriod = list_.get(0);
		   } else {
			   // At least two periods included
			   lastPeriod=BookingEndSecondsUTC-PropertyPeriodSeconds;
		   }
	   } else {
		   	if(BookingStartSecondsUTC - modulusF ==  list_.get(0)) {
		   	   // Booking added to the same period
		   		lastPeriod = list_.get(0);
		   	} else {
		   		lastPeriod=BookingStartSecondsUTC - modulusF;
		   	}
	   }
	   for(Long ind = list_.get(0) + PropertyPeriodSeconds ; ind <= lastPeriod ; ind += PropertyPeriodSeconds) {
		   list_.add(ind);
	   }
	   return list_;
   }
   
   public List<Entity> CleanFreeEntityBeforeNow(List<Entity> temEntityList) {
	   List<Entity> listEntities = temEntityList;
	   
	   return listEntities;
   }
   public boolean deleteFreePlaceGCS(List<BookingRequest> bookingRequests , List<Long> rangesList  , UserPlace userPlace) {
	    
	   List<String> bookedShapes = new ArrayList<String>();
	   for (BookingRequest breq : bookingRequests ) {
		   bookedShapes.add(breq.getSid());
	   }
	   String bucketName = "pp_free_place_json";
	   String placeNameChar = userPlace.getPlaceNameClean();
	   String placeBranchChar = userPlace.getBranchClean();
	   String addrChar = userPlace.getAddressClean();
	   String fileName =  userPlace.getPlaceID()+"/"+"json_free_map.json";
	   GcsFileOptions.Builder optionsBuilder = new GcsFileOptions.Builder();
       GcsOutputChannel outputChannel;
       GcsInputChannel readChannel = null;
       Gson gson = new Gson();
       Map<String,Object> map = new HashMap<String,Object>();
	   GcsFilename Sname = new GcsFilename(bucketName, fileName);
	   
	   try {
		  if(gcsService.getMetadata(Sname)==null) {
			  
		   } else {
			  readChannel = gcsService.openReadChannel(Sname, 0);
		      JsonElement element =new JsonParser().parse(Channels.newReader(readChannel,"UTF-8"));
		      JsonObject jso = element.getAsJsonObject();
	          Type mapobj = new TypeToken<Map<String,Object>>(){}.getType();
	          map = gson.fromJson(jso, mapobj);
	          map = cleanPastPeriodsGCS(map);
	          for(Long rangeVal : rangesList ){
	        	  String rangeAsString = rangeVal.toString();
	        	  if(map.containsKey(rangeAsString)) {
	        		  // JSON contains bookings at that range
	        		  List<String> rangeSIDList = (List<String>) map.get(rangeAsString);
	        		  Map<String,Boolean> sidListAsMap = new HashMap<String,Boolean>();
	        		  for(String sid :rangeSIDList) {
	        			  sidListAsMap.put(sid, true);
	        		  }
	        		  for(String sid : bookedShapes) {
	        			  if(sidListAsMap.containsKey(sid)) {
	        				  rangeSIDList.remove(sid);
	        			  } else {  
	        				  
	        			  }
	        		  }

	        		  map.put(rangeAsString, rangeSIDList);
	        	  } else {
	        		   // No range exists in GCS JSON
	        	  }
	          }
	          optionsBuilder = new GcsFileOptions.Builder();
	          optionsBuilder.mimeType("application/json");
	          outputChannel = gcsService.createOrReplace(Sname, optionsBuilder.build());
	          String jsontext = gson.toJson(map);
	          copy(jsontext.getBytes(), Channels.newOutputStream(outputChannel));
		   }
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	   return true;
   }
   public Map<String,Object> getJSONmapFromGCS(PlaceInfo placeInfo) {
	   Map<String,Object> map = new HashMap<String,Object>();
 
	   String bucketName = "pp_free_place_json";
	   String placeNameChar = placeInfo.getUserPlace().getPlaceNameClean();
	   String placeBranchChar = placeInfo.getUserPlace().getBranchClean();
	   String addrChar = placeInfo.getUserPlace().getAddressClean();
	   String fileName =  placeInfo.getUserPlace().getPlaceID()+"/"+"json_free_map.json";
 
       GcsInputChannel readChannel = null;
       Gson gson = new Gson(); 
	   GcsFilename Sname = new GcsFilename(bucketName, fileName);
	   System.out.println(Sname);
	   try {
			  if(gcsService.getMetadata(Sname)==null) {
				  // Not occupied place
				  
			  } else {
				  readChannel = gcsService.openReadChannel(Sname, 0);
			      JsonElement element =new JsonParser().parse(Channels.newReader(readChannel,"UTF-8"));
			      JsonObject jso = element.getAsJsonObject();
		          Type mapobj = new TypeToken<Map<String,Object>>(){}.getType();
		          map = gson.fromJson(jso, mapobj);
			  }
	   } catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	   return map;
   }
   public List<String> updateFreePlaceGCS(PlaceInfo placeInfo , 
		                                                     DatastoreService datastore , 
		                                                     List<String> bookedShapes,
		                                                     List<Long> rangesList) {
	   List<String> rangesFull = new ArrayList<String>();

	   String bucketName = "pp_free_place_json";
	   String placeNameChar = placeInfo.getUserPlace().getPlaceNameClean();
	   String placeBranchChar = placeInfo.getUserPlace().getBranchClean();
	   String addrChar = placeInfo.getUserPlace().getAddressClean();
	   String fileName =  placeInfo.getUserPlace().getPlaceID()+"/"+"json_free_map.json";
	   GcsFileOptions.Builder optionsBuilder = new GcsFileOptions.Builder();
       GcsOutputChannel outputChannel;
       GcsInputChannel readChannel = null;
       Gson gson = new Gson();
       Map<String,Object> map = new HashMap<String,Object>();
	   GcsFilename Sname = new GcsFilename(bucketName, fileName);
	   
	   try {
		  if(gcsService.getMetadata(Sname)==null) {
			  optionsBuilder = new GcsFileOptions.Builder();
	          optionsBuilder.mimeType("application/json");
	          outputChannel = gcsService.createOrReplace(Sname, optionsBuilder.build());	          
	          for(Long rangeVal : rangesList ){
	        	  map.put(rangeVal.toString(), bookedShapes);
	        	  if(bookedShapes.size() >= placeInfo.getUserPlace().getShapesCount()) {
        			  rangesFull.add(rangeVal.toString());
        		  }
	          }
	          String jsontext = gson.toJson(map);
	          copy(jsontext.getBytes(), Channels.newOutputStream(outputChannel));
		   } else {
			  readChannel = gcsService.openReadChannel(Sname, 0);
		      JsonElement element =new JsonParser().parse(Channels.newReader(readChannel,"UTF-8"));
		      JsonObject jso = element.getAsJsonObject();
	          Type mapobj = new TypeToken<Map<String,Object>>(){}.getType();
	          map = gson.fromJson(jso, mapobj);
	          map = cleanPastPeriodsGCS(map);
	          for(Long rangeVal : rangesList ){
	        	  String rangeAsString = rangeVal.toString();
	        	  if(map.containsKey(rangeAsString)) {
	        		  // JSON contains bookings at that range
	        		  @SuppressWarnings("unchecked")
					  List<String> rangeSIDList = (List<String>) map.get(rangeAsString);
	        		  Map<String,Boolean> sidListAsMap = new HashMap<String,Boolean>();
	        		  for(String sid :rangeSIDList) {
	        			  sidListAsMap.put(sid, true);
	        		  }
	        		  for(String sid : bookedShapes) {
	        			  if(sidListAsMap.containsKey(sid)) {
	        				  System.out.println("WARNING:Already Has SID:"+sid);
	        			  } else {
	        				  rangeSIDList.add(sid);
	        			  }
	        		  }
	        		  if(rangeSIDList.size() >= placeInfo.getUserPlace().getShapesCount()) {
	        			  rangesFull.add(rangeAsString);
	        		  }
	        		  map.put(rangeAsString, rangeSIDList);
	        	  } else {
	        		  List<String> rangeSIDList = new ArrayList<String>();
	        		  for(String sid : bookedShapes) {
	        				  rangeSIDList.add(sid);
	        		  }
	        		  if(rangeSIDList.size() >= placeInfo.getUserPlace().getShapesCount()) {
	        			  rangesFull.add(rangeAsString);
	        		  }
	        		  map.put(rangeAsString, rangeSIDList);
	        	  }
	          }
	          optionsBuilder = new GcsFileOptions.Builder();
	          optionsBuilder.mimeType("application/json");
	          outputChannel = gcsService.createOrReplace(Sname, optionsBuilder.build());
	          String jsontext = gson.toJson(map);
	          copy(jsontext.getBytes(), Channels.newOutputStream(outputChannel));
		   }
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	   return rangesFull;

   }
 
   public void UpdateEntityOnBookingCancel_disabled (DatastoreService datastore ,   List<Long> rangesList  , UserPlace userPlace) {
	   Filter placeIdFilter = new  FilterPredicate("pid",FilterOperator.EQUAL,userPlace.getPlaceID());
 		Query q = new Query("FreePlaceMap").setFilter(placeIdFilter);
 		PreparedQuery pq = datastore.prepare(q);
 		if(pq.asSingleEntity()!= null) {
 		    Entity freeEnity = pq.asSingleEntity();
 		    Long startFrom = (Long) freeEnity.getProperty("StartTime");
		    Long startInitial = startFrom;
		    Long endRange = (Long) freeEnity.getProperty("EndTime");
		    Long endInitial = endRange;
		    Long compateToStart = 3000000000L;
		    Long compateToEnd = 0L;
		    Date date = new Date(); 
		    
			Long currentSeconds = date.getTime()/1000;
			Map<String,Object> properties = freeEnity.getProperties();
			Map<String,Object> reducedProperties =  getModifiableMap(properties);
			Map<Long,Boolean> rangeListAsMap = new HashMap<Long,Boolean>();
  		    for(Long range :rangesList) {
  		    	rangeListAsMap.put(range, true);
  		    }
			if(startFrom < currentSeconds) {
				// Remove past properties
				for (String key : properties.keySet()) {
					try {
					   Long secondsInMap = Long.parseLong(key, 10);
					   if(secondsInMap < currentSeconds) {
						   // Remove past properties
						   freeEnity.removeProperty(key);
						   reducedProperties.remove(key);
					   } 
					} catch (NumberFormatException e) {
						
					}
				}
			} 
			properties =  getModifiableMap(reducedProperties);
			// Remove deleted bookings
			for (String key : properties.keySet()) {
				try {
				   Long secondsInMap = Long.parseLong(key, 10);
				   if(rangeListAsMap.containsKey(secondsInMap)) {
					   freeEnity.removeProperty(key);
					   reducedProperties.remove(key);
				   }
				} catch (NumberFormatException e) {
					
				}
			}
			for (String key : reducedProperties.keySet()) {
			  try {
				 Long secondsInMap = Long.parseLong(key, 10);
			    	if(secondsInMap <= compateToStart) {
					   compateToStart = secondsInMap;
			        }
				    if(secondsInMap >= compateToEnd) {
					   compateToEnd = secondsInMap;
				    }
			  } catch (NumberFormatException e) {
					
				}
			}
			// Current start and end ranges in Entity (May be 0 OR 3000000000L)
			startFrom = compateToStart;
			endRange = compateToEnd;
			if(startFrom!= startInitial) {
		          freeEnity.setUnindexedProperty("StartTime", startFrom);
		          freeEnity.setUnindexedProperty("StartDate", new Date(startFrom*1000L));
		     }
		     if(endRange != endInitial) {
		    	   freeEnity.setUnindexedProperty("EndTime", endRange); 
		    	   freeEnity.setUnindexedProperty("EndDate", new Date(endRange*1000L));
		     }
			datastore.put(freeEnity);
 		}
   }
   public void UpdateOrCreateEmptyMapDatastoreEntity_disabled (  Long rangePeriod , 
		                                               Entity canvasEntity,
		                                               PlaceInfo placeInfo , 
		                                               List<String> rangesFull ,
		                                               DatastoreService datastore , 
		                                               List<String> bookedShapes,
		                                               List<Long> rangesList) {
	   Key canvasKey = canvasEntity.getKey();
	   Entity freeEnity;
	   GeoPt center = new GeoPt(Float.parseFloat(placeInfo.getUserPlace().getLat().toString()), 
			                    Float.parseFloat(placeInfo.getUserPlace().getLng().toString()));

	   try {
			    Key pidKey = KeyFactory.createKey(canvasKey,"FreePlaceMap", KeyFactory.keyToString(canvasKey));
			    freeEnity = datastore.get(pidKey);
			    Long startFrom = (Long) freeEnity.getProperty("StartTime");
			    Long startInitial = startFrom;
			    Long endRange = (Long) freeEnity.getProperty("EndTime");
			    Long endInitial = endRange;
			    Long compateToStart = 3000000000L;
			    Long compateToEnd = 0L;
			    Date date = new Date();
				Long currentSeconds = date.getTime()/1000;
				Map<String,Object> properties = freeEnity.getProperties();
				Map<String,Object> reducedProperties = getModifiableMap(properties); 
				if(startFrom < currentSeconds) {
					// Remove past properties
					for (String key : properties.keySet()) {
                       try {
						   Long secondsInMap = Long.parseLong(key, 10);
						   if(secondsInMap < currentSeconds) {
							   freeEnity.removeProperty(key);
							   reducedProperties.remove(key);
						   } 
                       } catch (NumberFormatException e) {
   						
   					   }
					}
					// Get current start and end ranges after removing past ranges
					for (String key : reducedProperties.keySet()) {
					  try {
						 Long secondsInMap = Long.parseLong(key, 10);
					    	if(secondsInMap <= compateToStart) {
							   compateToStart = secondsInMap;
					        }
						    if(secondsInMap >= compateToEnd) {
							   compateToEnd = secondsInMap;
						    }
					  } catch (NumberFormatException e) {
							
						}
					}
					// Current start and end ranges in Entity
					startFrom = compateToStart;
					endRange = compateToEnd;
					// Update Start Time
			        for(String range:rangesFull) {
			        	Long rangeLong = Long.parseLong(range, 10);

				        if(rangeLong <= startFrom) {
				        	startFrom = rangeLong;
				        }
				        if(rangeLong >= endRange) {
				        	endRange = rangeLong;
				        }
			        	
			        }
			       if(startFrom!= startInitial) {
			          freeEnity.setUnindexedProperty("StartTime", startFrom);
			          freeEnity.setUnindexedProperty("StartDate", new Date(startFrom*1000L));
			       }
			       if(endRange != endInitial) {
			    	   freeEnity.setUnindexedProperty("EndTime", endRange); 
			    	   freeEnity.setUnindexedProperty("EndDate", new Date(endRange*1000L));
			       }
				} else {
					// Check if any book range is less than StartTime --> Update
					// Check if any book range is greater than EndTime --> Update
					for(String range:rangesFull) {
			        	Long rangeLong = Long.parseLong(range, 10);

				        if(rangeLong <= startFrom) {
				        	startFrom = rangeLong;
				        }
				        if(rangeLong >= endRange) {
				        	endRange = rangeLong;
				        }
			        	
			        }
			       if(startFrom!= startInitial) {
			          freeEnity.setUnindexedProperty("StartTime", startFrom);
			          freeEnity.setUnindexedProperty("StartDate", new Date(startFrom*1000L));
			       }
			       if(endRange != endInitial) {
			    	   freeEnity.setUnindexedProperty("EndTime", endRange); 
			    	   freeEnity.setUnindexedProperty("EndDate", new Date(endRange*1000L));
			       }
				}
				// Update
				for(String range:rangesFull) { 
					freeEnity.setUnindexedProperty(range, true);
		        }

	   } catch (EntityNotFoundException e) {
		        freeEnity =  new Entity("FreePlaceMap", KeyFactory.keyToString(canvasKey), canvasKey);
		        Long startFrom = 3000000000L;
		        Long endRange = 0L;
		        for(String range:rangesFull) {
		        	Long rangeLong = Long.parseLong(range, 10);

		        	if(rangeLong < startFrom) {
		        		startFrom = rangeLong;
		        	}
		        	if(rangeLong > endRange ) {
		        		endRange = rangeLong;
		        	}
		        	freeEnity.setProperty(range, true);
		        }
		        
		        freeEnity.setUnindexedProperty("StartTime", startFrom);
		        freeEnity.setUnindexedProperty("StartDate", new Date(startFrom*1000L));
		        freeEnity.setUnindexedProperty("EndTime", endRange);
		        freeEnity.setUnindexedProperty("EndDate", new Date(endRange*1000L));
		        freeEnity.setUnindexedProperty("Period", rangePeriod);
		        freeEnity.setProperty("pid", placeInfo.getUserPlace().getPlaceID());
		        freeEnity.setProperty("location", center);
	   } 
	   datastore.put(freeEnity);
	   
   }
	private void copy(byte[] Byteinput, OutputStream output) throws IOException {
	    try {
	      InputStream input = new ByteArrayInputStream(Byteinput);
	      byte[] buffer = new byte[BUFFER_SIZE];
	      int bytesRead = input.read(buffer);
	      while (bytesRead != -1) {
	        output.write(buffer, 0, bytesRead);
	        bytesRead = input.read(buffer);
	      }
	    } finally {
	      output.close();
	    }
	  }
    
	public Map<String,Object> cleanPastPeriodsGCS(Map<String,Object> inmap) {
		Map<String,Object> outmap = inmap;
		Date date = new Date();
		Long currentSeconds = date.getTime()/1000;
		List<String> keysToRemove = new ArrayList<String>();
		for (String key : inmap.keySet()) {
		   Long secondsInMap = Long.parseLong(key, 10);
		   if(secondsInMap < currentSeconds) {
			   keysToRemove.add(key);
		   }
		}
		for(String key : keysToRemove ) {
			outmap.remove(key);
		}
		return outmap;
	}
	public Map<String,Object> getModifiableMap(Map<String,Object> inmap) {
		Map<String,Object> outmap = new HashMap<String,Object>();
		for (String key : inmap.keySet()) {
			outmap.put(key, inmap.get(key));
		}
		return outmap;
	}
}
