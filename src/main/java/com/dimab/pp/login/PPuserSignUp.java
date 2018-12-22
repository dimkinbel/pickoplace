package com.dimab.pp.login;

import com.dimab.pickoplace.utils.JsonUtils;
import com.dimab.pp.functions.RandomStringGenerator;
import com.dimab.pp.login.dto.PPuser;
import com.google.appengine.api.datastore.*;

import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.*;

/**
 * Created by dima on 12-Apr-16.
 */
@WebServlet(name = "PPuserSignUp")
public class PPuserSignUp extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        TransactionOptions options = TransactionOptions.Builder.withXG(true);
        Transaction txn = datastore.beginTransaction(options);

        Map<String , Object> map = new HashMap<String , Object>();
        map.put("valid", true);
        map.put("phone",true);

        RandomStringGenerator randomGen = new RandomStringGenerator();
        String token =  randomGen.generateRandomString(100,RandomStringGenerator.Mode.ALPHANUMERIC);
        String jsonString = request.getParameter("ppuser");
        PPuser ppuserRequest = JsonUtils.deserialize(jsonString,PPuser.class);
        Date tokenExpire = new Date();

        if(ppuserRequest.getName().length() >= 3 &&
                ppuserRequest.getLastName().length() >= 3 &&
                isValidEmailAddress(ppuserRequest.getEmail()) &&
                ppuserRequest.getPassword().matches("^[0-9A-Za-z\\!\\@\\#\\$\\&\\_\\-]{3,}$")) {

            Query.Filter UserExists = new Query.FilterPredicate("username", Query.FilterOperator.EQUAL,ppuserRequest.getEmail());
            Query q = new Query("Users").setFilter(UserExists);
            PreparedQuery pq = datastore.prepare(q);
            Entity result = pq.asSingleEntity();

            Date date = new Date();


            if (result == null) {

                Entity userEntity = new Entity("Users");
                String random =  randomGen.generateRandomString(10,RandomStringGenerator.Mode.ALPHANUMERIC);
                userEntity.setProperty("username", ppuserRequest.getEmail());
                userEntity.setProperty("LoggedBy","PPuser");
                userEntity.setProperty("UserID", random);
                userEntity.setProperty("emailsend", true);
                userEntity.setUnindexedProperty("ppuser",  JsonUtils.serialize(ppuserRequest));
                userEntity.setProperty("islogged",  true);
                userEntity.setProperty("ppuserPassword", ppuserRequest.getPassword());
                userEntity.setProperty("ppuserToken", token);

                userEntity.setUnindexedProperty("firstEntry", date.toString());
                userEntity.setUnindexedProperty("lastDateInSec", date.getTime()/1000);
                userEntity.setUnindexedProperty("lastDate",  date.toString());

                List<String> pids = new ArrayList<String>();
                userEntity.setUnindexedProperty("PID_full_access",new Text( JsonUtils.serialize(pids)));
                userEntity.setUnindexedProperty("PID_book_admin",new Text( JsonUtils.serialize(pids)));
                userEntity.setUnindexedProperty("phone", "");

                Calendar calendar = Calendar.getInstance();
                calendar.setTime(date);
                calendar.add(Calendar.SECOND,24*3600);
                userEntity.setProperty("ppuserTokenExp", calendar.getTime());
                tokenExpire = calendar.getTime();


                map.put("phone",false);
                map.put("token",token);
                datastore.put(userEntity);
            } else {
                // User exists

                // Check if ppuserExists
                if(result.getProperty("ppuser") == null) {
                    // New ppUser
                    result.setProperty("LoggedBy","PPuser");
                    result.setUnindexedProperty("ppuser",  JsonUtils.serialize(ppuserRequest));
                    result.setProperty("islogged",  true);
                    result.setProperty("ppuserPassword", ppuserRequest.getPassword());
                    result.setProperty("ppuserToken", token);

                    result.setUnindexedProperty("lastDateInSec", date.getTime()/1000);
                    result.setUnindexedProperty("lastDate",  date.toString());

                    Calendar calendar = Calendar.getInstance();
                    calendar.setTime(date);
                    calendar.add(Calendar.SECOND,24*3600);
                    result.setProperty("ppuserTokenExp", calendar.getTime());
                    tokenExpire = calendar.getTime();

                    map = isDatabasePhoneValid(map,result,request);

                    datastore.put(result);
                } else {
                    // Verify email & password match

                    PPuser datastorePPuser = JsonUtils.deserialize((String)result.getProperty("ppuser"),PPuser.class);
                    if(datastorePPuser.getPassword().equals(ppuserRequest.getPassword())) {

                        // Save new PP user data & Login & Generate new token

                        result.setProperty("LoggedBy","PPuser");
                        result.setUnindexedProperty("ppuser",  JsonUtils.serialize(ppuserRequest));
                        result.setProperty("islogged",  true);
                        result.setProperty("ppuserToken", token);

                        result.setUnindexedProperty("lastDateInSec", date.getTime()/1000);
                        result.setUnindexedProperty("lastDate",  date.toString());

                        Calendar calendar = Calendar.getInstance();
                        calendar.setTime(date);
                        calendar.add(Calendar.SECOND,24*3600);
                        result.setProperty("ppuserTokenExp", calendar.getTime());
                        tokenExpire = calendar.getTime();

                        map = isDatabasePhoneValid(map,result,request);

                        datastore.put(result);
                    } else {
                        // Wrong password -> return false
                        map.put("valid", false);
                        map.put("reason", "USER_EXISTS_FALSE_PASSWORD");
                    }
                }
            }

            txn.commit();

        } else {
            map.put("valid", false);
            map.put("reason", "FALSE_VALUES");
            if(ppuserRequest.getName().length() < 3) {
                map.put("name", false);
            }
            if(ppuserRequest.getLastName().length() < 3) {
                map.put("lastname", false);
            }
            if(!isValidEmailAddress(ppuserRequest.getEmail())) {
                map.put("email", false);
            }
            if(!ppuserRequest.getPassword().matches("^[0-9A-Za-z\\!\\@\\#\\$\\&\\_\\-]{3,}$")) {
                map.put("password", false);
            }
        }
        ppuserRequest.setPassword("");
        if(map.get("valid").equals(true)) {
            ppuserRequest.setToken(token);
            ppuserRequest.setExp(tokenExpire.getTime()/1000);
            request.getSession().setAttribute("provider", "ppuser");
            request.getSession().setAttribute("access_token", token);
            request.getSession().setAttribute("userEmail", ppuserRequest.getEmail());
            request.getSession().setAttribute("expDate",tokenExpire);
        }
        map.put("ppuser",JsonUtils.serialize(ppuserRequest));
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(JsonUtils.serialize(map));
    }
    public static boolean isValidEmailAddress(String email) {
        boolean result = true;
        try {
            InternetAddress emailAddr = new InternetAddress(email);
            emailAddr.validate();
        } catch (AddressException ex) {
            result = false;
        }
        return result;
    }
    public  Map<String,Object> isDatabasePhoneValid ( Map<String , Object> map_ , Entity userEntity , HttpServletRequest request) {
        Map<String , Object> map = map_;
        if (userEntity.getProperty("phone") != null) {
            String phone = (String) userEntity.getProperty("phone");
            if (phone.isEmpty()) {
                map.put("phone", false);
            } else {
                if (userEntity.getProperty("phoneValid") != null) {
                    Boolean phoneVerified = (boolean) userEntity.getProperty("phoneValid");
                    if (!phoneVerified) {
                        map.put("phone", false);
                    } else {
                        request.getSession().setAttribute("phone", phone);
                        System.out.println(phone);
                    }
                } else {
                    map.put("phone", false);
                }
            }
        } else {
            userEntity.setUnindexedProperty("phone", "");
            map.put("phone", false);
        }
        return map;
    }

}
