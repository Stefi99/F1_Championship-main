package com.wiss.f1.championship.controller;

import com.wiss.f1.championship.dto.AuthRequestDTO;
import com.wiss.f1.championship.dto.AuthResponseDTO;
import com.wiss.f1.championship.entity.AppUser;
import com.wiss.f1.championship.entity.Role;
import com.wiss.f1.championship.security.JwtService;
import com.wiss.f1.championship.service.AppUserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.lang.reflect.Field;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Unit-Tests für AuthController.
 *
 * Testfälle:
 * - Registrierung eines Players oder Admins
 * - Registrierung mit Standardrolle
 * - Registrierung mit doppeltem Benutzernamen
 * - Login von Player oder Admin
 * - Login mit falschen Anmeldedaten oder nicht vorhandenem Benutzer
 *
 * Mockito wird verwendet, um AppUserService und JwtService zu mocken,
 * sodass Controller-Logik isoliert getestet werden kann.
 */
class AuthControllerTest {

    private AppUserService userService;
    private JwtService jwtService;
    private AuthController authController;

    private AppUser testPlayer;
    private AppUser testAdmin;

    // Hilfsmethode, um die private ID eines Users zu setzen
    private void setId(AppUser user, Long id) {
        try {
            Field idField = AppUser.class.getDeclaredField("id");
            idField.setAccessible(true);
            idField.set(user, id);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @BeforeEach
    void setUp() {
        userService = mock(AppUserService.class);
        jwtService = mock(JwtService.class);
        authController = new AuthController(userService, jwtService);

        testPlayer = new AppUser("player1", "player1@test.com", "encodedPassword", Role.PLAYER);
        setId(testPlayer, 1L);

        testAdmin = new AppUser("admin1", "admin1@test.com", "encodedPassword", Role.ADMIN);
        setId(testAdmin, 2L);
    }

    @Test
    void testRegisterPlayer() {
        AuthRequestDTO request = new AuthRequestDTO();
        request.setUsername("player1");
        request.setEmail("player1@test.com");
        request.setPassword("password123");
        request.setRole("PLAYER");

        when(userService.registerUser(anyString(), anyString(), anyString(), any(Role.class)))
                .thenReturn(testPlayer);
        when(jwtService.generateToken(any(AppUser.class))).thenReturn("test-jwt-token");

        ResponseEntity<AuthResponseDTO> response = authController.register(request);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("player1", response.getBody().getUsername());
        assertEquals("PLAYER", response.getBody().getRole());
        assertEquals("test-jwt-token", response.getBody().getToken());

        verify(userService, times(1)).registerUser(anyString(), anyString(), anyString(), any(Role.class));
        verify(jwtService, times(1)).generateToken(any(AppUser.class));
    }

    @Test
    void testRegisterAdmin() {
        AuthRequestDTO request = new AuthRequestDTO();
        request.setUsername("admin1");
        request.setEmail("admin1@test.com");
        request.setPassword("password123");
        request.setRole("ADMIN");

        when(userService.registerUser(anyString(), anyString(), anyString(), any(Role.class)))
                .thenReturn(testAdmin);
        when(jwtService.generateToken(any(AppUser.class))).thenReturn("test-admin-token");

        ResponseEntity<AuthResponseDTO> response = authController.register(request);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("admin1", response.getBody().getUsername());
        assertEquals("ADMIN", response.getBody().getRole());
        assertEquals("test-admin-token", response.getBody().getToken());

        verify(userService, times(1)).registerUser(anyString(), anyString(), anyString(), any(Role.class));
        verify(jwtService, times(1)).generateToken(any(AppUser.class));
    }

    @Test
    void testRegisterWithDefaultRole() {
        AuthRequestDTO request = new AuthRequestDTO();
        request.setUsername("newplayer");
        request.setEmail("newplayer@test.com");
        request.setPassword("password123");
        request.setRole(null);

        AppUser newUser = new AppUser("newplayer", "newplayer@test.com", "encodedPassword", Role.PLAYER);
        setId(newUser, 3L);

        when(userService.registerUser(anyString(), anyString(), anyString(), any(Role.class)))
                .thenReturn(newUser);
        when(jwtService.generateToken(any(AppUser.class))).thenReturn("test-token");

        ResponseEntity<AuthResponseDTO> response = authController.register(request);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("PLAYER", response.getBody().getRole());
    }

    @Test
    void testRegisterWithDuplicateUsername() {
        AuthRequestDTO request = new AuthRequestDTO();
        request.setUsername("player1");
        request.setEmail("player1@test.com");
        request.setPassword("password123");
        request.setRole("PLAYER");

        when(userService.registerUser(anyString(), anyString(), anyString(), any(Role.class)))
                .thenThrow(new IllegalArgumentException("Username already exists"));

        ResponseEntity<AuthResponseDTO> response = authController.register(request);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().getToken().contains("ERROR: Username already exists"));
    }

    @Test
    void testLoginPlayer() {
        AuthRequestDTO request = new AuthRequestDTO();
        request.setUsername("player1");
        request.setPassword("password123");

        when(userService.authenticate(anyString(), anyString())).thenReturn(testPlayer);
        when(jwtService.generateToken(any(AppUser.class))).thenReturn("player-jwt-token");

        ResponseEntity<AuthResponseDTO> response = authController.login(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("player1", response.getBody().getUsername());
        assertEquals("PLAYER", response.getBody().getRole());
        assertEquals("player-jwt-token", response.getBody().getToken());

        verify(userService, times(1)).authenticate(anyString(), anyString());
        verify(jwtService, times(1)).generateToken(any(AppUser.class));
    }

    @Test
    void testLoginAdmin() {
        AuthRequestDTO request = new AuthRequestDTO();
        request.setUsername("admin1");
        request.setPassword("password123");

        when(userService.authenticate(anyString(), anyString())).thenReturn(testAdmin);
        when(jwtService.generateToken(any(AppUser.class))).thenReturn("admin-jwt-token");

        ResponseEntity<AuthResponseDTO> response = authController.login(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("admin1", response.getBody().getUsername());
        assertEquals("ADMIN", response.getBody().getRole());
        assertEquals("admin-jwt-token", response.getBody().getToken());

        verify(userService, times(1)).authenticate(anyString(), anyString());
        verify(jwtService, times(1)).generateToken(any(AppUser.class));
    }

    @Test
    void testLoginWithInvalidCredentials() {
        AuthRequestDTO request = new AuthRequestDTO();
        request.setUsername("player1");
        request.setPassword("wrongpassword");

        when(userService.authenticate(anyString(), anyString()))
                .thenThrow(new IllegalArgumentException("Invalid password"));

        ResponseEntity<AuthResponseDTO> response = authController.login(request);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().getToken().contains("ERROR: Invalid password"));
    }

    @Test
    void testLoginWithNonExistentUser() {
        AuthRequestDTO request = new AuthRequestDTO();
        request.setUsername("nonexistent");
        request.setPassword("password123");

        when(userService.authenticate(anyString(), anyString()))
                .thenThrow(new IllegalArgumentException("User not found"));

        ResponseEntity<AuthResponseDTO> response = authController.login(request);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().getToken().contains("ERROR: User not found"));
    }
}

/*
 * Zusammenfassung:
 * AuthControllerTest überprüft die Kernfunktionalität des AuthControllers:
 * - Registrierung von Playern und Admins, inkl. Standardrolle
 * - Fehlerfälle bei doppeltem Benutzernamen
 * - Login-Prozesse mit gültigen und ungültigen Credentials
 *
 * Mockito wird verwendet, um AppUserService und JwtService zu mocken.
 * So wird die Controller-Logik isoliert getestet, ohne echte Datenbank oder JWT-Generierung.
 */
