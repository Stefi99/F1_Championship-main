# 🏎️ F1 Championship – M223 Abschlussprojekt

> 📄 Diese README dient gleichzeitig als Projektdokumentation gemäss der Vorgabe vom Modul M223.

Dieses Projekt wurde im Rahmen des Moduls **M223 – Multi-User Anwendungen realisieren** erstellt.
Die F1 Championship ist eine vollständige Webanwendung, die es Benutzern ermöglicht, auf Formel-1-Rennen zu tippen und in einem Leaderboard gegeneinander anzutreten. Das System besteht aus einem Spring Boot Backend (REST-API) und einem React Frontend.

---

## 📚 Übersicht

Diese Anwendung ermöglicht:

- **Spieler (Players)**: Tipps auf Formel-1-Rennen abgeben, Leaderboard einsehen, Profil verwalten
- **Administratoren (Admins)**: Rennen erstellen und verwalten, Fahrer verwalten, offizielle Ergebnisse eintragen
- **Authentifizierung**: Sichere Anmeldung und Registrierung mit JWT-Tokens
- **Punkteberechnung**: Automatische Punktevergabe basierend auf der Tipp-Genauigkeit

---

## 📂 Projektstruktur

```
F1_Championship-main
├── Backend/          → Spring Boot REST-API (Java)
├── Frontend/         → React Webapp (JavaScript)
└── README.md         → Projektdokumentation
```

Das Projekt ist klar in Frontend und Backend getrennt.  
Die Kommunikation erfolgt über eine REST-API.

---

## 🔧 Technologien

### Backend

- **Java 21**
- **Spring Boot 4.0.0**
- **Spring Security** (JWT-basierte Authentifizierung)
- **Spring Data JPA** (Datenbankzugriff)
- **PostgreSQL** (Datenbank)
- **Jakarta Validation** (Validierung)
- **JWT (jjwt)** (Token-Generierung)
- **BCrypt** (Passwörter gehasht)
- **Swagger/OpenAPI** (API-Dokumentation)

**Beschreibung:**

Das Backend stellt eine REST-API bereit und ist in Controller-, Service- und Repository-Schichten aufgebaut.  
Die Authentifizierung erfolgt über JWT-Tokens, welche bei jedem Request serverseitig validiert werden.  
Passwörter werden sicher mit BCrypt gehasht gespeichert, die Datenpersistenz erfolgt über JPA mit PostgreSQL.

### Frontend

- **React 19.2.0**
- **React Router DOM 7.10.0** (Routing)
- **Vite 7.2.4** (Build-Tool)
- **CSS3** (Styling)

### Beschreibung:
Das Frontend bildet die Benutzeroberfläche der Anwendung.  
Die Navigation erfolgt über React Router, der Login-Zustand wird zentral über die React Context API verwaltet.  
API-Aufrufe erfolgen über einen Service-Layer, der den JWT-Token automatisch mitsendet.

### Testing

- **JUnit 5** (Backend Unit-Tests)
- **Mockito** (Mocking)
- **MockMvc** (Controller-Tests)
- **Vitest** (Frontend Tests)
- **React Testing Library** (Komponenten-Tests)

### Beschreibung:
Es wurden automatisierte Tests für Backend und Frontend umgesetzt, um zentrale Business-Logik und Benutzerinteraktionen zu überprüfen.

---

## 👥 Nutzerrollen

### 🎮 Player (Spieler)

- Registrierung und Anmeldung
- Tipps auf offene Rennen abgeben
- Eigene Tipps ansehen und bearbeiten
- Leaderboard einsehen
- Profil verwalten (Display Name, Lieblings-Team, Land, Bio)

### 🔐 Admin (Administrator)

- Rennen erstellen, bearbeiten und löschen
- Fahrer verwalten (CRUD-Operationen)
- Offizielle Rennergebnisse eintragen
- Rennstatus verwalten (OPEN → VOTING → CLOSED)

---

## ✨ Features

### Authentifizierung & Autorisierung

