package com.dimab.pp.functions;

public class RandomStringGenerator {
	
	public  enum Mode {
	    ALPHA, ALPHANUMERIC, NUMERIC 
	}
	
	public  String generateRandomString(int length, Mode mode)  {

		StringBuffer buffer = new StringBuffer();
		String characters = "";

		switch(mode){
		
		case ALPHA:
			characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
			break;
		
		case ALPHANUMERIC:
			characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
			break;
	
		case NUMERIC:
			characters = "1234567890";
		    break;
		}
		
		int charactersLength = characters.length();

		for (int i = 0; i < length; i++) {
			double index = Math.random() * charactersLength;
			buffer.append(characters.charAt((int) index));
		}
		if(Character.toString(buffer.charAt(0)).matches("0")) {
			buffer.setCharAt(0,'1');
		}
		return buffer.toString();
	}
}
