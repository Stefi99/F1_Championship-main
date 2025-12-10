package com.wiss.f1.championship.controller;

import com.wiss.f1.championship.entity.*;
import com.wiss.f1.championship.service.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class PlayerControllerTest {

    private TipService tipService;
    private AppUserService userService;
    private RaceService raceService;
    private DriverService driverService;
    private TipController tipController;

    private AppUser testPlayer;
    private Race testRace;
    private Driver testDriver;
    private Tip testTip1;
    private Tip testTip2;

    private void setId(Object entity, Long id, Class<?> clazz) {
        try {
            java.lang.reflect.Field idField = clazz.getDeclaredField("id");
            idField.setAccessible(true);
            idField.set(entity, id);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @BeforeEach
    void setUp() {
        tipService = mock(TipService.class);
        userService = mock(AppUserService.class);
        raceService = mock(RaceService.class);
        driverService = mock(DriverService.class);
        tipController = new TipController(tipService, userService, raceService, driverService);

        testPlayer = new AppUser("player1", "player1@test.com", "encodedPassword", Role.PLAYER);
        setId(testPlayer, 1L, AppUser.class);

        testRace = new Race("Bahrain GP", LocalDate.of(2024, 3, 2), 
                "Bahrain International Circuit", "Sunny", RaceStatus.TIPPABLE);
        testRace.setId(1L);

        testDriver = new Driver("Max Verstappen", "Red Bull Racing");
        testDriver.setId(1L);

        testTip1 = new Tip(testPlayer, testRace, testDriver, 1);
        setId(testTip1, 1L, Tip.class);

        Driver driver2 = new Driver("Lewis Hamilton", "Mercedes");
        driver2.setId(2L);
        testTip2 = new Tip(testPlayer, testRace, driver2, 2);
        setId(testTip2, 2L, Tip.class);
    }

    @Test
    void testGetTipsForRace() {
        List<Tip> tips = Arrays.asList(testTip1, testTip2);
        
        when(raceService.getRaceById(1L)).thenReturn(Optional.of(testRace));
        when(tipService.getTipsByRace(testRace)).thenReturn(tips);

        List<Tip> result = tipController.getTipsForRace(1L);

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(1, result.get(0).getPredictedPosition());
        assertEquals(2, result.get(1).getPredictedPosition());

        verify(raceService, times(1)).getRaceById(1L);
        verify(tipService, times(1)).getTipsByRace(testRace);
    }

    @Test
    void testGetTipsForNonExistentRace() {
        when(raceService.getRaceById(999L)).thenReturn(Optional.empty());
        when(tipService.getTipsByRace(null)).thenReturn(List.of());

        List<Tip> result = tipController.getTipsForRace(999L);

        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(raceService, times(1)).getRaceById(999L);
        verify(tipService, times(1)).getTipsByRace(null);
    }

    @Test
    void testGetEmptyTipsListForRace() {
        when(raceService.getRaceById(1L)).thenReturn(Optional.of(testRace));
        when(tipService.getTipsByRace(testRace)).thenReturn(List.of());

        List<Tip> result = tipController.getTipsForRace(1L);

        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(raceService, times(1)).getRaceById(1L);
        verify(tipService, times(1)).getTipsByRace(testRace);
    }

    @Test
    void testCreateTip() {
        Tip newTip = new Tip(testPlayer, testRace, testDriver, 3);
        setId(newTip, 3L, Tip.class);

        when(userService.getUserById(1L)).thenReturn(Optional.of(testPlayer));
        when(raceService.getRaceById(1L)).thenReturn(Optional.of(testRace));
        when(driverService.getDriverById(1L)).thenReturn(Optional.of(testDriver));
        when(tipService.createTip(any(Tip.class))).thenReturn(newTip);

        Tip result = tipController.createTip(1L, 1L, 1L, 3);

        assertNotNull(result);
        assertEquals(3, result.getPredictedPosition());
        assertEquals(testPlayer, result.getUser());
        assertEquals(testRace, result.getRace());
        assertEquals(testDriver, result.getDriver());

        verify(userService, times(1)).getUserById(1L);
        verify(raceService, times(1)).getRaceById(1L);
        verify(driverService, times(1)).getDriverById(1L);
        verify(tipService, times(1)).createTip(any(Tip.class));
    }

    @Test
    void testCreateTipWithInvalidPosition() {
        Tip newTip = new Tip(testPlayer, testRace, testDriver, 15);
        setId(newTip, 4L, Tip.class);

        when(userService.getUserById(1L)).thenReturn(Optional.of(testPlayer));
        when(raceService.getRaceById(1L)).thenReturn(Optional.of(testRace));
        when(driverService.getDriverById(1L)).thenReturn(Optional.of(testDriver));
        when(tipService.createTip(any(Tip.class))).thenReturn(newTip);

        Tip result = tipController.createTip(1L, 1L, 1L, 15);

        assertNotNull(result);
        assertEquals(15, result.getPredictedPosition());

        verify(tipService, times(1)).createTip(any(Tip.class));
    }

    @Test
    void testCreateTipWithNonExistentUser() {
        Tip newTip = new Tip(null, testRace, testDriver, 1);
        setId(newTip, 5L, Tip.class);

        when(userService.getUserById(999L)).thenReturn(Optional.empty());
        when(raceService.getRaceById(1L)).thenReturn(Optional.of(testRace));
        when(driverService.getDriverById(1L)).thenReturn(Optional.of(testDriver));
        when(tipService.createTip(any(Tip.class))).thenReturn(newTip);

        Tip result = tipController.createTip(999L, 1L, 1L, 1);

        assertNotNull(result);
        assertNull(result.getUser());

        verify(userService, times(1)).getUserById(999L);
        verify(tipService, times(1)).createTip(any(Tip.class));
    }

    @Test
    void testPlayerTestEndpoint() {
        PlayerTestController playerTestController = new PlayerTestController();
        String result = playerTestController.playerTest();
        
        assertEquals("Player ok!", result);
    }
}
