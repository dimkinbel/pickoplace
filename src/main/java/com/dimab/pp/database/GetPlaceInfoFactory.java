package com.dimab.pp.database;


import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.dimab.pickoplace.utils.JsonUtils;
import com.dimab.pp.dto.CanvasShape;
import com.dimab.pp.dto.JsonimgID_2_data;
import com.dimab.pp.dto.PPSubmitObject;
import com.dimab.pp.dto.PlaceInfo;
import com.dimab.pp.dto.PlaceRatingDTO;
import com.dimab.pp.dto.PlaceRatingSummary;
import com.dimab.pp.dto.UserPlace;
import com.dimab.pp.dto.WorkingWeek;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Text;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.appengine.api.images.ImagesService;
import com.google.appengine.api.images.ImagesServiceFactory;
import com.google.appengine.api.images.ServingUrlOptions;
import com.google.appengine.tools.cloudstorage.GcsFilename;
import com.google.gson.reflect.TypeToken;

public class GetPlaceInfoFactory {
    @SuppressWarnings("unchecked")
    public PlaceInfo getPlaceInfo(DatastoreService datastore, Entity csEntity, int ovrv_width, boolean includePhotos, boolean includeRating) {
        PlaceInfo placeInfo = new PlaceInfo();
        UserPlace userPlace = new UserPlace();

        String userRnd = (String) csEntity.getProperty("usernameRandom");
        String placeName = (String) csEntity.getProperty("placeName");
        String placeBranchName = (String) csEntity.getProperty("placeBranchName");
        String placeID = (String) csEntity.getProperty("placeUniqID");
        String mainFloorID = (String) csEntity.getProperty("mainFloorID");
        String Address = (String) csEntity.getProperty("address");
        String mail = new String();
        String phone = new String();
        String placeURL = new String();
        String placeFax = new String();
        if (csEntity.getProperty("placeMail") != null) {
            mail = (String) csEntity.getProperty("placeMail");
        }
        if (csEntity.getProperty("placePhone") != null) {
            phone = (String) csEntity.getProperty("placePhone");
        }
        if (csEntity.getProperty("placeDescription") != null) {
            placeInfo.setDescription((String) csEntity.getProperty("placeDescription"));
        }
        if (csEntity.getProperty("placeFax") != null) {
            placeFax = (String) csEntity.getProperty("placeFax");
        }
        if (csEntity.getProperty("placeURL") == null) {
            placeURL = "";
        } else {
            placeURL = (String) csEntity.getProperty("placeURL");
        }
        placeInfo.setType((ArrayList<String>) csEntity.getProperty("PlaceType"));
        placeInfo.setSubtype((ArrayList<String>) csEntity.getProperty("PlaceSubType"));
        String weekdays = (String) csEntity.getProperty("workinghours");
        WorkingWeek weekdaysObject = JsonUtils.deserialize(weekdays, WorkingWeek.class);
        placeInfo.setWeekdaysObject(weekdaysObject);

        Integer bookableShapes = 0;

        double placeOffset = (double) csEntity.getProperty("UTCoffcet");
        Double Lat = Double.parseDouble((String) csEntity.getProperty("lat"));
        Double Lng = Double.parseDouble((String) csEntity.getProperty("lng"));
        String shapesJSON = ((Text) csEntity.getProperty("shapesJSON")).getValue();

        Type CanvasListcollectionType = new TypeToken<List<PPSubmitObject>>() {
        }.getType();
        List<PPSubmitObject> floors = JsonUtils.deserialize(shapesJSON, CanvasListcollectionType);
        String mainFloorName = new String();

        for (PPSubmitObject floor : floors) {
            if (floor.isMainfloor()) {
                mainFloorName = floor.getFloor_name();
            }
            for (CanvasShape shape : floor.getShapes()) {
                if (shape.getBooking_options().isBookable()) {
                    bookableShapes += 1;
                }
            }
        }

        // Get serving Overview URL;
        String fileName_ = userRnd + "/" + placeID + "/" + "main" + "/" + mainFloorID + "/overview.png";
        System.out.println(fileName_);


        String bucket = "pp_images";
        GcsFilename gcsFilename = new GcsFilename(bucket, fileName_);
        ImagesService is = ImagesServiceFactory.getImagesService();
        String filename = String.format("/gs/%s/%s", gcsFilename.getBucketName(), gcsFilename.getObjectName());
        String servingUrl = is.getServingUrl(ServingUrlOptions.Builder.withGoogleStorageFileName(filename).secureUrl(true));
        servingUrl = servingUrl + "=s" + ovrv_width;


        // Update logo and images
        String logoUrl = "";
        if (csEntity.getProperty("logo") != null && !((String) csEntity.getProperty("logo")).isEmpty() && (String) csEntity.getProperty("logo") != "") {
            String logoFileName = (String) csEntity.getProperty("logo");
            gcsFilename = new GcsFilename(bucket, logoFileName);
            System.out.println("LOGO Upload:" + gcsFilename);
            is = ImagesServiceFactory.getImagesService();
            filename = String.format("/gs/%s/%s", gcsFilename.getBucketName(), gcsFilename.getObjectName());
            logoUrl = is.getServingUrl(ServingUrlOptions.Builder.withGoogleStorageFileName(filename));
            logoUrl = logoUrl + "=s100";
        }
        //------------------------------------------------------------------
        // Update Images ---------------------------------------------------
        //------------------------------------------------------------------
        Type collectionType = new TypeToken<List<String>>() {
        }.getType();
        if (includePhotos) {
            List<String> photosList = JsonUtils.deserialize((String) csEntity.getProperty("photos"), collectionType);
            if (photosList != null) {
                for (String imgID : photosList) {
                    bucket = "pp_images";
                    String photoFileName = userRnd + "/" + placeID + "/" + "main" + "/photos/" + imgID;
                    gcsFilename = new GcsFilename(bucket, photoFileName);
                    is = ImagesServiceFactory.getImagesService();
                    filename = String.format("/gs/%s/%s", gcsFilename.getBucketName(), gcsFilename.getObjectName());
                    System.out.println("FILENAME=" + filename);
                    String imgUrl = is.getServingUrl(ServingUrlOptions.Builder.withGoogleStorageFileName(filename));
                    imgUrl = imgUrl + "=s150";

                    JsonimgID_2_data imgID2byte64 = new JsonimgID_2_data();
                    imgID2byte64.setData64(imgUrl);
                    imgID2byte64.setImageID(imgID);
                    placeInfo.getPlaceImageThumbnails().add(imgID2byte64);
                }
            }
        }
        //-----------------------------------------------------------------
        // Update Rating --------------------------------------------------
        //-----------------------------------------------------------------
        if (includeRating) {
            Filter pidFilter = new FilterPredicate("pid", FilterOperator.EQUAL, placeID);
            Query sq_ = new Query("PlaceRating").setFilter(pidFilter);
            PreparedQuery psq_ = datastore.prepare(sq_);
            Entity PlaceRatingEntity = psq_.asSingleEntity();
            if (PlaceRatingEntity != null) {
                PlaceRatingSummary rating = new PlaceRatingSummary();
                Double foodScore = (Double) PlaceRatingEntity.getProperty("food");
                Integer foodTotal = (int) (long) PlaceRatingEntity.getProperty("foodTotal");
                Double staffScore = (Double) PlaceRatingEntity.getProperty("staff");
                Integer staffTotal = (int) (long) PlaceRatingEntity.getProperty("staffTotal");
                Double locationScore = (Double) PlaceRatingEntity.getProperty("location");
                Integer locationTotal = (int) (long) PlaceRatingEntity.getProperty("locationTotal");
                rating.getRating().setFscore(foodScore);
                rating.getRating().setSscore(staffScore);
                rating.getRating().setLscore(locationScore);
                rating.setAverage((locationScore * locationTotal + staffScore * staffTotal + foodScore * foodTotal) / (foodTotal + staffTotal + locationTotal));
                rating.setTotal(Math.max(Math.max(foodTotal.intValue(), staffTotal.intValue()), locationTotal.intValue()));
                placeInfo.setRating(rating);
            } else {
                PlaceRatingSummary rating = new PlaceRatingSummary();
                rating.getRating().setFscore((double) 0);
                rating.getRating().setSscore((double) 0);
                rating.getRating().setLscore((double) 0);
                rating.setAverage((double) 0);
                rating.setTotal(0);
                placeInfo.setRating(rating);
            }
        }
        //-----------------------------------------------------------------
        //-----------------------------------------------------------------
        //-----------------------------------------------------------------
        userPlace.setAddress(Address);
        userPlace.setBranch(placeBranchName);
        userPlace.setLat(Lat);
        userPlace.setLng(Lng);
        userPlace.setOverviewCloudURL(servingUrl);
        userPlace.setPlace(placeName);
        userPlace.setPlaceID(placeID);
        userPlace.setUserRand(userRnd);
        userPlace.setShapesCount(bookableShapes);
        userPlace.setFloors(floors.size());

        placeInfo.setUserPlace(userPlace);
        placeInfo.setPlaceSiteURL(placeURL);
        placeInfo.setPlaceLogo(logoUrl);
        placeInfo.setPlaceOffcet(placeOffset);
        placeInfo.setMainFloorID(mainFloorID);
        placeInfo.setMainFloorName(mainFloorName);
        placeInfo.setPlaceMail(mail);
        placeInfo.setPlacePhone(phone);
        placeInfo.setPlaceFax(placeFax);

        return placeInfo;
    }