- JWT-basierte Authentifizierung
- Rollenbasierte Zugriffskontrolle (ADMIN/PLAYER)
- Sichere Passwort-Speicherung (BCrypt)

### Rennen-Verwaltung

- Rennen mit Status-System (OPEN, VOTING, CLOSED)
- Verwaltung von Renndaten und Ergebnissen

### Tipp-System

- Abgabe von Tipps für Top-10-Positionen
- Validierung basierend auf dem Rennstatus

### Punkteberechnung

- Automatische Punktevergabe basierend auf der Genauigkeit der abgegebenen Tipps
- Berücksichtigung von exakten Treffern und Platzierungsabweichungen

### Leaderboard

- Sortierung nach Gesamtpunkten
- Anzeige von Rang, Benutzername und Punkten

---

## 🧰 Voraussetzungen

- **JDK 21+**
- **Maven 3.8+**
- **PostgreSQL 14+**
- **Node.js 18+** und **npm**
- **Git**

---

## ▶️ Startanleitung

### Voraussetzungen:
Für den Start müssen folgende Umgebungsvariablen gesetzt sein:
- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `JWT_SECRET`

### Anwendung starten

### 1. PostgreSQL-Datenbank erstellen:
```sql
CREATE DATABASE f1_championship_db;
```

### 2. Backend starten (Spring Boot):
```cmd
cd Backend
./mvnw spring-boot:run
```

### 3. Frontend starten (React):
```cmd
cd Frontend
npm install
npm run dev
```

> **Backend läuft auf**: `http://localhost:8080`  
> **API-Dokumentation**: `http://localhost:8080/swagger-ui.html`
> **Frontend läuft auf**: `http://localhost:5173`  
> Stelle sicher, dass das Backend auf Port `8080` läuft.

---

## 🧩 Initialdaten (Fahrer)

Damit Rennen und Tipps korrekt funktionieren, müssen Fahrer in der Datenbank vorhanden sein.  
Die folgenden Beispiel-Daten können einmalig in der Datenbank ausgeführt werden:

```sql
INSERT INTO drivers (name, team) VALUES
('Max Verstappen', 'Red Bull Racing'),
('Yuki Tsunoda', 'Red Bull Racing'),
('Kimi Antonelli', 'Mercedes'),
('George Russell', 'Mercedes'),
('Charles Leclerc', 'Ferrari'),
('Lewis Hamilton', 'Ferrari'),
('Lando Norris', 'McLaren'),
('Oscar Piastri', 'McLaren'),
('Fernando Alonso', 'Aston Martin'),
('Lance Stroll', 'Aston Martin'),
('Pierre Gasly', 'Alpine'),
('Franco Colapinto', 'Alpine'),
('Liam Lawson', 'RB'),
('Isack Hadjar', 'RB'),
('Gabriel Bortoleto', 'Sauber'),
('Nico Hülkenberg', 'Sauber'),
('Esteban Ocon', 'Haas'),
('Oliver Bearman', 'Haas'),
('Alexander Albon', 'Williams'),
('Carlos Sainz', 'Williams');
```

---

## 📦 Datenmodell (ERD)

![ERD Diagramm](./images/erd-diagramm.png)

### Beziehungen:
- **AppUser** → **Tip** (1:N) - Ein User kann mehrere Tipps abgeben
- **Race** → **Tip** (1:N) - Ein Rennen kann mehrere Tipps haben
- **Race** → **OfficialResult** (1:N) - Ein Rennen hat mehrere offizielle Ergebnisse
- **Driver** → **Tip** (1:N) - Ein Fahrer kann in mehreren Tipps vorkommen
- **Driver** → **OfficialResult** (1:N) - Ein Fahrer kann in mehreren Ergebnissen vorkommen

---

## 🏗️ Backend-Architektur

### Layer-Architektur-Diagramm:

