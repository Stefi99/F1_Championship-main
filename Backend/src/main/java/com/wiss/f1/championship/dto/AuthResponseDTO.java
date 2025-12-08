package com.wiss.f1.championship.dto;

public class AuthResponseDTO {

    private Long id;
    private String username;
    private String role;
    private String token;

    public AuthResponseDTO(Long id, String username, String role, String token) {
        this.id = id;
        this.username = username;
        this.role = role;
        this.token = token;
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getRole() { return role; }
    public String getToken() { return token; }
}
