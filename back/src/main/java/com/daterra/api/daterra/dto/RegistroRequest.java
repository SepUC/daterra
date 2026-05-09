package com.daterra.api.daterra.dto;

import lombok.Data;

@Data
public class RegistroRequest {
    private Integer runUsuario;
    private String dvrunUsuario;
    private String primerNombre;
    private String segundoNombre; // Nuevo
    private String primerApellido;
    private String segundoApellido; // Nuevo
    private String email;
    private String direccion; // Nuevo
    private String telefono; // Nuevo
    private String password;
    private Integer idTipoUsu;
    private Integer idComuna;
}