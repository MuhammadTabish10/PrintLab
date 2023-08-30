package com.PrintLab.controller;

import com.PrintLab.config.security.JwtUtil;
import com.PrintLab.dto.AuthenticationResponse;
import com.PrintLab.dto.LoginCredentials;
import com.PrintLab.modal.User;
import com.PrintLab.service.UserService;
import com.PrintLab.service.impl.MyUserDetailServiceImplementation;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class LoginController {
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final MyUserDetailServiceImplementation myUserDetailService;
    private final UserService userService;

    public LoginController(AuthenticationManager authenticationManager, JwtUtil jwtUtil, MyUserDetailServiceImplementation myUserDetailService, UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.myUserDetailService = myUserDetailService;
        this.userService = userService;
    }


    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody LoginCredentials loginCredentials) throws Exception {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginCredentials.getName(), loginCredentials.getPassword())
            );
        } catch (Exception e) {
            throw new BadCredentialsException("Incorrect Username or Password! ", e);
        }

        UserDetails userDetails = myUserDetailService.loadUserByUsername(loginCredentials.getName());
        String jwtToken = jwtUtil.generateToken(userDetails);

        return ResponseEntity.ok(new AuthenticationResponse(jwtToken));
    }

    @PostMapping("/signup")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> signup(@RequestBody User user) {
        userService.registerUser(user);
        return ResponseEntity.ok("User registered successfully.");
    }
}
