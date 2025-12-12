package com.wiss.f1.championship.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.wiss.f1.championship.security.JwtAuthenticationFilter;

@EnableMethodSecurity
@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        // BCrypt-Password-Encoder zum sicheren Hashen von Passwörtern
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http,
                                           JwtAuthenticationFilter jwtFilter) throws Exception {

        // Definiert alle Security-Einstellungen der Anwendung
        http.csrf(csrf -> csrf.disable()) // CSRF für API deaktivieren
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // CORS aktivieren
                .sessionManagement(sm ->
                        sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Keine Sessions, reines JWT
                .authorizeHttpRequests(auth -> auth
                        // OPTIONS-Requests erlauben (CORS Preflight)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Auth-Endpunkte (Login/Registrierung) offen lassen
                        .requestMatchers("/api/auth/**").permitAll()

                        // Admin-Endpunkte nur für Nutzer mit ADMIN-Rolle
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // Player-Endpunkte nur mit PLAYER-Rolle
                        .requestMatchers("/api/player/**").hasRole("PLAYER")

                        // Drivers: GET öffentlich, Änderungen nur für Admin
                        .requestMatchers(HttpMethod.GET, "/api/drivers/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/drivers/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/drivers/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/drivers/**").hasRole("ADMIN")

                        // Races: Lesen öffentlich, ändern nur Admin
                        .requestMatchers(HttpMethod.GET, "/api/races/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/races/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/races/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/races/**").hasRole("ADMIN")

                        // Results: nur Admin
                        .requestMatchers("/api/results/**").hasRole("ADMIN")

                        // Leaderboard, Tips, User-Profile: Nutzer müssen eingeloggt sein
                        .requestMatchers("/api/leaderboard/**").authenticated()
                        .requestMatchers("/api/tips/**").authenticated()
                        .requestMatchers("/api/users/**").authenticated()

                        // Alles andere ebenfalls nur für authentifizierte Nutzer
                        .anyRequest().authenticated()
                )
                // Registriert eigenen JWT-Filter VOR dem UsernamePasswordAuthenticationFilter
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        // Stellt den AuthenticationManager bereit, der für Login-Authentifizierung benötigt wird
        return config.getAuthenticationManager();
    }

    /**
     * CORS-Konfiguration für Spring Security.
     * Definiert erlaubte Origins, Methoden und Header für das Frontend.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Erlaubte Frontend-Domains
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:5173",
                "http://localhost:3000"
        ));

        // Erlaubte HTTP-Methoden
        configuration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"
        ));

        // Erlaubt alle Header
        configuration.setAllowedHeaders(Arrays.asList("*"));

        // Credentials wie Cookies und Authorization-Header erlauben
        configuration.setAllowCredentials(true);

        // Sichtbare Response-Header
        configuration.setExposedHeaders(Arrays.asList("Authorization", "Content-Type"));

        // Preflight-Cache
        configuration.setMaxAge(3600L);

        // Registriert CORS für alle Endpunkte
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    // Zusätzliche WebMvc CORS-Unterstützung (ergänzt Security CORS)
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                // Zusätzliche CORS-Regeln für MVC-Schicht
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:5173", "http://localhost:3000")
                        .allowedMethods("*")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}

/* ------------------------------------------------------------------------------------------
   ZUSAMMENFASSUNG
   ------------------------------------------------------------------------------------------
   Die SecurityConfig definiert die gesamte Sicherheitslogik der Anwendung.
   Sie:
   - aktiviert JWT-basierte Authentifizierung (statt Sessions)
   - legt fest, welche Endpunkte welche Rollen benötigen
   - integriert den JwtAuthenticationFilter
   - konfiguriert CORS sowohl für Security als auch WebMvc
   - stellt PasswordEncoder und AuthenticationManager bereit

   Dadurch wird sichergestellt, dass die API sicher,
   rollenbasiert geschützt und korrekt mit dem Frontend nutzbar ist.
------------------------------------------------------------------------------------------- */
