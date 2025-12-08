package com.wiss.f1.championship.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AdminTestController {

    @GetMapping("/api/admin/test")
    public String adminTest() {
        return "Admin ok!";
    }
}
