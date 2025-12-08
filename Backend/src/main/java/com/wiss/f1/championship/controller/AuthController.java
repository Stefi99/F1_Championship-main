package com.wiss.f1.championship.controller;

import com.wiss.f1.championship.dto.AuthRequestDto;
import com.wiss.f1.championship.dto.AuthResponseDto;
import com.wiss.f1.championship.entity.AppUser;
import com.wiss.f1.championship.entity.Role;
import com.wiss.f1.championship.service.AppUserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AppUserService userService;

    public AuthController(AppUserService userService) {
        this.userService = userService;
    }

    // Registrierung eines neuen Users (standardmässig ROLE_PLAYER)
    @PostMapping("/register")
    public ResponseEntity<AuthResponseDto> register(@RequestBody AuthRequestDto request) {
        try {
            AppUser user = userService.registerUser(
                    request.getUsername(),
                    request.getPassword(),
                    Role.PLAYER
            );

            AuthResponseDto response = new AuthResponseDto(
                    user.getId(),
                    user.getUsername(),
                    user.getRole().name()
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IllegalArgumentException ex) {
            // z. B. "Username already exists"
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // Login mit Username & Password
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@RequestBody AuthRequestDto request) {
        try {
            AppUser user = userService.authenticate(
                    request.getUsername(),
                    request.getPassword()
            );

            AuthResponseDto response = new AuthResponseDto(
                    user.getId(),
                    user.getUsername(),
                    user.getRole().name()
            );

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException ex) {
            // z. B. "User not found" oder "Invalid password"
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
