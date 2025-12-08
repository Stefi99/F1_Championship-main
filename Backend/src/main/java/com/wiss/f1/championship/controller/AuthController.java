package com.wiss.f1.championship.controller;

import com.wiss.f1.championship.entity.AppUser;
import com.wiss.f1.championship.entity.Role;
import com.wiss.f1.championship.service.AppUserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AppUserService userService;

    public AuthController(AppUserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public AppUser register(@RequestParam String username,
                            @RequestParam String password) {

        return userService.registerUser(username, password, Role.PLAYER);
    }

    @PostMapping("/login")
    public AppUser login(@RequestParam String username,
                         @RequestParam String password) {

        return userService.authenticate(username, password);
    }
}