```
┌─────────────────────────────────────────┐
│    CONTROLLER LAYER  (REST-Endpoints)   │
│  - AuthController                       │
│  - RaceController                       │
│  - TipController                        │
│  - LeaderboardController                │
│  - UserController                       │
└─────────────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────┐
│    SERVICE LAYER     (Business-Logik)   │
│  - AppUserService                       │
│  - RaceService                          │
│  - TipService                           │
│  - LeaderboardService                   │
│  - JwtService                           │
└─────────────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────┐
│    REPOSITORY LAYER (Datenbankzugriff)  │
│  - AppUserRepository                    │
│  - RaceRepository                       │
│  - TipRepository                        │
│  - DriverRepository                     │
└─────────────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────┐
│         DATABASE           (Tabellen)   │
│         PostgreSQL                      │
│  - app_users                            │
│  - races                                │
│  - voting                               │
│  - drivers                              │
│  - official_results                     │
└─────────────────────────────────────────┘


```

### Projektstruktur

Das Backend ist nach Best Practices modular aufgebaut:

```

com.wiss.f1.championship
├── config/                 → Konfigurationsklassen (Security, Swagger, etc.)
│ ├── SecurityConfig.java
│ └── ...
│
├── controller/             → REST-Controller (API-Endpunkte)
│ ├── AuthController.java
│ └── ...
│
├── dto/                    → Data Transfer Objects für Requests/Responses
│ ├── AuthRequestDTO.java
│ └── ...
│
├── entity/                 → JPA-Entitäten (Datenbankmodell)
│ ├── AppUser.java
│ └── ...
│
├── exception/              → Zentrale Fehlerbehandlung
│ ├── GlobalExceptionHandler.java
│ └── ...
│
├── repository/             → JPA-Repositories (Datenbankzugriff)
│ ├── AppUserRepository.java
│ └── ...
│
├── security/               → JWT & Security-Logik
│ ├── JwtService.java
│ └── ...
│
└── service/                → Business-Logik
  ├── AppUserService.java
  └── ...


```

### JWT-Auth-Flow-Diagramm

```

┌─────────────────────────────────────────┐
│              CLIENT                     │
│             (Frontend)                  │
└─────────────────────────────────────────┘
                  │
                  │ 1. POST /api/auth/login
                  │    { username, password }
                  ↓
┌─────────────────────────────────────────┐
│           AuthController                │
│  - Validiert Credentials                │
│  - Ruft AppUserService auf              │
└─────────────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────┐
│           AppUserService                │
│  - Prüft User in der Datenbank          │
│  - Vergleicht Passwort (BCrypt)         │
└─────────────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────┐
│             JwtService                  │
│  - Generiert JWT-Token                  │
│  - Enthält: userId, username, role, exp │
└─────────────────────────────────────────┘
                  │
                  │ 2. Response: { token, user }
                  ↓
┌─────────────────────────────────────────┐
│              CLIENT                     │
│  - Speichert JWT-Token                  │
└─────────────────────────────────────────┘
                  │
                  │ 3. GET /api/races
                  │    Authorization: Bearer <token>
                  ↓
┌─────────────────────────────────────────┐
│      JwtAuthenticationFilter            │
│  - Extrahiert JWT aus Header            │
│  - Validiert Token                      │
│  - Lädt User aus Token                  │
│  - Setzt Authentication im              │
│    SecurityContext                      │
└─────────────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────┐
│            RaceController               │
│  - Greift auf Authentication zu         │
│  - Ruft RaceService auf                 │
└─────────────────────────────────────────┘


```

---

## 🎨 Frontend-Architektur

### Komponentenübersicht

