package com.app.thesis.controller;

import com.app.thesis.model.LoginRequest;
import com.app.thesis.service.TokenService;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;



@RestController
@AllArgsConstructor
public class AuthController {
    private static final Logger LOG = LoggerFactory.getLogger(AuthController.class);
    private final TokenService tokenService;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/token")
    public String token(@RequestBody LoginRequest userLogin){
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(userLogin.username(), userLogin.password()));
        return tokenService.generateToken(authentication);



    }
}
