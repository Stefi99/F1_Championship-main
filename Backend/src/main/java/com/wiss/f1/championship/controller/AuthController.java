package com.wiss.f1.championship.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import com.wiss.f1.championship.dto.AuthRequestDTO;
import com.wiss.f1.championship.dto.AuthResponseDTO;
import com.wiss.f1.championship.entity.AppUser;
import com.wiss.f1.championship.entity.Role;
import com.wiss.f1.championship.security.JwtService;
import com.wiss.f1.championship.service.AppUserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AppUserService userService;
    private final JwtService jwtService;

    public AuthController(AppUserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@Valid @RequestBody AuthRequestDTO request) {
        try {
            Role role = Role.PLAYER;

            if (request.getRole() != null) {
                role = Role.valueOf(request.getRole().toUpperCase());
            }

            AppUser user = userService.registerUser(
                    request.getUsername(),
                    request.getEmail(),
                    request.getPassword(),
                    role,
                    request.getDisplayName()
            );

            String token = jwtService.generateToken(user);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new AuthResponseDTO(user.getId(), user.getUsername(), user.getRole().name(), token));

        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new AuthResponseDTO(null, null, null, "ERROR: " + ex.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody AuthRequestDTO request) {
        try {
            // identifier kann Email oder Username sein
            String identifier = request.getIdentifier();
            if (identifier == null || identifier.trim().isEmpty()) {
                // Fallback auf username für Rückwärtskompatibilität
                identifier = request.getUsername();
            }
            
            if (identifier == null || identifier.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new AuthResponseDTO(null, null, null, "ERROR: identifier or username required"));
            }

            AppUser user = userService.authenticate(
                    identifier.trim(),
                    request.getPassword()
            );

            String token = jwtService.generateToken(user);

            return ResponseEntity.ok(
                    new AuthResponseDTO(user.getId(), user.getUsername(), user.getRole().name(), token)
            );

        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponseDTO(null, null, null, "ERROR: " + ex.getMessage()));
        }
    }
}