```

Frontend/src/
├── main.jsx              → Einstiegspunkt
├── App.jsx               → Haupt-App-Komponente
│
├── contexts/             → Globales State-Management
│ ├── AuthContext.js
│ └── ...
│
├── router/               → Routing-Definitionen
│ └── AppRouter.jsx → Route-Definitionen
│
├── components/           → Wiederverwendbare UI-Komponenten
│ ├── layout/
│ │ ├── Layout.jsx
│ │ └── ...
│ │
│ └── common/
│   ├── ErrorBoundary.jsx
│   └── ...
│
├── pages/                → Seiten der Anwendung
│ ├── HomePage.jsx → Startseite
│ ├── PageNotFound.css
│ ├── PageNotFound.jsx
│ │
│ ├── auth/
│ │ ├── LoginPage.jsx
│ │
│ ├── player/
│ │ ├── PlayerDashboardPage.jsx
│ │ └── ...
│ │
│ └── admin/
│   ├── AdminDashboardPage.jsx
│   └── ...
│
├── services/             → API-Service-Layer
│ ├── api.js
│ └── ...
│
└── utils/                → Hilfsfunktionen
  ├── tokenStorage.js
  └── ...

```

### State-Management-Flow (AuthContext)

Das Frontend nutzt die React Context API für das zentrale State-Management der Authentifizierung.  
Der AuthContext stellt Benutzerinformationen und Login-Status global für alle Komponenten bereit.

```

┌─────────────────────────────────────────┐
│             AuthProvider                │
│   (Wird in main.jsx um die App gelegt)  │
└─────────────────────────────────────────┘
                  │
                  │ stellt Context bereit
                  ▼
┌─────────────────────────────────────────┐
│              Context State              │
│                                         │
│  - user: AppUser | null                 │
│   → Enthält id, username, role, points  │
│  - loading: boolean                     │
│   → true, während User-Daten geladen    │
│  - isAuthenticated: boolean             │
│   → Berechnet aus: !!user               │
│ -  isAdmin: boolean                     │
│   → user?.role === "ADMIN"              │
└─────────────────────────────────────────┘
                  │
                  │ stellt Funktionen bereit
                  ▼
┌─────────────────────────────────────────┐
│           Context Functions             │
│                                         │
│  - login(token, authResponse)           │
│   → Speichert Token & lädt User-Daten   │
│  - logout()                             │
│   → Entfernt Token & setzt user = null  │
│  - refreshUser()                        │
│   → Lädt aktuelle User-Daten neu        │
│  - loadUserFromToken()                  │
│   → Initialer Login aus localStorage    │
└─────────────────────────────────────────┘
                  │
                  │ Context.Provider
                  ▼
┌─────────────────────────────────────────┐
│         Konsumierende Komponenten       │
│                                         │
│  - LoginPage                            │
│   → nutzt login()                       │
│  - ProtectedRoute                       │
│   → prüft isAuthenticated               │
│  - Navbar                               │
│   → zeigt Login / Logout Button         │
└─────────────────────────────────────────┘

```

## 🔄 API-Integration-Diagramm (Services → Fetch API → Backend)

Das Frontend nutzt einen Service-Layer zur Kapselung von API-Aufrufen.  
Ein zentraler API-Client übernimmt die Kommunikation mit dem Backend und fügt den JWT-Token automatisch zu Requests hinzu.  
Dadurch bleibt die Logik klar getrennt und die API-Integration übersichtlich.

```

┌─────────────────────────────────────────────────────────┐
│                   Frontend-Komponenten                  │
│ (PlayerRaceTipsPage, AdminRaceListPage, etc.)           │
└───────────────────────────┬─────────────────────────────┘
                            │ import
                            │ tipService, raceService
                            ▼
┌─────────────────────────────────────────────────────────┐
│                Service Layer (Frontend)                 │
│   (z.B. raceService, tip…)                              │
└───────────────────────────┬─────────────────────────────┘
                            │ delegiert Requests an
                            ▼
┌─────────────────────────────────────────────────────────┐
│                 API Client (api.js)                     │
│  (fügt JWT automatisch hinzu)                           │
└────────────────────────────┬────────────────────────────┘
                             │ HTTP Request
                             ▼
┌─────────────────────────────────────────────────────────┐
│                  Backend (Spring Boot)                  │
│  Controller → Service → DB                              │
└─────────────────────────────────────────────────────────┘
                           │ JSON Response
                           ▼
┌────────────────────────────────────────────────────────┐
│                  Frontend Komponenten                  │
│  UI wird aktualisiert                                  │
│  (z.B. "Tipp gespeichert")                             │
└────────────────────────────────────────────────────────┘

```

