package com.dimab.pp.JSON;

import com.dimab.pickoplace.utils.JsonUtils;
import com.dimab.pp.dto.*;
import com.dimab.pp.login.CheckTokenValid;
import com.dimab.pp.login.GenericUser;
import com.dimab.pp.search.SearchFabric;
import com.fasterxml.jackson.annotation.JsonUnwrapped;
import com.google.appengine.api.datastore.*;
import com.google.appengine.tools.cloudstorage.*;
import com.google.gson.reflect.TypeToken;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
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

/**
 * Created by dima on 08-Mar-16.
 */
@WebServlet(name = "SaveConfiguration")
public class SaveConfiguration extends HttpServlet {
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
        ConfigurationObject configuration = JsonUtils.deserialize(jsonString, ConfigurationObject.class);
        GeoPt center = new GeoPt(Float.valueOf(configuration.getPlaceDetails().getGeneral().getLat()),
                Float.valueOf(configuration.getPlaceDetails().getGeneral().getLng()));

        Query.Filter userPlaceEntityFilterByID = new Query.FilterPredicate("placeUniqID", Query.FilterOperator.EQUAL, configuration.getPlaceID());
        Query q_ = new Query("UserPlace").setFilter(userPlaceEntityFilterByID);
        PreparedQuery pq_ = datastore.prepare(q_);
        Entity userPlaceEntity = pq_.asSingleEntity();

        String userRandom = (String) userPlaceEntity.getProperty("usernameRandom");

        Entity canvasState;
        try {
            Key pidkey = KeyFactory.createKey(userPlaceEntity.getKey(), "CanvasState", configuration.getPlaceID());
            System.out.println("CanvasState KEY" + pidkey);
            canvasState = datastore.get(pidkey);
        } catch (EntityNotFoundException e) {
            map.put("status", "No-CanvasState-Exists");
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(JsonUtils.serialize(map));
            return;
        }

        List<PPSubmitObject> CanvasObjectList = configuration.getFloors();
        List<JsonSID_2_imgID> sid2ImageID = configuration.getJSONSIDlinks();

        for (PPSubmitObject floor : CanvasObjectList) {
            floor.setUsername(userRandom);
            floor.setBackground("");
            floor.setAllImageSrc("");
            floor.setBgImageSrc("");
        }


        String canvasStateJSON = JsonUtils.serialize(CanvasObjectList);
        Text TcanvasStateJSON = new Text(canvasStateJSON);

        String shapesJSON = ((Text) canvasState.getProperty("shapesJSON")).getValue();
        Type CanvasListcollectionType = new TypeToken<List<PPSubmitObject>>() {
        }.getType();
        List<PPSubmitObject> prevFloors = JsonUtils.deserialize(shapesJSON, CanvasListcollectionType);
        Map<String, CanvasShape> sidToCShape = new HashMap<String, CanvasShape>();
        for (PPSubmitObject floor : prevFloors) {
            for (CanvasShape shape : floor.getShapes()) {
                sidToCShape.put(shape.getSid(), shape);
            }
        }



        canvasState.setUnindexedProperty("shapesJSON", TcanvasStateJSON);
        canvasState.setProperty("DateUpdated", date.toString());
        canvasState.setProperty("DateUpdatedSec", date.getTime() / 1000);
        canvasState.setUnindexedProperty("UTCoffcet", configuration.getPlaceDetails().getGeneral().getUTCoffset());

        canvasState.setUnindexedProperty("address", configuration.getPlaceDetails().getGeneral().getAddress());
        canvasState.setUnindexedProperty("lat", configuration.getPlaceDetails().getGeneral().getLat());
        canvasState.setUnindexedProperty("lng", configuration.getPlaceDetails().getGeneral().getLng());
        canvasState.setProperty("location", center);
        canvasState.setProperty("placeName", configuration.getPlaceDetails().getGeneral().getPlaceName());
        canvasState.setProperty("placeBranchName", configuration.getPlaceDetails().getGeneral().getBranchName());
        canvasState.setUnindexedProperty("placePhone", configuration.getPlaceDetails().getGeneral().getPlacePhone());
        canvasState.setUnindexedProperty("placeFax", configuration.getPlaceDetails().getGeneral().getPlaceFax());
        canvasState.setUnindexedProperty("placeMail", configuration.getPlaceDetails().getGeneral().getPlaceMail());
        canvasState.setUnindexedProperty("placeURL", configuration.getPlaceDetails().getGeneral().getPlaceURL());
        canvasState.setUnindexedProperty("placeDescription", configuration.getPlaceDetails().getGeneral().getPlaceDescription());


