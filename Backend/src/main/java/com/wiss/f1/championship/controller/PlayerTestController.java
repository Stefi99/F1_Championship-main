package com.wiss.f1.championship.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PlayerTestController {

    @GetMapping("/api/player/test")
    public String playerTest() {
        return "Player ok!";
    }
}
