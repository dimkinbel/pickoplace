package com.dimab.pp.channel;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.channel.ChannelFailureException;
import com.google.appengine.api.channel.ChannelService;
import com.google.appengine.api.channel.ChannelServiceFactory;


public class GetToken extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static ChannelService channelService = ChannelServiceFactory.getChannelService();

 
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
	throws ServletException, IOException {
		String userId = request.getParameter("userid");
		if (userId != null && !"".equals(userId)) {
			String token = createChannel(userId);
			writeIntoChannel(response,token);
		}
	}

	/**
	 * Creates the Channel token for the user 
	 * @param userId The User whom the token is created for  
	 * @return The token string is returned
	 */
	public String createChannel(String userId){
		try{
			System.out.println( "Creating a channel for " + userId);
			return channelService.createChannel(userId);
		}catch(ChannelFailureException channelFailureException){
			System.out.println( "Error creating the channel" + userId);
			return null;
		}catch(Exception otherException){
			System.out.println( "Unknown exception while creating channel:" + userId);
			return null;
		}
	}

	/**
	 * Writes the token in the response text 
	 * 
	 * @param response The response object to write the response text 
	 * @param token The token which needs to be written in the response
	 * @throws IOException
	 */
	public void writeIntoChannel(HttpServletResponse response, String token){
		try{
			  System.out.println("Writing the token to the output:" + token);
			  response.getWriter().print(token);
			} catch(IOException ioException){
				 System.out.println("Exception while writing output :" + token);
			} catch(Exception exception){
				System.out.println("Unknow exception while writing output ");
			}
	}


}
