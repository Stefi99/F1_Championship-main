package com.wiss.f1.championship.dto;

public class AuthRequestDTO {

    private String email;
    private String username;
    private String password;
    private String role; // ADMIN oder PLAYER

    public String getEmail() { return email; }
    public String getUsername() { return username; }
    public String getPassword() { return password; }
    public String getRole() { return role; }
}