        userPlaceEntity.setProperty("UTCoffcet", configuration.getPlaceDetails().getGeneral().getUTCoffset());
        userPlaceEntity.setProperty("placeName", configuration.getPlaceDetails().getGeneral().getPlaceName());
        userPlaceEntity.setProperty("placeBranchName", configuration.getPlaceDetails().getGeneral().getBranchName());
        userPlaceEntity.setProperty("placeAddress", configuration.getPlaceDetails().getGeneral().getAddress());
        userPlaceEntity.setUnindexedProperty("UTCoffcet", configuration.getPlaceDetails().getGeneral().getLat());
        userPlaceEntity.setProperty("placeLat", Double.parseDouble(configuration.getPlaceDetails().getGeneral().getLat()));
        userPlaceEntity.setProperty("placeLng", Double.parseDouble(configuration.getPlaceDetails().getGeneral().getLng()));
        userPlaceEntity.setUnindexedProperty("placePhone", configuration.getPlaceDetails().getGeneral().getPlacePhone());
        userPlaceEntity.setUnindexedProperty("placeFax", configuration.getPlaceDetails().getGeneral().getPlaceFax());
        userPlaceEntity.setProperty("location", center);

        // Update Logo And photos
        GcsFileOptions.Builder optionsBuilder = new GcsFileOptions.Builder();
        GcsOutputChannel outputChannel;

        if (configuration.getPlaceDetails().getPhotos().getLogosrc() != null && configuration.getPlaceDetails().getPhotos().getLogosrc() != "") {

            String logo = "logo";
            String data64 = configuration.getPlaceDetails().getPhotos().getLogosrc();
            if (data64 == null || data64.isEmpty() || data64 == "") {
                canvasState.setUnindexedProperty("logo", "");
            } else {
                String[] SimageInfo = data64.split(",");
                String byteType = "png";
                if (SimageInfo[0].contains("image/jpeg")) {
                    byteType = "jpg";
                }
                String fileName = userRandom + "/" + configuration.getPlaceID() + "/" + "main" + "/" + logo + "." + byteType;
                System.out.println("Saving Logo:" + fileName);

                GcsFilename Sname = new GcsFilename("pp_images", fileName);
                optionsBuilder.mimeType(SimageInfo[0].replace("data:", "").replace(";base64", ""));
                //optionsBuilder.addUserMetadata("extention",byteType);
                outputChannel = gcsService.createOrReplace(Sname, optionsBuilder.build());
                copy(decodeBytes(SimageInfo[1]), Channels.newOutputStream(outputChannel));
                canvasState.setUnindexedProperty("logo", fileName);
            }
        }

        List<String> prevPhotosList = new ArrayList<String>();
        Map<String,String> prevPhotosListNoExtension = new HashMap<String,String>();
        List<String> photosList = new ArrayList<String>();

