package com.wiss.f1.championship.security;

import com.wiss.f1.championship.entity.AppUser;
import com.wiss.f1.championship.service.AppUserService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Implementierung von Spring Securitys UserDetailsService.
 *
 * Verantwortlich für das Laden von Benutzerinformationen während der Authentifizierung.
 * Wird vom AuthenticationManager verwendet.
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final AppUserService appUserService;

    public UserDetailsServiceImpl(AppUserService appUserService) {
        this.appUserService = appUserService;
    }

    /**
     * Lädt einen Benutzer anhand seines Benutzernamens.
     * @param username Benutzername
     * @return UserDetails (AppUser implementiert UserDetails)
     * @throws UsernameNotFoundException wenn Benutzer nicht existiert
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser user = appUserService.getUserByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        return user;
    }
}

/*
 * Zusammenfassung:
 * Diese Klasse implementiert die Schnittstelle UserDetailsService von Spring Security.
 * Sie lädt Benutzerinformationen aus der Datenbank (via AppUserService) anhand des Benutzernamens.
 * AppUser implementiert UserDetails, daher kann das Objekt direkt zurückgegeben werden.
 * Diese Implementierung wird für die Authentifizierung und Autorisierung von Spring Security genutzt.
 */
