package com.wiss.f1.championship.service.test;

import com.wiss.f1.championship.model.Race;
import com.wiss.f1.championship.model.RaceStatus;
import com.wiss.f1.championship.repository.RaceRepository;
import com.wiss.f1.championship.service.RaceService;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.Optional;

@SpringBootTest
@ExtendWith(SpringExtension.class)
class RaceServiceTest {

    @MockBean
    private RaceRepository raceRepository;

    @Autowired
    private RaceService raceService;

    @Test
    void testCreateRace() {
        Race race = new Race();
        race.setName("Bahrain GP");

        when(raceRepository.save(any(Race.class))).thenReturn(race);

        Race saved = raceService.createRace(race);

        assertEquals("Bahrain GP", saved.getName());
        verify(raceRepository, times(1)).save(any(Race.class));
    }

    @Test
    void testUpdateStatus() {
        Race race = new Race();
        race.setId(1L);
        race.setStatus(RaceStatus.OPEN);

        when(raceRepository.findById(1L)).thenReturn(Optional.of(race));
        when(raceRepository.save(any(Race.class))).thenReturn(race);

        Race updated = raceService.updateStatus(1L, RaceStatus.CLOSED);

        assertEquals(RaceStatus.CLOSED, updated.getStatus());
    }
}
