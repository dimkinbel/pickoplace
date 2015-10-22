package com.dimab.pp.dto;

public class CountryDataPlivo {
String name = "";
String iso2 = "";
Integer dialCode;
Integer priority;
public String getName() {
	return name;
}
public void setName(String name) {
	this.name = name;
}
public String getIso2() {
	return iso2;
}
public void setIso2(String iso2) {
	this.iso2 = iso2;
}
public Integer getDialCode() {
	return dialCode;
}
public void setDialCode(Integer dialCode) {
	this.dialCode = dialCode;
}
public Integer getPriority() {
	return priority;
}
public void setPriority(Integer priority) {
	this.priority = priority;
}

}
