package com.wiss.f1.championship.controller;
import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.wiss.f1.championship.entity.Driver;
import com.wiss.f1.championship.entity.OfficialResult;
import com.wiss.f1.championship.entity.Race;
import com.wiss.f1.championship.service.DriverService;
import com.wiss.f1.championship.service.OfficialResultService;
import com.wiss.f1.championship.service.RaceService;

@RestController
@RequestMapping("/api/results")
public class OfficialResultController {

    private final OfficialResultService resultService;
    private final RaceService raceService;
    private final DriverService driverService;

    public OfficialResultController(OfficialResultService resultService,
                                    RaceService raceService,
                                    DriverService driverService) {
        this.resultService = resultService;
        this.raceService = raceService;
        this.driverService = driverService;
    }

    @GetMapping("/race/{raceId}")
    public List<OfficialResult> getResultsForRace(@PathVariable Long raceId) {
        Race race = raceService.getRaceById(raceId).orElse(null);
        return resultService.getResultsForRace(race);
    }

    @PostMapping
    public OfficialResult createResult(
            @RequestParam Long raceId,
            @RequestParam Long driverId,
            @RequestParam Integer finalPosition
    ) {
        Race race = raceService.getRaceById(raceId).orElse(null);
        Driver driver = driverService.getDriverById(driverId).orElse(null);

        return resultService.createResult(
                new OfficialResult(race, driver, finalPosition)
        );
    }

    @DeleteMapping("/race/{raceId}")
    public void deleteResultsForRace(@PathVariable Long raceId) {
        resultService.deleteResultsForRace(raceId);
    }
}
