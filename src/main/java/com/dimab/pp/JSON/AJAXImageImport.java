package com.dimab.pp.JSON;

import com.dimab.pickoplace.entity.EntityKind;
import com.dimab.pickoplace.json.GsonUtils;
import com.dimab.pp.dto.*;
import com.dimab.pp.login.CheckTokenValid;
import com.dimab.pp.login.GenericUser;
import com.dimab.pp.search.SearchFabric;
import com.google.appengine.api.datastore.*;
import com.google.appengine.api.datastore.Query.CompositeFilterOperator;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.appengine.tools.cloudstorage.*;
import com.google.gson.reflect.TypeToken;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.lang.reflect.Type;
import java.nio.channels.Channels;
import java.util.*;


public class AJAXImageImport extends HttpServlet {

    private final GcsService gcsService = GcsServiceFactory.createGcsService(new RetryParams.Builder()
            .initialRetryDelayMillis(10)
            .retryMaxAttempts(10)
            .totalRetryPeriodMillis(15000)
            .build());

    /**
     * Used below to determine the size of chucks to read in. Should be > 1kb and < 10MB
     */
    private static final int BUFFER_SIZE = 2 * 1024 * 1024;

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("status", "OK");

        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        TransactionOptions options = TransactionOptions.Builder.withXG(true);
        Transaction txn = datastore.beginTransaction(options);
        Date date = new Date();

        String username_email = new String();
        CheckTokenValid tokenValid = new CheckTokenValid(request);
        GenericUser genuser = new GenericUser();
        try {
            genuser = tokenValid.getUser();
        } catch (NullPointerException e) {
            String returnurl = "/welcome.jsp";
            response.addHeader("Access-Control-Allow-Origin", "*");
            response.sendRedirect(returnurl);
        }

        if (genuser == null) {
            String returnurl = "/welcome.jsp";
            response.addHeader("Access-Control-Allow-Origin", "*");
            response.sendRedirect(returnurl);
        } else {
            username_email = genuser.getEmail();
        }

        String jsonString = request.getParameter("jsonObject");
        AJAXImagesJSON SaveObject = GsonUtils.fromJson(jsonString, AJAXImagesJSON.class);
        String stage = SaveObject.getStage();
        String userRandom = "";
        GeoPt center = new GeoPt(Float.valueOf(SaveObject.getLat()), Float.valueOf(SaveObject.getLng()));

