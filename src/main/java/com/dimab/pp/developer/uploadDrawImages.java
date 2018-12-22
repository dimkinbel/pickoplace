package com.dimab.pp.developer;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.dimab.pickoplace.utils.JsonUtils;
import com.dimab.pp.dto.GCSdrawImage;

public class uploadDrawImages extends HttpServlet {
	private static final long serialVersionUID = 1L;
 
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		Map <String , Object> map = new HashMap<String , Object>();
		String imageType = request.getParameter("type");
		int imageCount = Integer.parseInt(request.getParameter("count"));
		int offset = Integer.parseInt(request.getParameter("offset"));

		ListImages imageFactory = new ListImages();
        List<GCSdrawImage> imageList = new ArrayList<GCSdrawImage>();
        
        System.out.println("Type:"+imageType+",Count:"+imageCount+",Offset:"+offset);
        
        if(imageType.equals("bg")) {
        	imageList = imageFactory.getImageList("pp_admin_draw_images", "draw_background", imageType, imageCount, offset);
        } else if (imageType.equals("table")) {
        	imageList = imageFactory.getImageList("pp_admin_draw_images", "draw_images/tables", imageType, imageCount, offset);
        } else if (imageType.equals("chair")) {
        	imageList = imageFactory.getImageList("pp_admin_draw_images", "draw_images/chairs", imageType, imageCount, offset);
        } else if (imageType.equals("combo")) {
        	imageList = imageFactory.getImageList("pp_admin_draw_images", "draw_images/combo", imageType, imageCount, offset);
        }
  	    
			
		map.put("imageList", imageList);
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(JsonUtils.serialize(map));
	}

}
