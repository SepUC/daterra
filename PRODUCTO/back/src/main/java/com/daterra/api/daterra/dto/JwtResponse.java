package com.daterra.api.daterra.dto;

public class JwtResponse {
    private String token;
    private String email;
    private String nombre;

    // --- CORRECCIÓN AQUÍ ---
    public JwtResponse(String token, String email, String nombre) {
        this.token = token;
        this.email = email;
        this.nombre = nombre;
    }

    // Getters
    public String getToken() { return token; }
    public String getEmail() { return email; }
    public String getNombre() { return nombre; }
}