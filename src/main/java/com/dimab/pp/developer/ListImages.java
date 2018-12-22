package com.dimab.pp.developer;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import com.dimab.pp.dto.GCSdrawImage;
import com.google.api.client.util.StringUtils;
import com.google.appengine.api.appidentity.AppIdentityService;
import com.google.appengine.api.appidentity.AppIdentityServiceFactory;
import com.google.appengine.api.images.ImagesService;
import com.google.appengine.api.images.ImagesServiceFactory;
import com.google.appengine.api.images.ServingUrlOptions;
import com.google.appengine.tools.cloudstorage.GcsFilename;
import com.google.appengine.tools.cloudstorage.GcsService;
import com.google.appengine.tools.cloudstorage.GcsServiceFactory;
import com.google.appengine.tools.cloudstorage.ListItem;
import com.google.appengine.tools.cloudstorage.ListOptions;
import com.google.appengine.tools.cloudstorage.ListResult;
import com.google.appengine.tools.cloudstorage.RetryParams;

public class ListImages {
   public void PrintImagesInBucket(String bucketName) {
	   GcsService gcsService = GcsServiceFactory.createGcsService(RetryParams.getDefaultInstance());
 
	   ListResult result;
		try {
			result = gcsService.list(bucketName, new ListOptions.Builder().setPrefix("").setRecursive(true).build());
			   while (result.hasNext()){
			       ListItem l = result.next();
			       if(!l.isDirectory()) {
				       String name = l.getName();
				       GcsFilename Sname = new GcsFilename(bucketName, l.getName());
				       
				       System.out.println("Name: " + name);
				       System.out.println("Meta: " + gcsService.getMetadata(Sname).getOptions().getMimeType());
			       }
			   }
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

   }
   
   public List<GCSdrawImage> getImageList(String bucket , String prefix , String type , int count_ , int offset_) {
	   List<GCSdrawImage> imageList = new ArrayList<GCSdrawImage>();
	   GcsService gcsService = GcsServiceFactory.createGcsService(RetryParams.getDefaultInstance());
	   ListResult result;
		try {
			result = gcsService.list(bucket, new ListOptions.Builder().setPrefix(prefix).setRecursive(true).build());
			int  index = 0;
			int total = 0;
			while (result.hasNext()){
			       ListItem l = result.next();		       
			       if(!l.isDirectory()) {
				       String name = l.getName();
				       String fileNoPrefix = name.replaceAll(prefix+"\\/", "");
				       GcsFilename Sname = new GcsFilename(bucket, l.getName());
				       //System.out.println("Name: " + name);
				       //System.out.println("No-prefix: " + fileNoPrefix);
				       //System.out.println("Meta: " + gcsService.getMetadata(Sname).getOptions().getMimeType());
				       int matchingSlashes = fileNoPrefix.length() - fileNoPrefix.replaceAll("\\/", "").length();
				       if(matchingSlashes==0 && gcsService.getMetadata(Sname).getOptions().getMimeType().equals("image/png")) {
				    	   index+=1;
					       if(index > offset_) {
					    	   total+=1;
					    	   if(total<=count_) {
					    		    GCSdrawImage image = new GCSdrawImage();
					    		    ImagesService is = ImagesServiceFactory.getImagesService(); 
					    	  	    String filename = String.format("/gs/%s/%s", Sname.getBucketName(), Sname.getObjectName());	  	    
					    	  	    String servingUrl = is.getServingUrl(ServingUrlOptions.Builder.withGoogleStorageFileName(filename));;
					    	  	    
					    	  	    String id_ = l.getName();
					    	  	    String id_full = id_.replaceAll(prefix+"\\/", "");
					    	  	    id_ = id_full.replaceAll("\\.\\w+", "");
					    	  	    
					    	  	    image.setActualURL(servingUrl);
					    	  	    image.setId(id_);
					    	  	    image.setType(type);
					    	  	    image.setPickURL("");
					    	  	    
					    	  	  // System.out.println("Name: " + filename);
					    	  	  // System.out.println("ID:"+id_+" ("+id_full+")");

					    	  	    if(type.equals("bg")) {
					    	  	    	String Pick_filename = 	 prefix+"/pick/"+id_full;
					    	  	    	Sname = new GcsFilename(bucket,Pick_filename);
					    	  	    	filename = String.format("/gs/%s/%s", Sname.getBucketName(), Sname.getObjectName());
					    	  	    	servingUrl = is.getServingUrl(ServingUrlOptions.Builder.withGoogleStorageFileName(filename));
					    	  	    	servingUrl = servingUrl.concat("=s60-c");
					    	  	    	image.setPickURL(servingUrl);
					    	  	    	image.setActualURL(image.getActualURL().concat("=s0"));
					    	  	    	//System.out.println("BG Pick Name: " + filename);
					    	  	    }
					    	  	  imageList.add(image);
					    	   }
					       }
				       }
				       
			       }
		    }
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}	   

  	   	
	   return imageList;
   }
}
