package com.dimab.pp.dto;

public class PlaceRatingDTO {
	Double fscore = (double) 0;
	Double sscore = (double) 0;
	Double lscore = (double) 0;
	String tscore = "";
	String bid;
	String pid;
	public Double getFscore() {
		return fscore;
	}
	public void setFscore(Double fscore) {
		this.fscore = fscore;
	}
	public Double getSscore() {
		return sscore;
	}
	public void setSscore(Double sscore) {
		this.sscore = sscore;
	}
	public Double getLscore() {
		return lscore;
	}
	public void setLscore(Double lscore) {
		this.lscore = lscore;
	}
	public String getTscore() {
		return tscore;
	}
	public void setTscore(String tscore) {
		this.tscore = tscore;
	}
	public String getBid() {
		return bid;
	}
	public void setBid(String bid) {
		this.bid = bid;
	}
	public String getPid() {
		return pid;
	}
	public void setPid(String pid) {
		this.pid = pid;
	}

}
