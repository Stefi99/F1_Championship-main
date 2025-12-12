package com.wiss.f1.championship.entity;

/**
 * Enum für Benutzerrollen.
 *
 * Rollen:
 * - ADMIN: Administrator mit erweiterten Rechten (z.B. Rennen und Ergebnisse verwalten)
 * - PLAYER: Normaler Spieler/Teilnehmer, der Tipps abgeben und Leaderboard einsehen kann
 *
 * Wird in AppUser zur Berechtigungskontrolle verwendet.
 */
public enum Role {
    ADMIN,
    PLAYER
}

/* ============================================================
   ZUSAMMENFASSUNG DIESES FILES (Role.java)
   ------------------------------------------------------------
   - Definiert Benutzerrollen für die Anwendung
   - Wird für Security/Authorization in Spring Security genutzt
   - Einfaches Enum ohne zusätzliche Logik
   ============================================================ */