        Filter UserExists = new FilterPredicate("username", FilterOperator.EQUAL, username_email);
        Query q = new Query(EntityKind.Users).setFilter(UserExists);
        PreparedQuery pq = datastore.prepare(q);
        Entity result = pq.asSingleEntity();
        if (result != null) {
            String placeID = SaveObject.getPlaceID();

            Type collectionType = new TypeToken<List<String>>() {
            }.getType();
            List<String> fa_list = new ArrayList<String>();
            List<String> ep_list = new ArrayList<String>();
            List<String> mo_list = new ArrayList<String>();
            List<String> ba_list = new ArrayList<String>();
            if (result.getProperty("PID_full_access") != null) {
                fa_list = GsonUtils.fromJson((String) result.getProperty("PID_full_access"), collectionType);
            }
            if (result.getProperty("PID_edit_place") != null) {
                ep_list = GsonUtils.fromJson((String) result.getProperty("PID_edit_place"), collectionType);
            }
            if (result.getProperty("PID_move_only") != null) {
                mo_list = GsonUtils.fromJson((String) result.getProperty("PID_move_only"), collectionType);
            }
            if (result.getProperty("PID_book_admin") != null) {
                ba_list = GsonUtils.fromJson((String) result.getProperty("PID_book_admin"), collectionType);
            }
            if (!fa_list.contains(placeID)) {
                fa_list.add(placeID);
                result.setUnindexedProperty("PID_full_access", GsonUtils.toJson(fa_list));
            }
            if (!ep_list.contains(placeID)) {
                ep_list.add(placeID);
                result.setUnindexedProperty("PID_edit_place", GsonUtils.toJson(ep_list));
            }
            if (!mo_list.contains(placeID)) {
                mo_list.add(placeID);
                result.setUnindexedProperty("PID_move_only", GsonUtils.toJson(mo_list));
            }
            if (!ba_list.contains(placeID)) {
                ba_list.add(placeID);
                result.setUnindexedProperty("PID_book_admin", GsonUtils.toJson(ba_list));
            }
            datastore.put(result);

            userRandom = (String) result.getProperty("UserID");

            //String username = CI.getUser_();
            String place = SaveObject.getPlace_();
            String snif = SaveObject.getSnif_();
            List<JsonimgID_2_data> JSONbyte64files = SaveObject.getJSONbyte64files();
            //System.out.println(JSONSIDlinks.toString());
            GcsFileOptions.Builder optionsBuilder = new GcsFileOptions.Builder();
            GcsOutputChannel outputChannel;

            System.out.println("SAVING Canvas Images: USER='" + username_email + "', USER_RANDOM='" + userRandom + "',PLACE'" + place + "',SNIF='" + snif + "',PID='" + placeID);

            final GcsService gcsService = GcsServiceFactory.createGcsService(RetryParams.getDefaultInstance());
            // Floor loop
            String mainFloorID = "";
            int backgroundVersion;
            int backgroundOnlyVersion;
            int overviewVersion;

            Entity imageVersionEntity;
            Entity canvasState;
            Entity userPlaceEntity;
            Entity freeSpaceEntity;

            Filter userPlaceEntityFilterByPlaceName = new FilterPredicate("placeName", FilterOperator.EQUAL, place);
            Filter userPlaceEntityFilterByBranchName = new FilterPredicate("placeBranchName", FilterOperator.EQUAL, snif);
            Filter userPlaceEntityFilterByID = new FilterPredicate("placeUniqID", FilterOperator.EQUAL, placeID);
            Filter PlaceAndBranch = CompositeFilterOperator.and(userPlaceEntityFilterByPlaceName, userPlaceEntityFilterByBranchName, userPlaceEntityFilterByID);
            Query q_ = new Query("UserPlace").setFilter(PlaceAndBranch);
            PreparedQuery pq_ = datastore.prepare(q_);
            userPlaceEntity = pq_.asSingleEntity();


            // Load Entities
            try {
                Key pidkey = KeyFactory.createKey("ImageVersion", placeID);
                System.out.println("ImageVersion KEY:" + pidkey);
                imageVersionEntity = datastore.get(pidkey);
            } catch (EntityNotFoundException e) {
                map.put("status", "No-ImageVersion-Exists");
                response.setContentType("application/json");
                response.setCharacterEncoding("UTF-8");
                response.getWriter().write(GsonUtils.toJson(map));
                return;
            }
            try {
                Key pidkey = KeyFactory.createKey(userPlaceEntity.getKey(), "CanvasState", placeID);
                System.out.println("CanvasState KEY" + pidkey);
                canvasState = datastore.get(pidkey);
            } catch (EntityNotFoundException e) {
                map.put("status", "No-CanvasState-Exists");
                response.setContentType("application/json");
                response.setCharacterEncoding("UTF-8");
                response.getWriter().write(GsonUtils.toJson(map));
                return;
            }

            // Update Image Version
            if (imageVersionEntity.getProperty("backgroundVersion") != null) {
                backgroundVersion = (int) (long) imageVersionEntity.getProperty("backgroundVersion");
            } else {
                backgroundVersion = 0;
            }
            if (imageVersionEntity.getProperty("overviewVersion") != null) {
                overviewVersion = (int) (long) imageVersionEntity.getProperty("overviewVersion");
            } else {
                overviewVersion = 0;
            }
            if (imageVersionEntity.getProperty("backgroundOnlyVersion") != null) {
                backgroundOnlyVersion = (int) (long) imageVersionEntity.getProperty("backgroundOnlyVersion");
            } else {
                backgroundOnlyVersion = 0;
            }
            backgroundVersion += 1;
            overviewVersion += 1;
            backgroundOnlyVersion += 1;
            imageVersionEntity.setUnindexedProperty("overviewVersion", overviewVersion);
            imageVersionEntity.setUnindexedProperty("backgroundVersion", backgroundVersion);

            if (!stage.equals("Configuration")) {
                imageVersionEntity.setUnindexedProperty("backgroundOnlyVersion", backgroundOnlyVersion);
            }

            datastore.put(imageVersionEntity);

            for (PPSubmitObject floor : SaveObject.getFloors()) {
                String backgroundByte64image = floor.getBackground();
                String backgroundOnlyByte64image = floor.getBgImageSrc();
                String overviewByte64image = floor.getAllImageSrc();
                String floorID = floor.getFloorid();
                boolean mainfloor = floor.isMainfloor();
                if (mainfloor) {
                    mainFloorID = floorID;
                }

                String backgroundFileName;
                String OverviewFileName;
                String BGOnlyFileName;
                // Delete previous versions
                backgroundVersion -= 1;
                overviewVersion -= 1;
                backgroundOnlyVersion -= 1;
                backgroundFileName = userRandom + "/" + place + "/" + snif + "/" + placeID + "/" + "main" + "/" + floorID + "/backgroundImage" + "_" + backgroundVersion + ".png";
                OverviewFileName = userRandom + "/" + place + "/" + snif + "/" + placeID + "/" + "main" + "/" + floorID + "/overview" + "_" + overviewVersion + ".png";
                BGOnlyFileName = userRandom + "/" + place + "/" + snif + "/" + placeID + "/" + "main" + "/" + floorID + "/bgonly" + "_" + backgroundOnlyVersion + ".png";
                GcsFilename bname = new GcsFilename("pp_images", backgroundFileName);
                GcsFilename bgname = new GcsFilename("pp_images", BGOnlyFileName);
                GcsFilename oname = new GcsFilename("pp_images", OverviewFileName);
                gcsService.delete(bname);
                gcsService.delete(oname);

                if (!stage.equals("Configuration")) {
                    gcsService.delete(bgname);
                }

                // Update new Version
                backgroundVersion += 1;
                overviewVersion += 1;
                backgroundOnlyVersion += 1;
                backgroundFileName = userRandom + "/" + place + "/" + snif + "/" + placeID + "/" + "main" + "/" + floorID + "/backgroundImage" + "_" + backgroundVersion + ".png";
                OverviewFileName = userRandom + "/" + place + "/" + snif + "/" + placeID + "/" + "main" + "/" + floorID + "/overview" + "_" + overviewVersion + ".png";
                BGOnlyFileName = userRandom + "/" + place + "/" + snif + "/" + placeID + "/" + "main" + "/" + floorID + "/bgonly" + "_" + backgroundOnlyVersion + ".png";


                // Saving background image
                if (backgroundByte64image != null) {
                    String[] imageInfo = backgroundByte64image.split(",");
                    GcsFilename name = new GcsFilename("pp_images", backgroundFileName);
                    optionsBuilder.mimeType("image/png");
                    outputChannel = gcsService.createOrReplace(name, optionsBuilder.build());
                    copy(decodeBytes(imageInfo[1]), Channels.newOutputStream(outputChannel));
                    System.out.println("Background Image = " + name);
                }
                // Saving overview image
                String[] OimageInfo = overviewByte64image.split(",");
                GcsFilename Oname = new GcsFilename("pp_images", OverviewFileName);
                optionsBuilder.mimeType("image/png");
                outputChannel = gcsService.createOrReplace(Oname, optionsBuilder.build());
                copy(decodeBytes(OimageInfo[1]), Channels.newOutputStream(outputChannel));
                System.out.println("Overview Image = " + Oname);

                // Saving Background without bookable shapes
                if (!stage.equals("Configuration")) {
                    String[] BGimageInfo = backgroundOnlyByte64image.split(",");
                    GcsFilename BGname = new GcsFilename("pp_images", BGOnlyFileName);
                    optionsBuilder.mimeType("image/png");
                    outputChannel = gcsService.createOrReplace(BGname, optionsBuilder.build());
                    copy(decodeBytes(BGimageInfo[1]), Channels.newOutputStream(outputChannel));
                    System.out.println("BG Only Image = " + Oname);
                }
            }
            ///-------------------------------------------------------------
            // Saving shapes images
            if (!stage.equals("Configuration")) {
                // Shapes images not edited in the "Configuration" stage
                for (JsonimgID_2_data imgID2byte64 : JSONbyte64files) {

                    String imgID = imgID2byte64.getImageID();
                    String data64 = imgID2byte64.getData64();
                    String fileName = userRandom + "/" + place + "/" + snif + "/" + placeID + "/" + "main" + "/" + imgID + ".png";
                    System.out.println(fileName);
                    GcsFilename Sname = new GcsFilename("pp_images", fileName);

                    if (gcsService.getMetadata(Sname) == null) {
                        // GCS file(image in that case) doesn't exists.
                        String[] SimageInfo = data64.split(",");
                        optionsBuilder.mimeType("image/png");
                        outputChannel = gcsService.createOrReplace(Sname, optionsBuilder.build());
                        copy(decodeBytes(SimageInfo[1]), Channels.newOutputStream(outputChannel));
                        System.out.println("Shapes Image = " + Sname);
                    } else {
                        System.out.println("GCS image with this ID already exists:" + gcsService.getMetadata(Sname).getLength());
                    }

                }
            }
            // Saving Canvas object
            List<PPSubmitObject> CanvasObjectList = SaveObject.getFloors();
            List<JsonSID_2_imgID> sid2ImageID = SaveObject.getJSONSIDlinks();
            int mk = 0;
            for (PPSubmitObject floor : CanvasObjectList) {
                floor.setUsername(userRandom);
                floor.setBackground("");
                floor.setAllImageSrc("");
                floor.setBgImageSrc("");
                String name = "";
                for (CanvasShape shape : floor.getShapes()) {
                    ShapeBookingOptions bookingOptions = shape.getBooking_options();
                    if (bookingOptions.getGivenName() != null) {
                        name = bookingOptions.getGivenName();
                    } else {
                        mk += 1;
                        name = "S" + mk;
                        //  name = name.replaceAll(" ", "_");
                        shape.getBooking_options().setGivenName(name);
                    }
                }
            }

            String canvasStateJSON = GsonUtils.toJson(CanvasObjectList);
            String sid2ImageIDJSON = GsonUtils.toJson(sid2ImageID);
            Text TcanvasStateJSON = new Text(canvasStateJSON);
            Text Tsid2ImageIDJSON = new Text(sid2ImageIDJSON);
            System.out.println("Canvas JSON:" + canvasStateJSON);

            if (canvasState.getProperty("bookingsCount") == null) {
                // Initial save
                AdminUser adminAccess = new AdminUser();
                adminAccess.setMail(username_email);
                adminAccess.setFull_access(true);
                adminAccess.setEdit_place(true);
                adminAccess.setMove_only(true);
                adminAccess.setBook_admin(true);
                List<AdminUser> adminList = new ArrayList<AdminUser>();
                adminList.add(adminAccess);

                canvasState.setUnindexedProperty("DateCreated", date.toString());
                canvasState.setUnindexedProperty("DateCreatedSec", date.getTime() / 1000);
                canvasState.setUnindexedProperty("logo", "");
                canvasState.setUnindexedProperty("placePhone", SaveObject.getPlacePhone());
                canvasState.setUnindexedProperty("placeFax", SaveObject.getPlaceFax());
                canvasState.setUnindexedProperty("placeMail", SaveObject.getPlaceMail());
                canvasState.setUnindexedProperty("placeURL", SaveObject.getPlaceURL());
                canvasState.setUnindexedProperty("placeDescription", SaveObject.getPlaceDescription());
                canvasState.setUnindexedProperty("automatic_approval", SaveObject.isAutomatic_approval());
                canvasState.setUnindexedProperty("automaticApprovalList", GsonUtils.toJson(SaveObject.getAutomaticApprovalList()));
                canvasState.setUnindexedProperty("adminApprovalList", GsonUtils.toJson(SaveObject.getAdminApprovalList()));
                canvasState.setUnindexedProperty("placeEditList", GsonUtils.toJson(adminList));
                canvasState.setUnindexedProperty("closeDates", GsonUtils.toJson(SaveObject.getCloseDates()));
                canvasState.setUnindexedProperty("workinghours", GsonUtils.toJson(SaveObject.getWorkinghours()));
                canvasState.setUnindexedProperty("UTCoffcet", SaveObject.getUTCoffset());
                canvasState.setUnindexedProperty("bookingsCount", 0);
                canvasState.setProperty("TotalRating", (double) 0);
                ArrayList<String> typeList = new ArrayList<String>();
                typeList.add("AnyType");
                ArrayList<String> SubTypeList = new ArrayList<String>();
                SubTypeList.add("AnyType");
                canvasState.setProperty("PlaceType", typeList);
                canvasState.setProperty("PlaceSubType", SubTypeList);
            }

            canvasState.setProperty("username", username_email);
            canvasState.setProperty("usernameRandom", userRandom);
            canvasState.setProperty("placeName", place);
            canvasState.setProperty("placeBranchName", snif);
            canvasState.setProperty("UserPlaceDBKey", userPlaceEntity.getKey());
            canvasState.setUnindexedProperty("shapesJSON", TcanvasStateJSON);
            canvasState.setUnindexedProperty("sid2ImageIDJSON", Tsid2ImageIDJSON);
            canvasState.setProperty("placeUniqID", placeID);
            canvasState.setProperty("DateUpdated", date.toString());
            canvasState.setProperty("DateUpdatedSec", date.getTime() / 1000);
            canvasState.setUnindexedProperty("UTCoffcet", (double) userPlaceEntity.getProperty("UTCoffcet"));
            canvasState.setProperty("mainFloorID", mainFloorID);
            userPlaceEntity.setProperty("mainFloorID", mainFloorID);


            // Configuration section

            canvasState.setUnindexedProperty("address", SaveObject.getAddress());
            canvasState.setUnindexedProperty("lat", SaveObject.getLat());
            canvasState.setUnindexedProperty("lng", SaveObject.getLng());
            canvasState.setProperty("location", center);
            if (stage.equals("Configuration")) {

                canvasState.setUnindexedProperty("placePhone", SaveObject.getPlacePhone());
                canvasState.setUnindexedProperty("placeFax", SaveObject.getPlaceFax());
                canvasState.setUnindexedProperty("placeMail", SaveObject.getPlaceMail());
                canvasState.setUnindexedProperty("placeURL", SaveObject.getPlaceURL());
                canvasState.setUnindexedProperty("placeDescription", SaveObject.getPlaceDescription());
                canvasState.setUnindexedProperty("automatic_approval", SaveObject.isAutomatic_approval());
                canvasState.setUnindexedProperty("automaticApprovalList", GsonUtils.toJson(SaveObject.getAutomaticApprovalList()));
                canvasState.setUnindexedProperty("adminApprovalList", GsonUtils.toJson(SaveObject.getAdminApprovalList()));
                canvasState.setUnindexedProperty("placeEditList", GsonUtils.toJson(SaveObject.getPlaceEditList()));
                canvasState.setUnindexedProperty("closeDates", GsonUtils.toJson(SaveObject.getCloseDates()));
                canvasState.setUnindexedProperty("workinghours", GsonUtils.toJson(SaveObject.getWorkinghours()));
                canvasState.setUnindexedProperty("UTCoffcet", SaveObject.getUTCoffset());


                List<AdminUser> placeEditList = SaveObject.getPlaceEditList();
                for (AdminUser auser : placeEditList) {
                    Filter UserExists__ = new FilterPredicate("username", FilterOperator.EQUAL, auser.getMail());
                    Query q__ = new Query(EntityKind.Users).setFilter(UserExists__);
                    PreparedQuery pq__ = datastore.prepare(q__);
                    Entity result__ = pq__.asSingleEntity();
                    if (result__ != null) {
                        if (auser.isFull_access()) {
                            List<String> fa_list__ = new ArrayList<String>();
                            if (result__.getProperty("PID_full_access") != null) {
                                fa_list__ = GsonUtils.fromJson((String) result__.getProperty("PID_full_access"), collectionType);

                            }
                            if (!fa_list__.contains(placeID)) {
                                fa_list__.add(placeID);
                                result__.setUnindexedProperty("PID_full_access", GsonUtils.toJson(fa_list__));
                            }
                        }
                        if (auser.isEdit_place()) {
                            List<String> ep_list__ = new ArrayList<String>();
                            if (result__.getProperty("PID_edit_place") != null) {
                                ep_list__ = GsonUtils.fromJson((String) result__.getProperty("PID_edit_place"), collectionType);

                            }
                            if (!ep_list__.contains(placeID)) {
                                ep_list__.add(placeID);
                                result__.setUnindexedProperty("PID_edit_place", GsonUtils.toJson(ep_list__));
                            }
                        }
                        if (auser.isMove_only()) {
                            List<String> mo_list__ = new ArrayList<String>();
                            if (result__.getProperty("PID_move_only") != null) {
                                mo_list__ = GsonUtils.fromJson((String) result__.getProperty("PID_move_only"), collectionType);

                            }
                            if (!mo_list__.contains(placeID)) {
                                mo_list__.add(placeID);
                                result__.setUnindexedProperty("PID_move_only", GsonUtils.toJson(mo_list__));
                            }
                        }
                        if (auser.isBook_admin()) {
                            List<String> ba_list__ = new ArrayList<String>();
                            if (result__.getProperty("PID_book_admin") != null) {
                                ba_list__ = GsonUtils.fromJson((String) result__.getProperty("PID_book_admin"), collectionType);

                            }
                            if (!ba_list__.contains(placeID)) {
                                ba_list__.add(placeID);
                                result__.setUnindexedProperty("PID_book_admin", GsonUtils.toJson(ba_list__));
                            }
                        }
                        datastore.put(result__);

                    } else {
                        System.out.println("Admin User account doesnt exists:" + auser.getMail());
                    }

                }
                userPlaceEntity.setProperty("placeName", place);
                userPlaceEntity.setProperty("placeBranchName", snif);
                userPlaceEntity.setProperty("placeAddress", SaveObject.getAddress());
                userPlaceEntity.setUnindexedProperty("UTCoffcet", SaveObject.getUTCoffset());
                userPlaceEntity.setProperty("placeLat", Double.parseDouble(SaveObject.getLat()));
                userPlaceEntity.setProperty("placeLng", Double.parseDouble(SaveObject.getLng()));
                userPlaceEntity.setUnindexedProperty("placePhone", SaveObject.getPlacePhone());
                userPlaceEntity.setUnindexedProperty("placeFax", SaveObject.getPlaceFax());
                userPlaceEntity.setProperty("location", center);
            }
            if (stage.equals("Configuration")) {
                // Update Logo And photos
                String logo = "logo";
                String data64 = SaveObject.getLogosrc();
                if (data64 == null || data64.isEmpty() || data64 == "") {
                    canvasState.setUnindexedProperty("logo", "");
                } else {
                    String fileName = userRandom + "/" + place + "/" + snif + "/" + placeID + "/" + "main" + "/" + logo + ".png";
                    System.out.println("Saving Logo:" + fileName);
                    String[] SimageInfo = data64.split(",");
                    GcsFilename Sname = new GcsFilename("pp_images", fileName);
                    optionsBuilder.mimeType("image/png");
                    outputChannel = gcsService.createOrReplace(Sname, optionsBuilder.build());
                    copy(decodeBytes(SimageInfo[1]), Channels.newOutputStream(outputChannel));
                    canvasState.setUnindexedProperty("logo", fileName);
                }
            }

            List<String> prevPhotosList = new ArrayList<String>();
            List<String> photosList = new ArrayList<String>();

            if (stage.equals("Configuration")) {
                if (canvasState.getProperty("photos") != null) {
                    collectionType = new TypeToken<List<String>>() {
                    }.getType();
                    prevPhotosList = GsonUtils.fromJson((String) canvasState.getProperty("photos"), collectionType);
                }


                for (JsonimgID_2_data imgID2byte64 : SaveObject.getPlacePhotos()) {
                    // Save Photos
                    String imgID = imgID2byte64.getImageID();
                    Integer width = imgID2byte64.getWidth();
                    Integer height = imgID2byte64.getHeight();
                    if (prevPhotosList.indexOf(imgID) == -1) {
                        // New image ID - considered as new image
                        String data64 = imgID2byte64.getData64();
                        String fileName = userRandom + "/" + place + "/" + snif + "/" + placeID + "/" + "main" + "/photos/" + imgID + ".png";
                        System.out.println("Saving Place Photo:" + fileName);
                        String[] SimageInfo = data64.split(",");
                        GcsFilename Sname = new GcsFilename("pp_images", fileName);
                        optionsBuilder = new GcsFileOptions.Builder();
                        optionsBuilder.mimeType("image/png");
                        optionsBuilder.addUserMetadata("width", width.toString());
                        optionsBuilder.addUserMetadata("height", height.toString());
                        outputChannel = gcsService.createOrReplace(Sname, optionsBuilder.build());
                        copy(decodeBytes(SimageInfo[1]), Channels.newOutputStream(outputChannel));
                    }
                    photosList.add(imgID);
                }
                for (String imgID : prevPhotosList) {
                    // Run on old photo ID's
                    int idx = photosList.indexOf(imgID);
                    if (idx == -1) {
                        // If ID not exists anymore , the image should be removed from the Cloud Storage
                        String fileName = userRandom + "/" + place + "/" + snif + "/" + placeID + "/" + "main" + "/photos/" + imgID + ".png";
                        gcsService.delete(new GcsFilename("pp_images", fileName));
                    }
                }
                canvasState.setUnindexedProperty("photos", GsonUtils.toJson(photosList));
            }

            SearchFabric searchIndexFabrix = new SearchFabric();
            searchIndexFabrix.CreatePlaceDocument(canvasState);
            datastore.put(canvasState);
            datastore.put(userPlaceEntity);

            Key canvasStateKey = canvasState.getKey();
            int k = 0;
            for (PPSubmitObject floor : CanvasObjectList) {

                String floor_id = floor.getFloorid();
                for (CanvasShape shape : floor.getShapes()) {
                    k += 1;
                    ShapeBookingOptions bookingOptions = shape.getBooking_options();
                    String sid = shape.getSid();

                    Filter shapeSIODFilter = new FilterPredicate("sid", FilterOperator.EQUAL, sid);
                    Query sbq = new Query("Shapes").setFilter(shapeSIODFilter);
                    PreparedQuery sbpq = datastore.prepare(sbq);
                    Entity shapeBooking = sbpq.asSingleEntity();
                    if (shapeBooking == null) {
                        shapeBooking = new Entity("Shapes", userPlaceEntity.getKey());
                    }


                    shapeBooking.setProperty("CanvasStateKey", canvasStateKey);
                    shapeBooking.setProperty("floor_id", floor_id);
                    shapeBooking.setProperty("sid", sid);
                    shapeBooking.setUnindexedProperty("name", bookingOptions.getGivenName());
                    shapeBooking.setProperty("minP", bookingOptions.getMinPersons());
                    shapeBooking.setProperty("maxP", bookingOptions.getMaxPersons());
                    shapeBooking.setUnindexedProperty("description", bookingOptions.getDescription());
                    datastore.put(shapeBooking);
                }

            }

            txn.commit();
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(GsonUtils.toJson(map));
            return;

        } else {
            // No user exists
            map.put("status", "No-User-Entity-Exists");
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(GsonUtils.toJson(map));

            return;
        }

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

    public byte[] decodeBytes(String mBytes) {
        return com.google.api.client.util.Base64.decodeBase64(mBytes);
    }
}
