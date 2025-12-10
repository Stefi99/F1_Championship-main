package com.wiss.f1.championship.controller;
import com.wiss.f1.championship.entity.*;
import com.wiss.f1.championship.repository.TipRepository;
import com.wiss.f1.championship.service.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Scanner;

@RestController
@RequestMapping("/api/tips")
public class TipController {

    private final TipService tipService;
    private final AppUserService userService;
    private final RaceService raceService;
    private final DriverService driverService;
    private final TipRepository tipRepository;

    public TipController(TipService tipService, AppUserService userService,
                         RaceService raceService, DriverService driverService, TipRepository tipRepository) {
        this.tipService = tipService;
        this.userService = userService;
        this.raceService = raceService;
        this.driverService = driverService;
        this.tipRepository = tipRepository;
    }

    @GetMapping("/race/{raceId}")
    public List<Tip> getTipsForRace(@PathVariable Long raceId) {
        Race race = raceService.getRaceById(raceId).orElse(null);
        return tipService.getTipsByRace(race);
    }

    @PostMapping
    public Tip createTip(
            @RequestParam Long userId,
            @RequestParam Long raceId,
            @RequestParam Long driverId,
            @RequestParam Integer position
    ) {
        AppUser user = userService.getUserById(userId).orElse(null);
        Race race = raceService.getRaceById(raceId).orElse(null);
        Driver driver = driverService.getDriverById(driverId).orElse(null);

        return tipService.createTip(
                new Tip(user, race, driver, position)
        );
    }

    @GetMapping
    public List<Tip> getAllTips() {
        return tipRepository.findAll();
    }

}
