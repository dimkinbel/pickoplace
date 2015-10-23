package com.dimab.pp.dto;

public class IFresponse {
	  String date;
	  String savedby;
	  String ifid;
	  IFsave iframedata;
	  Long time;

	public Long getTime() {
		return time;
	}
	public void setTime(Long time) {
		this.time = time;
	}
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	public String getSavedby() {
		return savedby;
	}
	public void setSavedby(String savedby) {
		this.savedby = savedby;
	}
	public String getIfid() {
		return ifid;
	}
	public void setIfid(String ifid) {
		this.ifid = ifid;
	}
	public IFsave getIframedata() {
		return iframedata;
	}
	public void setIframedata(IFsave iframedata) {
		this.iframedata = iframedata;
	}

}
