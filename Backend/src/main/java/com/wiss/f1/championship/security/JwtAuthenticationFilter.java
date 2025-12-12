package com.wiss.f1.championship.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.wiss.f1.championship.entity.AppUser;
import com.wiss.f1.championship.service.AppUserService;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * JWT-Authentifizierungsfilter.
 *
 * Wird bei jeder Anfrage einmal ausgeführt (OncePerRequestFilter).
 * Prüft den Authorization-Header auf ein JWT-Token und authentifiziert
 * den Benutzer im Spring Security-Kontext, falls das Token gültig ist.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final AppUserService userService;

    public JwtAuthenticationFilter(JwtService jwtService, AppUserService userService) {
        this.jwtService = jwtService;
        this.userService = userService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // OPTIONS-Requests für CORS Preflight direkt durchlassen
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        // Authorization-Header prüfen
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // JWT-Token extrahieren
        String token = authHeader.substring(7);

        // Claims aus dem Token extrahieren
        Claims claims = jwtService.extractClaims(token);
        String username = claims.getSubject();

        // Benutzer anhand des Usernames laden
        AppUser user = userService.getUserByUsername(username).orElse(null);
        if (user != null) {
            // Spring Security Authentication Token erzeugen
            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(
                            user,              // Principal
                            null,              // Credentials (nicht benötigt, Token reicht)
                            user.getAuthorities() // Rollen / Berechtigungen
                    );

            // Details der Anfrage setzen
            auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            // Authentifizierung im SecurityContext speichern
            SecurityContextHolder.getContext().setAuthentication(auth);
        }

        // Filterkette fortsetzen
        filterChain.doFilter(request, response);
    }
}

/*
 * Zusammenfassung:
 * Der JwtAuthenticationFilter prüft bei jeder HTTP-Anfrage, ob ein gültiges JWT
 * im Authorization-Header vorhanden ist. Wenn ja, wird der zugehörige AppUser
 * geladen und im SecurityContext authentifiziert. So können Controller und Services
 * auf den aktuell angemeldeten Benutzer zugreifen.
 */
