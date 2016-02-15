package com.dimab.pp.tests;

import com.dimab.pp.urlUtils.PrintHeader;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


/**
 */
public class HeaderTest extends HttpServlet {

    private static final long serialVersionUID = 1L;

    public HeaderTest() {
        super();
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        PrintHeader header = new PrintHeader();
        header.printHeader(request,response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        PrintHeader header = new PrintHeader();
        header.printHeader(request,response);
    }
}