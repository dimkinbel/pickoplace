package com.dimab.pp.login;

import com.dimab.pickoplace.entity.EntityKind;
import com.dimab.pp.functions.RandomStringGenerator;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeTokenRequest;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.appengine.api.datastore.*;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.*;
import java.util.*;

//import org.apache.log4j.BasicConfigurator;


public class ConnectUser extends HttpServlet {
    private static final HttpTransport TRANSPORT = new NetHttpTransport();

    /*
     * Default JSON factory to use to deserialize JSON.
     */
    private static final JacksonFactory JSON_FACTORY = new JacksonFactory();

    /*
     * Creates a client secrets object from the client_secrets.json file.
     */
    private static GoogleClientSecrets clientSecrets;

    static {
        try {
            Reader reader = new FileReader("admin/client_secrets.json");
            clientSecrets = GoogleClientSecrets.load(JSON_FACTORY, reader);
        } catch (IOException e) {
            throw new Error("No client_secrets.json found", e);
        }
    }

    /*
     * This is the Client ID that you generated in the API Console.
     */
    private static final String CLIENT_ID = clientSecrets.getWeb().getClientId();

    /*
     * This is the Client Secret that you generated in the API Console.
     */
    private static final String CLIENT_SECRET = clientSecrets.getWeb().getClientSecret();

    /*
     * Optionally replace this with your application's name.
     */
    private static final String APPLICATION_NAME = "PickoPlace";

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("phone", true);
        String accessToken = request.getParameter("access_token");
        String provider = request.getParameter("provider");
        String gcode = request.getParameter("code");
        System.out.println("CONNECT USER: ");
        System.out.println("    provider: " + provider);
        System.out.println("    accessToken: " + accessToken);
        System.out.println("    code: " + gcode);

        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        TransactionOptions options = TransactionOptions.Builder.withXG(true);
        Transaction txn = datastore.beginTransaction(options);
        Gson gson = new Gson();

        HttpSession session = request.getSession();
        String Sprovider = (String) session.getAttribute("provider");
        String Stoken = (String) session.getAttribute("access_token");

