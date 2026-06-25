package com.daterra.api.daterra.dto;

public class UsuarioResponseDTO {
    private String email;
    private Integer runUsuario;
    private String dvrunUsuario;
    private String primerNombre;
    private String segundoNombre;
    private String primerApellido;
    private String segundoApellido;
    private String direccion;
    private String telefono;
    private Integer idComuna;

    public UsuarioResponseDTO(
            String email,
            Integer runUsuario,
            String dvrunUsuario,
            String primerNombre,
            String segundoNombre,
            String primerApellido,
            String segundoApellido,
            String direccion,
            String telefono,
            Integer idComuna) {
        this.email = email;
        this.runUsuario = runUsuario;
        this.dvrunUsuario = dvrunUsuario;
        this.primerNombre = primerNombre;
        this.segundoNombre = segundoNombre;
        this.primerApellido = primerApellido;
        this.segundoApellido = segundoApellido;
        this.direccion = direccion;
        this.telefono = telefono;
        this.idComuna = idComuna;
    }

    public String getEmail() { return email; }
    public Integer getRunUsuario() { return runUsuario; }
    public String getDvrunUsuario() { return dvrunUsuario; }
    public String getPrimerNombre() { return primerNombre; }
    public String getSegundoNombre() { return segundoNombre; }
    public String getPrimerApellido() { return primerApellido; }
    public String getSegundoApellido() { return segundoApellido; }
    public String getDireccion() { return direccion; }
    public String getTelefono() { return telefono; }
    public Integer getIdComuna() { return idComuna; }
}
