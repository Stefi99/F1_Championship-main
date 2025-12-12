package com.wiss.f1.championship.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

/**
 * Konfiguration für Swagger/OpenAPI Dokumentation.
 * Die API-Dokumentation ist verfügbar unter: http://localhost:8080/swagger-ui.html
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        // Erstellt eine neue OpenAPI-Konfiguration für die Swagger-Dokumentation
        return new OpenAPI()
                .info(new Info()
                        // Titel der API
                        .title("F1 Championship API")
                        // Versionsnummer der API
                        .version("1.0.0")
                        // Beschreibung der API
                        .description("REST API für das F1 Championship Tippspiel")
                        // Kontaktinformationen für Entwickler oder Support
                        .contact(new Contact()
                                .name("F1 Championship Team")
                                .email("support@f1championship.example"))
                        // Lizenzinformationen der API
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                // Fügt ein Security Requirement hinzu, das JWT erwartet
                .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
                // Registriert die Security-Schemes (z. B. Bearer Token)
                .components(new Components()
                        .addSecuritySchemes("Bearer Authentication", createAPIKeyScheme()));
    }

    // Erstellt das JWT-Sicherheitschema für Swagger
    private SecurityScheme createAPIKeyScheme() {
        return new SecurityScheme()
                // HTTP-basiertes Security Schema
                .type(SecurityScheme.Type.HTTP)
                // Gibt an, dass ein Bearer Token genutzt wird
                .bearerFormat("JWT")
                // Authentifizierung erfolgt über "bearer"-Schema
                .scheme("bearer");
    }
}

/* ------------------------------------------------------------------------------------------
   ZUSAMMENFASSUNG
   ------------------------------------------------------------------------------------------
   Diese Klasse konfiguriert die Swagger/OpenAPI-Dokumentation der F1 Championship API.
   Sie definiert API-Informationen (Titel, Version, Beschreibung, Kontakt, Lizenz)
   und richtet ein JWT-Bearer-Authentifizierungsschema ein, sodass die API-Endpunkte
   in Swagger mit Tokens getestet werden können.
------------------------------------------------------------------------------------------- */
