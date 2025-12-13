package com.wiss.f1.championship.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PlayerTestController {

    /**
     * Einfacher Test-Endpunkt für Spieler-Routen.
     * @return String "Player ok!" als Bestätigung, dass der Endpunkt erreichbar ist
     */
    @GetMapping("/api/player/test")
    public String playerTest() {
        return "Player ok!";
    }
}


/* ============================================================
   ZUSAMMENFASSUNG DIESES FILES (PlayerTestController.java)
   ------------------------------------------------------------
   - Enthält einen Test-Endpunkt für Player-spezifische Routen.
   - GET /api/player/test → Rückgabe eines Bestätigungsstrings.
   - Dient hauptsächlich zum Testen der Security- und Routing-Konfiguration.
   ============================================================ */
