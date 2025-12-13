package com.wiss.f1.championship.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AdminTestController {

    // Endpunkt für Admin-Testaufrufe.
    // Wird verwendet, um zu prüfen, ob die ADMIN-Rolle korrekt erkannt wird.
    @GetMapping("/api/admin/test")
    public String adminTest() {
        // Antwort, wenn der authentifizierte User die Admin-Rolle besitzt
        return "Admin ok!";
    }
}

/* ------------------------------------------------------------------------------------------
   ZUSAMMENFASSUNG
   ------------------------------------------------------------------------------------------
   Dieser Controller stellt einen einfachen Test-Endpunkt bereit, mit dem überprüft werden kann,
   ob ein Benutzer korrekt als Admin authentifiziert ist. Wird nur zu Test- und Debug-Zwecken genutzt.
------------------------------------------------------------------------------------------- */
