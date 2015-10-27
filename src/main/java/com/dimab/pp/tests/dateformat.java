package com.dimab.pp.tests;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.json.JSONObject;
import org.w3c.dom.*;
import org.w3c.dom.ls.DOMImplementationLS;
import org.w3c.dom.ls.LSSerializer;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import com.google.gson.Gson;

import javax.xml.parsers.*;

import java.io.*;

public class dateformat {
	public static void main(String[] args) throws Exception {
		String sss = "{'state':{'width':400,'height':400,'origWidth':400,'origHeight':400,'bg_color':'#FFFFFF','line_color':'#000000','backgroundType':'tiling','backgroundImageID':{'width':96,'height':96},'backgroundActualId':'b_p_2_actual','tilew':96,'tileh':96},'shapes':{'0':{'x':122,'y':188,'w':60,'h':60,'rotate':0,'angle':0,'type':'image','options':{'imgID':'c_p_2_actual','alpha':1},'prevMX':null,'prevMY':null,'sid':'2p6JIz1K1ggC'},'1':{'x':271,'y':200,'w':60,'h':60,'rotate':0,'angle':0,'type':'image','options':{'imgID':'c_p_2_actual','alpha':1},'prevMX':null,'prevMY':null,'sid':'0p6rbFEfb9R3'}}}";
		Gson gson = new Gson();
		JSONObject obj = new JSONObject(sss);
		JSONObject state = obj.getJSONObject("state");

	}
}
