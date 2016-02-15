package com.dimab.pp.developer;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;


public class GetFilesNames extends HttpServlet implements Servlet {

    /**
     * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
     */
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        ListImages listfactory = new ListImages();
        listfactory.PrintImagesInBucket("pp_admin_draw_images");
    }

    /**
     * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
     */
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        ListImages listfactory = new ListImages();
        listfactory.PrintImagesInBucket("pp_admin_draw_images");
    }
}
