package com.dimab.pp.dto;

public class PlivoSMSRequestJSON {
String number = "";
CountryDataPlivo countryData = new CountryDataPlivo();
public String getNumber() {
	return number;
}
public void setNumber(String number) {
	this.number = number;
}
public CountryDataPlivo getCountryData() {
	return countryData;
}
public void setCountryData(CountryDataPlivo countryData) {
	this.countryData = countryData;
}

}
