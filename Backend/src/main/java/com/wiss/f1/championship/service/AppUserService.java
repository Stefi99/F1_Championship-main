package com.wiss.f1.championship.service;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.wiss.f1.championship.entity.AppUser;
import com.wiss.f1.championship.entity.Role;
import com.wiss.f1.championship.repository.AppUserRepository;

@Service
public class AppUserService {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AppUserService(AppUserRepository userRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Optional<AppUser> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<AppUser> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<AppUser> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * Sucht einen User anhand von Email oder Username.
     * @param identifier Email oder Username
     * @return Optional mit dem gefundenen User, oder empty wenn nicht gefunden
     */
    public Optional<AppUser> getUserByIdentifier(String identifier) {
        // Versuche zuerst per Email zu finden
        Optional<AppUser> userByEmail = userRepository.findByEmail(identifier);
        if (userByEmail.isPresent()) {
            return userByEmail;
        }
        // Falls nicht gefunden, versuche per Username
        return userRepository.findByUsername(identifier);
    }

    public AppUser registerUser(String username, String email, String rawPassword, Role role) {
        return registerUser(username, email, rawPassword, role, null);
    }

    public AppUser registerUser(String username, String email, String rawPassword, Role role, String displayName) {

        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already exists");
        }

        String hashedPassword = passwordEncoder.encode(rawPassword);

        AppUser user = new AppUser(username, email, hashedPassword, role, displayName);
        return userRepository.save(user);
    }

    /**
     * Authentifiziert einen User anhand von Email oder Username und Passwort.
     * @param identifier Email oder Username
     * @param rawPassword Das Klartext-Passwort
     * @return Der authentifizierte User
     * @throws IllegalArgumentException Wenn User nicht gefunden oder Passwort falsch
     */
    public AppUser authenticate(String identifier, String rawPassword) {
        AppUser user = getUserByIdentifier(identifier)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new IllegalArgumentException("Invalid password");
        }

        return user;
    }
}
