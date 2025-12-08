package com.wiss.f1.championship.controller;

import com.wiss.f1.championship.dto.AuthRequestDTO;
import com.wiss.f1.championship.dto.AuthResponseDTO;
import com.wiss.f1.championship.entity.AppUser;
import com.wiss.f1.championship.entity.Role;
import com.wiss.f1.championship.security.JwtService;
import com.wiss.f1.championship.service.AppUserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<AuthResponseDTO> register(@RequestBody AuthRequestDTO request) {
        try {

            // ROLE aus JSON übernehmen – WICHTIG!
            Role role = Role.PLAYER; // Standard
            if (request.getRole() != null) {
                role = Role.valueOf(request.getRole().toUpperCase());
            }

            AppUser user = userService.registerUser(
                    request.getUsername(),
                    request.getEmail(),
                    request.getPassword(),
                    role
            );

            String token = jwtService.generateToken(user);

            AuthResponseDTO response = new AuthResponseDTO(
                    user.getId(),
                    user.getUsername(),
                    user.getRole().name(),
                    token
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new AuthResponseDTO(null, null, null, "ERROR: " + ex.getMessage()));
        }
    }
}
