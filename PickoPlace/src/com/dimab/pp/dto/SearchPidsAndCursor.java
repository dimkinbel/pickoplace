package com.dimab.pp.dto;

import java.util.ArrayList;
import java.util.List;

import com.google.appengine.api.search.Cursor;

public class SearchPidsAndCursor {
	List<String> pids = new ArrayList<String>();
	Cursor cursor;
	public List<String> getPids() {
		return pids;
	}
	public void setPids(List<String> pids) {
		this.pids = pids;
	}
	public Cursor getCursor() {
		return cursor;
	}
	public void setCursor(Cursor cursor) {
		this.cursor = cursor;
	}
	
	
}
