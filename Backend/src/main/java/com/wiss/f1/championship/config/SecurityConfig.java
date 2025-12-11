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
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http,
                                           JwtAuthenticationFilter jwtFilter) throws Exception {

        http.csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // OPTIONS-Requests für CORS Preflight explizit erlauben
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()    // Register + Login erlaubt
                        .requestMatchers("/api/admin/**").hasRole("ADMIN") // Admin muss eingeloggt + ADMIN-Rolle
                        .requestMatchers("/api/player/**").hasRole("PLAYER") // Player-Routen
                        // Drivers: GET öffentlich, POST/PUT/DELETE nur für Admin
                        .requestMatchers(HttpMethod.GET, "/api/drivers/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/drivers/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/drivers/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/drivers/**").hasRole("ADMIN")
                        // Races: GET authentifiziert, POST/PUT/DELETE nur für Admin
                        .requestMatchers(HttpMethod.GET, "/api/races/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/races/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/races/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/races/**").hasRole("ADMIN")
                        // Results: Nur Admin
                        .requestMatchers("/api/results/**").hasRole("ADMIN")
                        // Leaderboard und Tips: Authentifizierte User
                        .requestMatchers("/api/leaderboard/**").authenticated()
                        .requestMatchers("/api/tips/**").authenticated()
                        // User-Profile: Authentifizierte User
                        .requestMatchers("/api/users/**").authenticated()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * CORS-Konfiguration für Spring Security
     * Erlaubt Requests vom Frontend (localhost:5173)
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setExposedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setMaxAge(3600L); // Cache Preflight-Requests für 1 Stunde
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    //WebConfig für zusätzliche CORS-Unterstützung
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:5173", "http://localhost:3000")
                        .allowedMethods("*")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