        if (provider.equals("google")) {
            GoogleTokenResponse tokenResponse =
                    new GoogleAuthorizationCodeTokenRequest(TRANSPORT, JSON_FACTORY,
                            CLIENT_ID, CLIENT_SECRET, gcode, "postmessage").execute();
            accessToken = tokenResponse.getAccessToken();
            System.out.println("GOOGLE ACCESS-TOKEN:" + accessToken);

            GoogVerifyToken tokenVerifier = new GoogVerifyToken(accessToken);
            if (tokenVerifier.isValid()) {
                request.getSession().setAttribute("provider", provider);
                request.getSession().setAttribute("access_token", accessToken);
                request.getSession().setAttribute("userEmail", tokenVerifier.getData().getEmail());

                GOOGmeResponseJSON userData = tokenVerifier.getData();


                Filter UserExists = new FilterPredicate("username", FilterOperator.EQUAL, userData.getEmail());
                Query q = new Query(EntityKind.Users).setFilter(UserExists);
                PreparedQuery pq = datastore.prepare(q);
                Entity result = pq.asSingleEntity();
                if (result == null) {
                    // First Username login
                    Date date = new Date();
                    Entity userEntity = new Entity(EntityKind.Users);
                    RandomStringGenerator randomGen = new RandomStringGenerator();
                    String random = randomGen.generateRandomString(10, RandomStringGenerator.Mode.ALPHANUMERIC);
                    userEntity.setProperty("username", userData.getEmail());
                    userEntity.setProperty("GoogleAccount", true);
                    userEntity.setProperty("FacebookAccount", "");
                    userEntity.setProperty("LoggedBy", "Google");
                    userEntity.setProperty("UserID", random);
                    userEntity.setProperty("emailsend", true);
                    userEntity.setUnindexedProperty("firstEntry", date.toString());
                    userEntity.setUnindexedProperty("lastDateInSec", date.getTime() / 1000);
                    userEntity.setUnindexedProperty("lastDate", date.toString());

                    List<String> pids = new ArrayList<String>();
                    userEntity.setUnindexedProperty("PID_full_access", gson.toJson(pids));
                    userEntity.setUnindexedProperty("PID_edit_place", gson.toJson(pids));
                    userEntity.setUnindexedProperty("PID_move_only", gson.toJson(pids));
                    userEntity.setUnindexedProperty("PID_book_admin", gson.toJson(pids));
                    userEntity.setUnindexedProperty("phone", "");
                    map.put("phone", false);
                    datastore.put(userEntity);
                } else {
                    // User Not first login
                    Date date = new Date();
                    result.setProperty("LoggedBy", "Google");
                    result.setProperty("GoogleAccount", true);
                    result.setUnindexedProperty("lastDateInSec", date.getTime() / 1000);
                    result.setUnindexedProperty("lastDate", date.toString());
                    if (result.getProperty("emailsend") == null) {
                        result.setProperty("emailsend", true);
                    }
                    if (result.getProperty("phone") != null) {
                        String phone = (String) result.getProperty("phone");
                        if (phone.isEmpty()) {
                            map.put("phone", false);
                        } else {
                            if (result.getProperty("phoneValid") != null) {
                                Boolean phoneVerified = (boolean) result.getProperty("phoneValid");
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
                        result.setUnindexedProperty("phone", "");
                        map.put("phone", false);
                    }

                    datastore.put(result);
                }

                map.put("valid", true);
                map.put("provider", "GOOG");
                map.put("userData", userData);
            } else {
                map.put("valid", false);
            }
        } else {
            // FACEBOOK
            FBVerifyToken tokenFactory = new FBVerifyToken(accessToken);

            if (tokenFactory.isValid()) {
                request.getSession().setAttribute("provider", provider);
                request.getSession().setAttribute("access_token", accessToken);

                if (Sprovider != null && Sprovider.equals("google") && Stoken != null) {
                    System.out.println("Disonnecting GOOGLE token:" + Stoken);
                    RevokeGoogleToken googleRevokeFactory = new RevokeGoogleToken();
                    googleRevokeFactory.revoke(Stoken);
                }

                FBmeResponseJSON userData = tokenFactory.getData();
                request.getSession().setAttribute("userEmail", userData.getEmail());

                Filter UserExists = new FilterPredicate("username", FilterOperator.EQUAL, userData.getEmail());
                Query q = new Query(EntityKind.Users).setFilter(UserExists);
                PreparedQuery pq = datastore.prepare(q);
                Entity result = pq.asSingleEntity();
                if (result == null) {
                    // First Username login
                    Date date = new Date();
                    Entity userEntity = new Entity(EntityKind.Users);
                    RandomStringGenerator randomGen = new RandomStringGenerator();
                    String random = randomGen.generateRandomString(10, RandomStringGenerator.Mode.ALPHANUMERIC);
                    userEntity.setProperty("username", userData.getEmail());
                    userEntity.setProperty("GoogleAccount", "");
                    userEntity.setProperty("FacebookAccount", true);
                    userEntity.setProperty("LoggedBy", "Facebook");
                    userEntity.setProperty("UserID", random);
                    userEntity.setProperty("emailsend", true);
                    userEntity.setUnindexedProperty("firstEntry", date.toString());
                    userEntity.setUnindexedProperty("lastDateInSec", date.getTime() / 1000);
                    userEntity.setUnindexedProperty("lastDate", date.toString());
                    userEntity.setUnindexedProperty("phone", "");
                    map.put("phone", false);

                    datastore.put(userEntity);
                } else {
                    // User Not first login
                    Date date = new Date();
                    if (result.getProperty("GoogleAccount") == null) {
                        result.setProperty("GoogleAccount", true);
                    }
                    result.setProperty("LoggedBy", "Facebook");
                    result.setProperty("FacebookAccount", true);
                    result.setUnindexedProperty("lastDateInSec", date.getTime() / 1000);
                    result.setUnindexedProperty("lastDate", date.toString());

                    if (result.getProperty("emailsend") == null) {
                        result.setProperty("emailsend", true);
                    }
                    if (result.getProperty("phone") != null) {
                        String phone = (String) result.getProperty("phone");
                        if (phone.isEmpty()) {
                            map.put("phone", false);
                        } else {
                            if (result.getProperty("phoneValid") != null) {
                                Boolean phoneVerified = (boolean) result.getProperty("phoneValid");
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
                        result.setUnindexedProperty("phone", "");
                        map.put("phone", false);
                    }
                    datastore.put(result);
                }

                map.put("valid", true);
                map.put("provider", "FB");
                map.put("userData", userData);
            } else {
                map.put("valid", false);
            }

        }

        txn.commit();


        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(new Gson().toJson(map));


/*      ByteArrayOutputStream resultStream = new ByteArrayOutputStream();
      getContent(request.getInputStream(), resultStream);
      String code = new String(resultStream.toByteArray(), "UTF-8");

      try {
        // Upgrade the authorization code into an access and refresh token.
        GoogleTokenResponse tokenResponse =
            new GoogleAuthorizationCodeTokenRequest(TRANSPORT, JSON_FACTORY,
                CLIENT_ID, CLIENT_SECRET, code, "postmessage").execute();
      //  tokenResponse.getAccessToken();
        // You can read the Google user ID in the ID token.
        // This sample does not use the user ID.
        GoogleIdToken idToken = tokenResponse.parseIdToken();
        String gplusId = idToken.getPayload().getSubject();

        // Store the token in the session for later use.
        request.getSession().setAttribute("token", tokenResponse.toString());
        System.out.println("CONNECT TOKEN:"+ tokenResponse.toString());
        response.setStatus(HttpServletResponse.SC_OK);
        response.getWriter().print(GSON.toJson("Successfully connected user."));
      } catch (TokenResponseException e) {
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        response.getWriter().print(GSON.toJson("Failed to upgrade the authorization code."));
      } catch (IOException e) {
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        response.getWriter().print(GSON.toJson("Failed to read token data from Google. " +
            e.getMessage()));
      }
      */
    }

    /*
     * Read the content of an InputStream.
     *
     * @param inputStream the InputStream to be read.
     * @return the content of the InputStream as a ByteArrayOutputStream.
     * @throws IOException
     */
    static void getContent(InputStream inputStream, ByteArrayOutputStream outputStream)
            throws IOException {
        // Read the response into a buffered stream
        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
        int readChar;
        while ((readChar = reader.read()) != -1) {
            outputStream.write(readChar);
        }
        reader.close();
    }
}
