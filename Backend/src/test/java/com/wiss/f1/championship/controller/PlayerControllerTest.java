package com.wiss.f1.championship.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import com.wiss.f1.championship.dto.TipRequestDTO;
import com.wiss.f1.championship.dto.TipResponseDTO;
import com.wiss.f1.championship.entity.AppUser;
import com.wiss.f1.championship.entity.Race;
import com.wiss.f1.championship.entity.RaceStatus;
import com.wiss.f1.championship.entity.Role;
import com.wiss.f1.championship.service.AppUserService;
import com.wiss.f1.championship.service.RaceService;
import com.wiss.f1.championship.service.TipService;

class PlayerControllerTest {

    private TipService tipService;
    private AppUserService userService;
    private RaceService raceService;
    private TipController tipController;

    private AppUser testPlayer;
    private Race testRace;
    private Authentication authentication;
    private SecurityContext securityContext;

    private void setId(Object entity, Long id, Class<?> clazz) {
        try {
            java.lang.reflect.Field idField = clazz.getDeclaredField("id");
            idField.setAccessible(true);
            idField.set(entity, id);
        } catch (NoSuchFieldException | IllegalAccessException e) {
            throw new RuntimeException(e);
        }
    }

    @BeforeEach
    void setUp() {
        tipService = mock(TipService.class);
        userService = mock(AppUserService.class);
        raceService = mock(RaceService.class);
        tipController = new TipController(tipService, userService, raceService);

        testPlayer = new AppUser("player1", "player1@test.com", "encodedPassword", Role.PLAYER);
        setId(testPlayer, 1L, AppUser.class);

        testRace = new Race("Bahrain GP", LocalDate.of(2024, 3, 2), 
                "Bahrain International Circuit", "Sunny", RaceStatus.TIPPABLE);
        testRace.setId(1L);

        // Mock SecurityContext für Authentication
        authentication = mock(Authentication.class);
        securityContext = mock(SecurityContext.class);
        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(testPlayer);
    }

    @Test
    void testGetTipForRace() {
        List<String> tipOrder = Arrays.asList("Max Verstappen", "Lewis Hamilton", "Charles Leclerc");
        
        when(raceService.getRaceById(1L)).thenReturn(Optional.of(testRace));
        when(tipService.getTipOrderForUserAndRace(testPlayer, testRace)).thenReturn(tipOrder);

        ResponseEntity<TipResponseDTO> response = tipController.getTipForRace(1L);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1L, response.getBody().getRaceId());
        assertEquals(3, response.getBody().getOrder().size());
        assertEquals("Max Verstappen", response.getBody().getOrder().get(0));

        verify(raceService, times(1)).getRaceById(1L);
        verify(tipService, times(1)).getTipOrderForUserAndRace(testPlayer, testRace);
    }

    @Test
    void testGetTipForNonExistentRace() {
        when(raceService.getRaceById(999L)).thenReturn(Optional.empty());

        ResponseEntity<TipResponseDTO> response = tipController.getTipForRace(999L);

        assertNotNull(response);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());

        verify(raceService, times(1)).getRaceById(999L);
        verify(tipService, never()).getTipOrderForUserAndRace(any(), any());
    }

    @Test
    void testGetTipForRaceUnauthenticated() {
        when(securityContext.getAuthentication()).thenReturn(null);

        ResponseEntity<TipResponseDTO> response = tipController.getTipForRace(1L);

        assertNotNull(response);
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());

        verify(raceService, never()).getRaceById(any());
        verify(tipService, never()).getTipOrderForUserAndRace(any(), any());
    }

    @Test
    void testCreateOrUpdateTip() {
        List<String> tipOrder = Arrays.asList("Max Verstappen", "Lewis Hamilton", "Charles Leclerc");
        TipRequestDTO request = new TipRequestDTO(1L, tipOrder);
        
        when(raceService.getRaceById(1L)).thenReturn(Optional.of(testRace));
        when(tipService.saveOrUpdateTip(testPlayer, testRace, tipOrder)).thenReturn(Arrays.asList());
        when(tipService.getTipOrderForUserAndRace(testPlayer, testRace)).thenReturn(tipOrder);

        ResponseEntity<TipResponseDTO> response = tipController.createOrUpdateTip(request);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1L, response.getBody().getRaceId());
        assertEquals(3, response.getBody().getOrder().size());

        verify(raceService, times(1)).getRaceById(1L);
        verify(tipService, times(1)).saveOrUpdateTip(testPlayer, testRace, tipOrder);
        verify(tipService, times(1)).getTipOrderForUserAndRace(testPlayer, testRace);
    }

    @Test
    void testCreateOrUpdateTipWithInvalidRequest() {
        TipRequestDTO request = new TipRequestDTO(null, Arrays.asList("Max Verstappen"));

        ResponseEntity<TipResponseDTO> response = tipController.createOrUpdateTip(request);

        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());

        verify(raceService, never()).getRaceById(any());
        verify(tipService, never()).saveOrUpdateTip(any(), any(), any());
    }

    @Test
    void testCreateOrUpdateTipWithEmptyOrder() {
        TipRequestDTO request = new TipRequestDTO(1L, Arrays.asList());

        ResponseEntity<TipResponseDTO> response = tipController.createOrUpdateTip(request);

        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());

        verify(raceService, never()).getRaceById(any());
        verify(tipService, never()).saveOrUpdateTip(any(), any(), any());
    }

    @Test
    void testCreateOrUpdateTipWithNonExistentRace() {
        List<String> tipOrder = Arrays.asList("Max Verstappen", "Lewis Hamilton");
        TipRequestDTO request = new TipRequestDTO(999L, tipOrder);
        
        when(raceService.getRaceById(999L)).thenReturn(Optional.empty());

        ResponseEntity<TipResponseDTO> response = tipController.createOrUpdateTip(request);

        assertNotNull(response);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());

        verify(raceService, times(1)).getRaceById(999L);
        verify(tipService, never()).saveOrUpdateTip(any(), any(), any());
    }

    @Test
    void testGetAllTipsForUser() {
        List<TipResponseDTO> tips = Arrays.asList(
            new TipResponseDTO(1L, Arrays.asList("Max Verstappen", "Lewis Hamilton"), LocalDateTime.now()),
            new TipResponseDTO(2L, Arrays.asList("Charles Leclerc", "Carlos Sainz"), LocalDateTime.now())
        );
        
        when(userService.getUserById(1L)).thenReturn(Optional.of(testPlayer));
        when(tipService.getAllTipsForUser(testPlayer)).thenReturn(tips);

        ResponseEntity<List<TipResponseDTO>> response = tipController.getAllTipsForUser(1L);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());

        verify(userService, times(1)).getUserById(1L);
        verify(tipService, times(1)).getAllTipsForUser(testPlayer);
    }

    @Test
    void testGetAllTipsForNonExistentUser() {
        when(userService.getUserById(999L)).thenReturn(Optional.empty());

        ResponseEntity<List<TipResponseDTO>> response = tipController.getAllTipsForUser(999L);

        assertNotNull(response);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());

        verify(userService, times(1)).getUserById(999L);
        verify(tipService, never()).getAllTipsForUser(any());
    }

    @Test
    void testPlayerTestEndpoint() {
        PlayerTestController playerTestController = new PlayerTestController();
        String result = playerTestController.playerTest();
        
        assertEquals("Player ok!", result);
    }
}
