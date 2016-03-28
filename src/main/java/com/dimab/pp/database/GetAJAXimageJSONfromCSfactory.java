package com.dimab.pp.database;

import java.lang.reflect.Type;
import java.util.*;

import com.dimab.pickoplace.utils.JsonUtils;
import com.dimab.pp.dto.*;
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

public class GetAJAXimageJSONfromCSfactory {
    public List<BookingRequestPlaceView> getBookingViewData(Entity csEntity, BookingRequestWrap bookingRequestsWrap) {
        List<BookingRequestPlaceView> floors = new ArrayList<>();
        String shapesJSON = ((Text) csEntity.getProperty("shapesJSON")).getValue();
        String usernameRandom = (String) csEntity.getProperty("usernameRandom");
        Type CanvasListcollectionType = new TypeToken<List<PPSubmitObject>>() {
        }.getType();
        List<PPSubmitObject> canvasFloors = JsonUtils.deserialize(shapesJSON, CanvasListcollectionType);

        Map<String, List<String>> fid2sidList = new HashMap<String,  List<String>>();
        Map<String,Integer> sid2persons = new HashMap<>();
        for(BookingRequest singleShapeBooking :bookingRequestsWrap.getBookingList()) {
            if(fid2sidList.containsKey(singleShapeBooking.getFloorid())) {
                fid2sidList.get(singleShapeBooking.getFloorid()).add(singleShapeBooking.getSid());
            } else {
                List<String> shapes = new ArrayList<>();
                shapes.add(singleShapeBooking.getSid());
                fid2sidList.put(singleShapeBooking.getFloorid(),shapes);

            }
            sid2persons.put(singleShapeBooking.getSid(),singleShapeBooking.getPersons());

        }
        for (PPSubmitObject floor : canvasFloors) {
            if(fid2sidList.containsKey(floor.getFloorid())) {
                BookingRequestPlaceView bookingPlaceView = new BookingRequestPlaceView();
                List<ShapeDimentions> shapeDims = new ArrayList<>();
                for(CanvasShape shape : floor.getShapes()) {
                    String sid = shape.getSid();
                    if(fid2sidList.get(floor.getFloorid()).contains(sid)) {
                        ShapeDimentions shapeDim = new ShapeDimentions();
                        shapeDim.setName(shape.getBooking_options().getGivenName());
                        shapeDim.setX(shape.getX());
                        shapeDim.setY(shape.getY());
                        shapeDim.setMinp(shape.getBooking_options().getMinPersons());
                        shapeDim.setMaxp(shape.getBooking_options().getMaxPersons());
                        shapeDim.setSid(shape.getSid());
                        shapeDim.setPersons(sid2persons.get(shape.getSid()));
                        shapeDims.add(shapeDim);
                    }
                }
                bookingPlaceView.setFloorID(floor.getFloorid());
                bookingPlaceView.setFloorName(floor.getFloor_name());
                bookingPlaceView.setHeight(floor.getState().getHeight());
                bookingPlaceView.setWidth(floor.getState().getWidth());
                bookingPlaceView.setUserID(usernameRandom);
                bookingPlaceView.setShapes(shapeDims);
                floors.add(bookingPlaceView);
            }
        }
        return floors;
    }
    public AJAXImagesJSON getBaseData(Entity csEntity, DatastoreService datastore) {
        AJAXImagesJSON CanvasStateEdit = new AJAXImagesJSON();
        String shapesJSON = ((Text) csEntity.getProperty("shapesJSON")).getValue();
        String sid2ImageIDJSON = ((Text) csEntity.getProperty("sid2ImageIDJSON")).getValue();
        String placeID = (String) csEntity.getProperty("placeUniqID");
        String placeName = (String) csEntity.getProperty("placeName");
        String placeBranchName = (String) csEntity.getProperty("placeBranchName");
        String usernameRandom = (String) csEntity.getProperty("usernameRandom");
        double UTCoffcet = 0;
        if (csEntity.getProperty("UTCoffcet") == null) {
            UTCoffcet = (double) 0;
        } else {
            UTCoffcet = (double) csEntity.getProperty("UTCoffcet");

        }

        Type CanvasListcollectionType = new TypeToken<List<PPSubmitObject>>() {
        }.getType();
        List<PPSubmitObject> floors = JsonUtils.deserialize(shapesJSON, CanvasListcollectionType);
        // Restore shapes booking options
        Integer maxPersons = 0;
        Integer minPersons_ = 10000;
        for (PPSubmitObject floor : floors) {
            for (CanvasShape shape : floor.getShapes()) {
                maxPersons += shape.getBooking_options().getMaxPersons();
                if (minPersons_ > shape.getBooking_options().getMinPersons()) {
                    minPersons_ = shape.getBooking_options().getMinPersons();
                }
                for (Integer i = shape.getBooking_options().getMinPersons(); i <= shape.getBooking_options().getMaxPersons(); i++) {
                    CanvasStateEdit.getPersonsList().add(i);
                }
            }
            String floorID = floor.getFloorid();

            if (!floor.getState().getBackgroundType().contains("color")) {

                String fileName_ = usernameRandom + "/" + placeID + "/" + "main" + "/" + floorID + "/backgroundImage.png";

                String bucket = "pp_images";
                GcsFilename gcsFilename = new GcsFilename(bucket, fileName_);
                ImagesService is = ImagesServiceFactory.getImagesService();
                String filename = String.format("/gs/%s/%s", gcsFilename.getBucketName(), gcsFilename.getObjectName());

                String servingUrl = is.getServingUrl(ServingUrlOptions.Builder.withGoogleStorageFileName(filename));
                servingUrl = servingUrl.concat("=s0");

                floor.setBackground(servingUrl);
            } else {
                floor.setBackground("");

            }

            String fileName_ = usernameRandom + "/" + placeID + "/" + "main" + "/" + floorID + "/overview.png";
            System.out.println(fileName_);


            String bucket = "pp_images";
            GcsFilename gcsFilename = new GcsFilename(bucket, fileName_);
            ImagesService is = ImagesServiceFactory.getImagesService();
            String filename = String.format("/gs/%s/%s", gcsFilename.getBucketName(), gcsFilename.getObjectName());
            String servingUrl = is.getServingUrl(ServingUrlOptions.Builder.withGoogleStorageFileName(filename).secureUrl(true));
            servingUrl = servingUrl + "=s" + 300;
            floor.setAllImageSrc(servingUrl);
        }
        Type collectionType = new TypeToken<List<JsonSID_2_imgID>>() {
        }.getType();
        List<JsonSID_2_imgID> sid2imgID = JsonUtils.deserialize(sid2ImageIDJSON, collectionType);
        if (sid2imgID.isEmpty()) {
            System.out.println("sid2imgID = null");
            sid2imgID = null;
        } else {
            System.out.println("sid2imgID =" + sid2imgID);
        }

        CanvasStateEdit.setJSONSIDlinks(sid2imgID);
        CanvasStateEdit.setPlace_(placeName);
        CanvasStateEdit.setSnif_(placeBranchName);
        CanvasStateEdit.setPlaceName(placeName);
        CanvasStateEdit.setBranchName(placeBranchName);
        CanvasStateEdit.setUsernameRandom(usernameRandom);
        CanvasStateEdit.setPlaceID(placeID);
        CanvasStateEdit.setUTCoffset(UTCoffcet);
        CanvasStateEdit.setPlaceMaxPersons(maxPersons);
        CanvasStateEdit.setPlaceMinimumPersons(minPersons_);
        //CanvasStateEdit.setBackground(servingUrl);
        //CanvasStateEdit.getJSONimageID2url().add(imgID2url);

        // Updating images URLs
        // Updating background
        // Updating Images used
        Map<String, String> gcsurlUpdated = new HashMap<String, String>();
        if (sid2imgID != null) {
            for (JsonSID_2_imgID shapeImgData : sid2imgID) {
                String imgID = shapeImgData.getImageID();
                if (!gcsurlUpdated.containsKey(imgID)) {
                    String fileName = usernameRandom + "/" + placeID + "/" + "main" + "/" + imgID + ".png";
                    String bucket = "pp_images";
                    GcsFilename gcsFilename = new GcsFilename(bucket, fileName);
                    ImagesService is = ImagesServiceFactory.getImagesService();
                    String filename = String.format("/gs/%s/%s", gcsFilename.getBucketName(), gcsFilename.getObjectName());
                    String servingUrl = is.getServingUrl(ServingUrlOptions.Builder.withGoogleStorageFileName(filename).secureUrl(true));
                    JsonImageID_2_GCSurl imgID2url = new JsonImageID_2_GCSurl();
                    imgID2url.setImageID(imgID);
                    imgID2url.setGcsUrl(servingUrl);
                    gcsurlUpdated.put(imgID, imgID);
                    CanvasStateEdit.getJSONimageID2url().add(imgID2url);
                }

            }
        }

        CanvasStateEdit.setFloors(floors);

        //Update configuration variables
        String address;
        if (csEntity.getProperty("address") != null) {
            address = (String) csEntity.getProperty("address");
        } else {
            address = "";
        }
        String lat;
        if (csEntity.getProperty("lat") != null) {
            lat = (String) csEntity.getProperty("lat");
        } else {
            lat = "";
        }
        String lng;
        if (csEntity.getProperty("lng") != null) {
            lng = (String) csEntity.getProperty("lng");
        } else {
            lng = "";
        }
        String placePhone;
        if (csEntity.getProperty("placePhone") != null) {
            placePhone = (String) csEntity.getProperty("placePhone");
        } else {
            placePhone = "";
        }
        String placeFax;
        if (csEntity.getProperty("placeFax") != null) {
            placeFax = (String) csEntity.getProperty("placeFax");
        } else {
            placeFax = "";
        }
        String placeMail;
        if (csEntity.getProperty("placeMail") != null) {
            placeMail = (String) csEntity.getProperty("placeMail");
        } else {
            placeMail = "";
        }
        String placeURL;
        if (csEntity.getProperty("placeURL") != null) {
            placeURL = (String) csEntity.getProperty("placeURL");
        } else {
            placeURL = "";
        }
        String placeDescription = "";
        if (csEntity.getProperty("placeDescription") != null) {
            placeDescription = (String) csEntity.getProperty("placeDescription");
        }
        boolean automatic_approval = true;
        if (csEntity.getProperty("automatic_approval") != null) {
            automatic_approval = (boolean) csEntity.getProperty("automatic_approval");
        }

        List<Integer> closeDates = new ArrayList<Integer>();
        if (csEntity.getProperty("closeDates") != null) {
            String closeDatesJSON = (String) csEntity.getProperty("closeDates");
            collectionType = new TypeToken<List<Integer>>() {
            }.getType();
            closeDates = JsonUtils.deserialize(closeDatesJSON, collectionType);
        }
        Collections.sort(closeDates);
        WorkingWeek workinghours = new WorkingWeek();
        if (csEntity.getProperty("workinghours") != null) {
            String workinghoursJSON = (String) csEntity.getProperty("workinghours");
            System.out.println(workinghoursJSON);
            collectionType = new TypeToken<WorkingWeek>() {
            }.getType();
            workinghours = JsonUtils.deserialize(workinghoursJSON, collectionType);
        }

        CanvasStateEdit.setAddress(address);
        CanvasStateEdit.setLat(lat);
        CanvasStateEdit.setLng(lng);
        CanvasStateEdit.setPlacePhone(placePhone);
        CanvasStateEdit.setPlaceFax(placeFax);
        CanvasStateEdit.setPlaceMail(placeMail);
        CanvasStateEdit.setPlaceURL(placeURL);
        CanvasStateEdit.setPlaceDescription(placeDescription);
        CanvasStateEdit.setAutomatic_approval(automatic_approval);
        CanvasStateEdit.setCloseDates(closeDates);
        CanvasStateEdit.setWorkinghours(workinghours);

        // Update logo and images
        String logoUrl = "";
        if (csEntity.getProperty("logo") != null && !((String) csEntity.getProperty("logo")).isEmpty() && (String) csEntity.getProperty("logo") != "") {
            String bucket = "pp_images";
            String logoFileName = (String) csEntity.getProperty("logo");
            GcsFilename gcsFilename = new GcsFilename(bucket, logoFileName);
            System.out.println("LOGO Upload:" + gcsFilename);
            ImagesService is = ImagesServiceFactory.getImagesService();
            String filename = String.format("/gs/%s/%s", gcsFilename.getBucketName(), gcsFilename.getObjectName());
            logoUrl = is.getServingUrl(ServingUrlOptions.Builder.withGoogleStorageFileName(filename));
            logoUrl = logoUrl + "=s150";
        }
        CanvasStateEdit.setLogosrc(logoUrl);
        return CanvasStateEdit;
    }
}
