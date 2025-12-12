package com.wiss.f1.championship.controller;

import com.wiss.f1.championship.entity.Driver;
import com.wiss.f1.championship.service.DriverService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drivers")
public class DriverController {

    // Service zum Verwalten der Fahrer-Daten
    private final DriverService driverService;

    public DriverController(DriverService driverService) {
        this.driverService = driverService;
    }

    /**
     * Liefert alle verfügbaren Fahrer inklusive Team-Informationen.
     * Wird häufig im Frontend benötigt, z.B. für Tipps oder Anzeigen.
     */
    @GetMapping
    public List<Driver> getAllDrivers() {
        return driverService.getAllDrivers();
    }

    /**
     * Holt einen Fahrer anhand seiner ID.
     * Falls Fahrer nicht existiert: Rückgabe null (könnte später angepasst werden zu 404).
     */
    @GetMapping("/{id}")
    public Driver getDriverById(@PathVariable Long id) {
        return driverService.getDriverById(id).orElse(null);
    }

    /**
     * Legt einen neuen Fahrer an.
     * Erwartet ein Driver-Objekt im Request Body.
     */
    @PostMapping
    public Driver createDriver(@RequestBody Driver driver) {
        return driverService.createDriver(driver);
    }

    /**
     * Aktualisiert einen bestehenden Fahrer.
     * ID aus URL überschreibt ID in Request Body (falls vorhanden).
     */
    @PutMapping("/{id}")
    public Driver updateDriver(@PathVariable Long id, @RequestBody Driver driver) {
        driver.setId(id); // Sicherstellen, dass der richtige Fahrer aktualisiert wird
        return driverService.updateDriver(driver);
    }

    /**
     * Löscht einen Fahrer anhand der ID.
     */
    @DeleteMapping("/{id}")
    public void deleteDriver(@PathVariable Long id) {
        driverService.deleteDriver(id);
    }
}


/* ============================================================
   ZUSAMMENFASSUNG DIESES FILES (DriverController.java)
   ------------------------------------------------------------
   - Steuert alle Endpunkte für F1-Fahrer.
   - Funktionen:
       * GET /api/drivers        → Liste aller Fahrer
       * GET /api/drivers/{id}   → Einzelnen Fahrer abrufen
       * POST /api/drivers       → Neuen Fahrer anlegen
       * PUT /api/drivers/{id}   → Fahrer aktualisieren
       * DELETE /api/drivers/{id}→ Fahrer löschen
   - Nutzt DriverService für alle Datenbankoperationen.
   ============================================================ */
