package com.dimab.pp.login;

import com.dimab.pickoplace.utils.JsonUtils;
import com.dimab.pp.functions.RandomStringGenerator;
import com.dimab.pp.login.dto.PPuser;
import com.google.appengine.api.datastore.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Calendar;
import java.util.Date;

/**
 * Created by dima on 12-Apr-16.
 */
public class PPuserLogin {
    PPuser ppuser ;

    public PPuser getPpuser() {
        return ppuser;
    }

    public void setPpuser(PPuser ppuser) {
        this.ppuser = ppuser;
    }
    public PPuserLogin() {

    }
    public PPuserLogin(String access_token) {
        if(access_token == null || access_token.isEmpty() ) {
            this.ppuser = new PPuser();
            this.ppuser.setValid(false);
            this.ppuser.setError("NO_TOKEN");
        }
        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

        Query.Filter UserMail = new Query.FilterPredicate("ppuserToken", Query.FilterOperator.EQUAL,access_token);

        Query q = new Query("Users").setFilter(UserMail);
        PreparedQuery pq = datastore.prepare(q);
        Entity result = pq.asSingleEntity();

        Date date = new Date();
        if (result == null) {
            this.ppuser = new PPuser();
            this.ppuser.setValid(false);
            this.ppuser.setError("NO_USER");
        } else {
            Date datastoreExpire = (Date)result.getProperty("userEntity");
            this.ppuser = JsonUtils.deserialize((String)result.getProperty("ppuser"),PPuser.class);
            if(date.getTime() > datastoreExpire.getTime()) {
                this.ppuser.setValid(false);
                this.ppuser.setPassword("");
                this.ppuser.setError("EXPIRE");
            } else {
                this.ppuser.setValid(true);
                this.ppuser.setPassword("");
                this.ppuser.setToken(access_token);
                this.ppuser.setExp(datastoreExpire.getTime()/1000);
            }

        }
    }
    public PPuser login(DatastoreService datastore, Transaction txn, HttpServletRequest request, PPuser ppuser) {
        PPuser pPloginResponse = new PPuser();
        Query.Filter UserMail = new Query.FilterPredicate("username", Query.FilterOperator.EQUAL,ppuser.getEmail());
        Query.Filter UserPassword = new Query.FilterPredicate("ppuserPassword", Query.FilterOperator.EQUAL,ppuser.getPassword());
        Query.Filter mailAndPassword = Query.CompositeFilterOperator.and(UserMail, UserPassword);

        Query q = new Query("Users").setFilter(mailAndPassword);
        PreparedQuery pq = datastore.prepare(q);
        Entity result = pq.asSingleEntity();

        Date date = new Date();


        if (result == null) {
            pPloginResponse.setValid(false);
            pPloginResponse.setError("WRONG_CREDENTIALS");
            System.out.println("WRONG_CREDENTIALS");

        } else {
            RandomStringGenerator randomGen = new RandomStringGenerator();
            String token =  randomGen.generateRandomString(100, RandomStringGenerator.Mode.ALPHANUMERIC);
            Date tokenExpire;
            System.out.println(token);

            pPloginResponse = JsonUtils.deserialize((String)result.getProperty("ppuser"),PPuser.class);
            pPloginResponse.setValid(true);

            result.setProperty("LoggedBy","PPuser");
            result.setProperty("islogged",  true);
            result.setProperty("ppuserToken", token);

            result.setUnindexedProperty("lastDateInSec", date.getTime()/1000);
            result.setUnindexedProperty("lastDate",  date.toString());

                Calendar calendar = Calendar.getInstance();
                calendar.setTime(date);
                calendar.add(Calendar.SECOND,24*3600);
                result.setProperty("ppuserTokenExp", calendar.getTime());
                tokenExpire = calendar.getTime();

            pPloginResponse.setToken(token);
            pPloginResponse.setExp(tokenExpire.getTime()/1000);

            datastore.put(result);

            request.getSession().setAttribute("provider", "ppuser");
            request.getSession().setAttribute("access_token", token);
            request.getSession().setAttribute("userEmail", pPloginResponse.getEmail());
            request.getSession().setAttribute("expDate",tokenExpire);

            txn.commit();
        }
        System.out.println(JsonUtils.serialize(pPloginResponse));
        return pPloginResponse;
    }
    public PPuser logout(DatastoreService datastore, Transaction txn, HttpServletRequest request, PPuser ppuser) {
        PPuser pPloginResponse = ppuser;
        Query.Filter UserMail = new Query.FilterPredicate("username", Query.FilterOperator.EQUAL,ppuser.getEmail());

        Query q = new Query("Users").setFilter(UserMail);
        PreparedQuery pq = datastore.prepare(q);
        Entity result = pq.asSingleEntity();

        Date date = new Date();


        if (result == null) {
            pPloginResponse.setValid(false);
            pPloginResponse.setError("NO_USER");

        } else {
            pPloginResponse.setValid(true);
            if(this.ppUserTokenIsValid(pPloginResponse,result)) {
                result.setProperty("LoggedBy", "");
                result.setProperty("islogged", false);
                result.setProperty("ppuserToken", "0");

                result.setUnindexedProperty("lastDateInSec", date.getTime() / 1000);
                result.setUnindexedProperty("lastDate", date.toString());

                result.setProperty("ppuserTokenExp", date);
                datastore.put(result);

                txn.commit();
                request.getSession().removeAttribute("access_token");
                request.getSession().removeAttribute("provider");
                request.getSession().removeAttribute("googleRefreshToken");
                request.getSession().removeAttribute("expDate");
                request.getSession().removeAttribute("userEmail");

            } else {

            }
        }

        return pPloginResponse;
    }
    public Boolean ppUserTokenIsValid(PPuser ppuser , Entity userEntity) {
        Date date = new Date();
        String userEmail = (String)userEntity.getProperty("username");
        Date datastoreExpire = (Date)userEntity.getProperty("userEntity");
        String token = (String)userEntity.getProperty("ppuserToken");

        if(!ppuser.getEmail().equals(userEmail)) {
            return false;
        } else if (!token.equals(ppuser.getToken())) {
            return false;
        } else if(date.getTime() > datastoreExpire.getTime()) {
            return false;
        } else {
            return true;
        }
    }


}