    public PlaceInfo getPlaceInfoNoImage(DatastoreService datastore, Entity csEntity) {
        PlaceInfo placeInfo = new PlaceInfo();
        UserPlace userPlace = new UserPlace();

        String userRnd = (String) csEntity.getProperty("usernameRandom");
        String placeName = (String) csEntity.getProperty("placeName");
        String placeBranchName = (String) csEntity.getProperty("placeBranchName");
        String placeID = (String) csEntity.getProperty("placeUniqID");
        String mainFloorID = (String) csEntity.getProperty("mainFloorID");
        String Address = (String) csEntity.getProperty("address");
        String mail = new String();
        String phone = new String();
        String url = new String();
        if (csEntity.getProperty("placeMail") != null) {
            mail = (String) csEntity.getProperty("placeMail");
        }
        if (csEntity.getProperty("placePhone") != null) {
            phone = (String) csEntity.getProperty("placePhone");
        }
        if (csEntity.getProperty("placeURL") != null) {
            url = (String) csEntity.getProperty("placeURL");
        }
        Integer bookableShapes = 0;

        double placeOffset = (double) csEntity.getProperty("UTCoffcet");
        Double Lat = Double.parseDouble((String) csEntity.getProperty("lat"));
        Double Lng = Double.parseDouble((String) csEntity.getProperty("lng"));
        String shapesJSON = ((Text) csEntity.getProperty("shapesJSON")).getValue();

        Type CanvasListcollectionType = new TypeToken<List<PPSubmitObject>>() {}.getType();
        List<PPSubmitObject> floors = JsonUtils.deserialize(shapesJSON, CanvasListcollectionType);

        String weekdays = (String) csEntity.getProperty("workinghours");
        WorkingWeek weekdaysObject = JsonUtils.deserialize(weekdays, WorkingWeek.class);

        List<Integer> closeDates =  new ArrayList<Integer>();
        if (csEntity.getProperty("closeDates")!=null) {
            String closeDatesJSON = (String)csEntity.getProperty("closeDates");
            CanvasListcollectionType = new TypeToken<List<Integer>>(){}.getType();
            closeDates = JsonUtils.deserialize(closeDatesJSON, CanvasListcollectionType);
        }
        Collections.sort(closeDates);

        String mainFloorName = new String();

        for (PPSubmitObject floor : floors) {
            if (floor.isMainfloor()) {
                mainFloorName = floor.getFloor_name();
            }
            for (CanvasShape shape : floor.getShapes()) {
                if (shape.getBooking_options().isBookable()) {
                    bookableShapes += 1;
                }
            }
        }

        userPlace.setAddress(Address);
        userPlace.setBranch(placeBranchName);
        userPlace.setLat(Lat);
        userPlace.setLng(Lng);
        userPlace.setPlace(placeName);
        userPlace.setPlaceID(placeID);
        userPlace.setUserRand(userRnd);
        userPlace.setShapesCount(bookableShapes);
        userPlace.setFloors(floors.size());
        userPlace.setCanvasfloors(floors);
        placeInfo.setUserPlace(userPlace);
        placeInfo.setPlaceOffcet(placeOffset);
        placeInfo.setMainFloorID(mainFloorID);
        placeInfo.setMainFloorName(mainFloorName);
        placeInfo.setPlaceMail(mail);
        placeInfo.setPlacePhone(phone);
        placeInfo.setPlaceSiteURL(url);
        placeInfo.setWeekdaysObject(weekdaysObject);
        placeInfo.setCloseDates(closeDates);

        return placeInfo;
    }
}
