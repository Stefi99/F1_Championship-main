package com.wiss.f1.championship.service;

import com.wiss.f1.championship.entity.AppUser;
import com.wiss.f1.championship.entity.Role;
import com.wiss.f1.championship.repository.AppUserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

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

    public AppUser registerUser(String username, String rawPassword, Role role) {

        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username already exists");
        }

        String hashedPassword = passwordEncoder.encode(rawPassword);

        AppUser user = new AppUser(username, hashedPassword, role);

        return userRepository.save(user);
    }

    public AppUser authenticate(String username, String rawPassword) {

        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new IllegalArgumentException("Invalid password");
        }

        return user;
    }
}
