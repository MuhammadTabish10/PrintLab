package com.PrintLab.dto;

import lombok.Getter;
import org.springframework.security.core.userdetails.UserDetails;

@Getter
public class AuthenticationResponse {
    private final String jwt;
    private final UserDetails userDetails; // Add this field

    public AuthenticationResponse(String jwt, UserDetails userDetails) {
        this.jwt = jwt;
        this.userDetails = userDetails;
    }

}
