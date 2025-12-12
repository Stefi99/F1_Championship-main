package com.wiss.f1.championship.controller;

import com.wiss.f1.championship.dto.TipRequestDTO;
import com.wiss.f1.championship.dto.TipResponseDTO;
import com.wiss.f1.championship.entity.AppUser;
import com.wiss.f1.championship.entity.Race;
import com.wiss.f1.championship.service.AppUserService;
import com.wiss.f1.championship.service.RaceService;
import com.wiss.f1.championship.service.TipService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tips")
public class TipController {

    private final TipService tipService;
    private final AppUserService userService;
    private final RaceService raceService;

    public TipController(TipService tipService, AppUserService userService, RaceService raceService) {
        this.tipService = tipService;
        this.userService = userService;
        this.raceService = raceService;
    }

    /**
     * Gibt den Tipp des aktuell eingeloggten Users für ein bestimmtes Rennen zurück.
     */
    @GetMapping("/race/{raceId}")
    public ResponseEntity<TipResponseDTO> getTipForRace(@PathVariable Long raceId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !(authentication.getPrincipal() instanceof AppUser)) {
            return ResponseEntity.status(401).build(); // nicht authentifiziert
        }

        AppUser currentUser = (AppUser) authentication.getPrincipal();

        Optional<Race> raceOpt = raceService.getRaceById(raceId);
        if (raceOpt.isEmpty()) {
            return ResponseEntity.notFound().build(); // Rennen nicht gefunden
        }

        Race race = raceOpt.get();
        List<String> order = tipService.getTipOrderForUserAndRace(currentUser, race);
        LocalDateTime updatedAt = tipService.getTipUpdatedAtForUserAndRace(currentUser, race);

        TipResponseDTO response = new TipResponseDTO(raceId, order, updatedAt);
        return ResponseEntity.ok(response);
    }

    /**
     * Speichert oder aktualisiert einen Tipp für das aktuelle Rennen.
     */
    @PostMapping
    public ResponseEntity<TipResponseDTO> createOrUpdateTip(@RequestBody TipRequestDTO request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !(authentication.getPrincipal() instanceof AppUser)) {
            return ResponseEntity.status(401).build();
        }

        AppUser currentUser = (AppUser) authentication.getPrincipal();

        // Validierung des Requests
        if (request.getRaceId() == null || request.getOrder() == null || request.getOrder().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Optional<Race> raceOpt = raceService.getRaceById(request.getRaceId());
        if (raceOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Race race = raceOpt.get();

        try {
            tipService.saveOrUpdateTip(currentUser, race, request.getOrder());

            // Aktualisierten Tipp zurückgeben
            List<String> order = tipService.getTipOrderForUserAndRace(currentUser, race);
            LocalDateTime updatedAt = tipService.getTipUpdatedAtForUserAndRace(currentUser, race);
            TipResponseDTO response = new TipResponseDTO(request.getRaceId(), order, updatedAt);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build(); // ungültiger Tipp
        }
    }

    /**
     * Aktualisiert einen Tipp (Alias für POST).
     */
    @PutMapping
    public ResponseEntity<TipResponseDTO> updateTip(@RequestBody TipRequestDTO request) {
        return createOrUpdateTip(request);
    }

    /**
     * Gibt alle Tipps eines bestimmten Users zurück.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TipResponseDTO>> getAllTipsForUser(@PathVariable Long userId) {
        Optional<AppUser> userOpt = userService.getUserById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        AppUser user = userOpt.get();
        List<TipResponseDTO> tips = tipService.getAllTipsForUser(user);
        return ResponseEntity.ok(tips);
    }
}

/* ============================================================
   ZUSAMMENFASSUNG DIESES FILES (TipController.java)
   ------------------------------------------------------------
   - Verwaltet Tipps (Predictions) der User für Rennen.
   - Endpunkte:
       GET /api/tips/race/{raceId} → Tipp des aktuellen Users für ein Rennen
       POST /api/tips → Tipp erstellen oder aktualisieren
       PUT /api/tips → Tipp aktualisieren (Alias für POST)
       GET /api/tips/user/{userId} → alle Tipps eines Users
   - Nutzt SecurityContext, um aktuell eingeloggten User zu ermitteln.
   - Nutzt TipService für die Business-Logik.
   ============================================================ */