---

## 🧪 API-Endpunkte

### 🔐 Authentifizierung
| Methode | Pfad                         | Beschreibung            
| ------- | ---------------------------- | ----------------------- 
| POST    | `/api/auth/register`         | Neuen User registrieren 
| POST    | `/api/auth/login`            | User einloggen          

### 🏁 Rennen
| Methode | Pfad                         | Beschreibung            
| ------- | ---------------------------- | ----------------------- 
| GET     | `/api/races`                 | Alle Rennen abrufen        
| POST    | `/api/races`                 | Neues Rennen erstellen       
| PUT     | `/api/races/{id}`            | Rennen bearbeiten            
| DELETE  | `/api/races/{id}`            | Rennen löschen               
| PUT     | `/api/races/{id}/results`    | Rennergebnisse aktualisieren 

### 🎯 Tipps
| Methode | Pfad                         | Beschreibung            
| ------- | ---------------------------- | ----------------------- 
| GET     | `/api/tips/race/{raceId}`    | Tipp für Rennen abrufen      
| POST    | `/api/tips`                  | Tipp erstellen/aktualisieren 
| PUT     | `/api/tips`                  | Tipp aktualisieren           
| GET     | `/api/tips/user/{userId}`    | Alle Tipps eines Users       

### 👤 User         
| Methode | Pfad                         | Beschreibung            
| ------- | ---------------------------- | ----------------------- 
| GET     | `/api/users/me`              | Aktuelles User-Profil 
| PUT     | `/api/users/me`              | Profil aktualisieren  
| GET     | `/api/users/{id}`            | User nach ID abrufen  

### 🏎️ Fahrer
| Methode | Pfad                         | Beschreibung            
| ------- | ---------------------------- | ----------------------- 
| GET     | `/api/drivers`               | Alle Fahrer abrufen      
| POST    | `/api/drivers`               | Neuen Fahrer erstellen   
| PUT     | `/api/drivers/{id}`          | Fahrer bearbeiten        
| DELETE  | `/api/drivers/{id}`          | Fahrer löschen           

### 📊 Leaderboard
| Methode | Pfad                         | Beschreibung            
| ------- | ---------------------------- | ----------------------- 
| GET     | `/api/leaderboard`           | Leaderboard abrufen 

### 📋 Offizielle Ergebnisse
| Methode | Pfad                         | Beschreibung            
| ------- | ---------------------------- | ----------------------- 
| GET     | `/api/results/race/{raceId}` | Ergebnisse für Rennen
| POST    | `/api/results`               | Ergebnis erstellen 
| DELETE  | `/api/results/race/{raceId}` | Alle Ergebnisse für Rennen löschen 

---

## 📖 User Stories

### 🎮 Player (Spieler)

- **Als Spieler möchte ich mich registrieren und einloggen**, damit ich am Multi-User-Tippspiel teilnehmen kann und meine Daten von anderen Spielern getrennt sind.

- **Als Spieler möchte ich Tipps für Rennen abgeben**, damit meine Tipps unabhängig von anderen Spielern gespeichert und ausgewertet werden.

- **Als Spieler möchte ich das Leaderboard einsehen**, um meinen Rang und meine Punkte im Vergleich zu anderen Spielern zu sehen.

### 🔐 Admin (Administrator)

- **Als Admin möchte ich Rennen erstellen und verwalten**, damit alle Spieler auf dieselben Rennen tippen können.

- **Als Admin möchte ich den Status von Rennen steuern** (OPEN → VOTING → CLOSED), um festzulegen, wann Spieler Tipps abgeben dürfen.

- **Als Admin möchte ich offizielle Ergebnisse eintragen**, damit die Tipps aller Spieler ausgewertet und das Leaderboard aktualisiert wird.

---

## 🏁 Ablauf eines Rennens

