package com.wiss.f1.championship.config;

import java.util.Arrays;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

/**
 * Separate CORS-Konfiguration, die sicherstellt, dass CORS-Filter
 * vor Spring Security läuft und Preflight-Requests korrekt behandelt.
 */
@Configuration
public class CorsConfig {

    @Bean
    public FilterRegistrationBean<CorsFilter> corsFilterRegistration() {
        // Quelle für CORS-Konfiguration basierend auf URL-Pfaden
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        // Neue CORS-Konfiguration erstellen
        CorsConfiguration configuration = new CorsConfiguration();

        // Definiert, welche Origins (Domains) auf das Backend zugreifen dürfen
        configuration.setAllowedOrigins(
                Arrays.asList("http://localhost:5173", "http://localhost:3000")
        );

        // Legt fest, welche HTTP-Methoden erlaubt sind
        configuration.setAllowedMethods(
                Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
        );

        // Erlaubt alle Header-Typen
        configuration.setAllowedHeaders(Arrays.asList("*"));

        // Erlaubt Cookies, Tokens und andere Credentials
        configuration.setAllowCredentials(true);

        // Gibt an, welche Header im Response sichtbar sein dürfen
        configuration.setExposedHeaders(
                Arrays.asList("Authorization", "Content-Type")
        );

        // Wie lange Preflight-Requests gecachet werden dürfen (in Sekunden)
        configuration.setMaxAge(3600L);

        // Registriert die CORS-Konfiguration für alle Endpunkte (/**)
        source.registerCorsConfiguration("/**", configuration);

        // Erstellt einen Filter, der die oben definierte CORS-Konfiguration anwendet
        FilterRegistrationBean<CorsFilter> bean =
                new FilterRegistrationBean<>(new CorsFilter(source));

        // Legt fest, dass der Filter vor Security ausgeführt wird
        bean.setOrder(Ordered.HIGHEST_PRECEDENCE);

        return bean;
    }
}

/* ------------------------------------------------------------------------------------------
   ZUSAMMENFASSUNG
   ------------------------------------------------------------------------------------------
   Diese Klasse stellt eine zentrale CORS-Konfiguration bereit. Sie definiert,
   welche Domains, Header und HTTP-Methoden auf das Backend zugreifen dürfen.
   Der Filter wird mit höchster Priorität ausgeführt, damit CORS-Anfragen
   bereits vor der Spring-Security-Kette korrekt behandelt werden.
------------------------------------------------------------------------------------------- */
