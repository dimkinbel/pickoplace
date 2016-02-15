package com.dimab.pickoplace.security;

public class AuthorizationException extends RuntimeException {

    AuthorizationException(String reason) {
        super(reason);
    }
}
