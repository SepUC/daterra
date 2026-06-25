package com.daterra.api.daterra.dto;

public class JwtResponseDTO {
    private String token;
    private String email;
    private String nombre;

    public JwtResponseDTO(String token, String email, String nombre) {
        this.token = token;
        this.email = email;
        this.nombre = nombre;
    }

    // Getters necesarios para que Spring convierta esto a JSON
    public String getToken() { return token; }
    public String getEmail() { return email; }
    public String getNombre() { return nombre; }
}