package com.dimab.pp.dto;

public class AdminUser {

	 String mail;
	 boolean  full_access;
	 boolean  edit_place;
	 boolean  move_only ;
	 boolean  book_admin;


	public String getMail() {
		return mail;
	}
	public void setMail(String mail) {
		this.mail = mail;
	}
	public boolean isFull_access() {
		return full_access;
	}
	public void setFull_access(boolean full_access) {
		this.full_access = full_access;
	}
	public boolean isEdit_place() {
		return edit_place;
	}
	public void setEdit_place(boolean edit_place) {
		this.edit_place = edit_place;
	}
	public boolean isMove_only() {
		return move_only;
	}
	public void setMove_only(boolean move_only) {
		this.move_only = move_only;
	}
	public boolean isBook_admin() {
		return book_admin;
	}
	public void setBook_admin(boolean book_admin) {
		this.book_admin = book_admin;
	}
	 
}
