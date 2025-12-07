package com.wiss.f1.championship.controller;
import com.wiss.f1.championship.entity.*;
import com.wiss.f1.championship.service.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}