```
1. Admin erstellt Rennen
2. Admin ändert Status auf VOTING
3. Spieler geben Tipps ab
4. Admin schließt Voting
5. Admin trägt offizielle Ergebnisse ein
6. System berechnet Punkte automatisch
7. Spieler sehen ihre Punkte
```

---

## ✅ Validierung & Fehlerbehandlung

Eingaben werden über DTOs validiert, z. B. mit: @NotBlank, @Size und @Email

Fehler werden zentral über einen GlobalExceptionHandler behandelt und als strukturierte Fehlermeldungen an das Frontend zurückgegeben.

```
{
  "status": 400,
  "message": "Validation failed: [fieldName] is required",
  "timestamp": "2025-08-07T10:00:00"
}
```

---

## 🧪 Tests

### 🧪 Testplan (Auswahl)

| Testfall                          | Erwartetes Ergebnis                            |
|-----------------------------------|------------------------------------------------|
| Login mit gültigen Daten          | User erhält JWT-Token                          |
| Login mit ungültigen Daten        | Fehler wird korrekt zurückgegeben              |
| Rennen mit Status VOTING anzeigen | Rennen werden korrekt geladen                  |
| Tipp für Rennen abgeben           | Tipp wird gespeichert                          |
| Tipp eines anderen Users abrufen  | Zugriff wird verhindert (Multi-User-Isolation) |
| Leaderboard abrufen               | Rangliste wird korrekt sortiert angezeigt      |
| Rennen durch Admin erstellen      | Rennen wird gespeichert                        |
| Rennen durch Player erstellen     | Zugriff verweigert                             |

---

### Backend-Tests

Das Backend enthält Unit- und Controller-Tests mit Fokus auf Multi-User-Funktionalität, Authentifizierung und Zugriffskontrolle.

Beispiele getesteter Komponenten:
- AuthController
- RaceController
- TipController
- Service-Logik (z. B. Status-Validierungen)

Tests ausführen:
```bash
cd Backend
mvn test
```

### Frontend-Tests

Im Frontend wurden Komponenten-Tests für zentrale Benutzerflüsse umgesetzt.

Tests ausführen:
```bash
cd Frontend
npm test
```
---

## 🎯 Features im Detail

### Punkteberechnung
Die Punkteberechnung erfolgt automatisch auf Basis der abgegebenen Tipps und der offiziellen Rennergebnisse.  
Dabei werden sowohl exakte Treffer als auch Platzierungsabweichungen berücksichtigt.

**Beispiel:**
- Tipp: Platz 1 = Max Verstappen
- Ergebnis: Platz 1 = Max Verstappen
- → **5 Punkte** (exakter Treffer Podium)

- Tipp: Platz 2 = Lewis Hamilton
- Ergebnis: Platz 5 = Lewis Hamilton
- → **2 Punkte** (Fahrer im Top 10, aber falsche Position, ursprünglich Podium-Platz)

---

## 🛡️ Sicherheit

- **JWT-basierte Authentifizierung**: für geschützte API-Endpunkte
- **Rollenbasierte Autorisierung**: ADMIN/PLAYER-Rollen werden serverseitig geprüft
- **BCrypt-Passwort-Hashing**: Passwörter werden sicher gespeichert
- **CORS-Konfiguration**: Frontend-Backend-Kommunikation ist konfiguriert
- **Validierung**: DTOs werden mit Jakarta Validation validiert

---

## 👥 Hilfestellungen

- **Unterrichtsbeispiele**
- **Unterstützung durch  Stefi's Bruder** (Testing, Sortierlogik, Fehlerbehebung)
- **ChatGPT**: Hilfe bei Strukturierung, Javadoc, Fehlerbehebung, Doku
- **Internet**: StackOverflow, freeCodeCamp, OpenDataSoft, baeldung, Codecademy

---

## 📘 Lizenz

MIT License – frei nutzbar für Lernzwecke

---

## 👨‍💻 Entwickelt von

Ensar & Stephanie

---

