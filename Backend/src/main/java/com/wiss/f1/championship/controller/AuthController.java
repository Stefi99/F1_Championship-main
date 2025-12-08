package com.wiss.f1.championship.controller;

import com.wiss.f1.championship.dto.AuthRequestDTO;
import com.wiss.f1.championship.dto.AuthResponseDTO;
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

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@RequestBody AuthRequestDTO request) {
        try {
            AppUser user = userService.registerUser(
                    request.getUsername(),
                    request.getEmail(),
                    request.getPassword(),
                    Role.PLAYER
            );

            AuthResponseDTO response = new AuthResponseDTO(
                    user.getId(),
                    user.getUsername(),
                    user.getRole().name()
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IllegalArgumentException ex) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody AuthRequestDTO request) {
        try {
            AppUser user = userService.authenticate(
                    request.getUsername(),
                    request.getPassword()
            );

            AuthResponseDTO response = new AuthResponseDTO(
                    user.getId(),
                    user.getUsername(),
                    user.getRole().name()
            );

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException ex) {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}

