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
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Erlaubte Origins
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:3000"));
        
        // Erlaubte HTTP-Methoden
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        
        // Erlaubte Headers
        configuration.setAllowedHeaders(Arrays.asList("*"));
        
        // Credentials erlauben (für Cookies und Authorization-Header)
        configuration.setAllowCredentials(true);
        
        // Exponierte Headers
        configuration.setExposedHeaders(Arrays.asList("Authorization", "Content-Type"));
        
        // Preflight-Cache für 1 Stunde
        configuration.setMaxAge(3600L);
        
        source.registerCorsConfiguration("/**", configuration);
        
        FilterRegistrationBean<CorsFilter> bean = new FilterRegistrationBean<>(new CorsFilter(source));
        // Wichtig: Filter muss vor Spring Security laufen (Order.HIGHEST_PRECEDENCE)
        bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
        
        return bean;
    }
}