        if (configuration.getPlaceDetails().getPhotos().getPlacePhotos() != null &&
                configuration.getPlaceDetails().getPhotos().getPlacePhotos().size() > 0) {
            if (canvasState.getProperty("photos") != null) {
                Type collectionType = new TypeToken<List<String>>() {}.getType();
                prevPhotosList = JsonUtils.deserialize((String) canvasState.getProperty("photos"), collectionType);
            }
            for(String imgIdWithExtension : prevPhotosList) {

                prevPhotosListNoExtension.put(imgIdWithExtension.replace(".png","").replace(".jpg",""),imgIdWithExtension);
            }
            for (JsonimgID_2_data imgID2byte64 : configuration.getPlaceDetails().getPhotos().getPlacePhotos()) {
                // Save Photos
                String imgID = imgID2byte64.getImageID();
                String imgIdPlusExtension = "";
                if (!prevPhotosListNoExtension.containsKey(imgID) && !imgID2byte64.getData64().contains("googleusercontent")) {
                    // New image ID - considered as new image
                    String data64 = imgID2byte64.getData64();
                    String[] SimageInfo = data64.split(",");
                    String byteType = "png";
                    if (SimageInfo[0].contains("image/jpeg")) {
                        byteType = "jpg";
                    }
                    String fileName = userRandom + "/" + configuration.getPlaceID() + "/" + "main" + "/photos/" + imgID + "." + byteType;
                    System.out.println("Saving Place Photo:" + fileName);
                    imgIdPlusExtension = imgID + "." + byteType;
                    GcsFilename Sname = new GcsFilename("pp_images", fileName);
                    optionsBuilder = new GcsFileOptions.Builder();
                    optionsBuilder.mimeType(SimageInfo[0].replace("data:", "").replace(";base64", ""));
                    //optionsBuilder.addUserMetadata("extension",byteType);
                    outputChannel = gcsService.createOrReplace(Sname, optionsBuilder.build());
                    copy(decodeBytes(SimageInfo[1]), Channels.newOutputStream(outputChannel));
                    photosList.add(imgIdPlusExtension);
                } else {
                    photosList.add(prevPhotosListNoExtension.get(imgID));
                }

            }
            for (String imgID : prevPhotosList) {
                // Run on old photo ID's
                int idx = photosList.indexOf(imgID);
                if (idx == -1) {
                    // If ID not exists anymore , the image should be removed from the Cloud Storage
                    // String fileName = userRandom + "/" + configuration.getPlaceID() + "/" + "main" + "/photos/" + imgID + ".png";
                    // gcsService.delete(new GcsFilename("pp_images", fileName));
                }
            }

            canvasState.setUnindexedProperty("photos", JsonUtils.serialize(photosList));
        }
        canvasState.setUnindexedProperty("closeDates", JsonUtils.serialize(configuration.getWorkinghours().getCloseDates()));
        canvasState.setUnindexedProperty("workinghours", JsonUtils.serialize(configuration.getWorkinghours().getWorkingWeek()));

        for (PPSubmitObject floor : CanvasObjectList) {

            for (CanvasShape shape : floor.getShapes()) {
                ShapeBookingOptions bookingOptions = shape.getBooking_options();
                String sid = shape.getSid();

                if (sidToCShape.get(sid).getBooking_options().isBookable() != bookingOptions.isBookable() ||
                    sidToCShape.get(sid).getBooking_options().getGivenName() != bookingOptions.getGivenName() ||
                    sidToCShape.get(sid).getBooking_options().getDescription() != bookingOptions.getDescription() ||
                    sidToCShape.get(sid).getBooking_options().getMinPersons() != bookingOptions.getMinPersons() ||
                    sidToCShape.get(sid).getBooking_options().getMaxPersons() != bookingOptions.getMaxPersons()) {

                    Query.Filter shapeSIODFilter = new Query.FilterPredicate("sid", Query.FilterOperator.EQUAL, sid);
                    Query sbq = new Query("Shapes").setFilter(shapeSIODFilter);
                    PreparedQuery sbpq = datastore.prepare(sbq);
                    Entity shapeBooking = sbpq.asSingleEntity();
                    shapeBooking.setUnindexedProperty("name", bookingOptions.getGivenName());
                    shapeBooking.setProperty("minP", bookingOptions.getMinPersons());
                    shapeBooking.setProperty("maxP", bookingOptions.getMaxPersons());
                    shapeBooking.setUnindexedProperty("description", bookingOptions.getDescription());
                    datastore.put(shapeBooking);
                }

            }

        }

        ConfigBookingProperties prevBookProperties = JsonUtils.deserialize((String) canvasState.getProperty("bookingProperties"), ConfigBookingProperties.class);
        List<String> existingMails = prevBookProperties.getApprovalMails();
        List<String> existingPhones = prevBookProperties.getApprovalPhones();


        ConfigBookingProperties updatedBookingBroperties = configuration.getBookingProperties();
        updatedBookingBroperties.setApprovalMails(existingMails);
        updatedBookingBroperties.setApprovalPhones(existingPhones);
        if(existingMails.size() == 0 && existingPhones.size() == 0) {
            updatedBookingBroperties.setAutomatic(true);
        }

        List<String> existingAutoMails = prevBookProperties.getAutomaticMails();
        updatedBookingBroperties.setAutomaticMails(existingAutoMails);
        canvasState.setUnindexedProperty("bookingProperties",JsonUtils.serialize(updatedBookingBroperties));


        SearchFabric searchIndexFabrix = new SearchFabric();
        searchIndexFabrix.CreatePlaceDocument(canvasState);

        datastore.put(canvasState);
        datastore.put(userPlaceEntity);
        txn.commit();

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(JsonUtils.serialize(map));
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
