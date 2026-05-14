package com.daterra.api.daterra.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "`USUARIO`", schema = "Daterra")
public class Usuario {

    @Id
    @Column(name = "email_usu")
    private String email;

    @Column(name = "run_usu")
    private Integer runUsuario;

    @Column(name = "dvrun_usu")
    private String dvrunUsuario;

    @Column(name = "pnombre_usu")
    private String primerNombre;

    @Column(name = "snombre_usu")
    private String segundoNombre;

    @Column(name = "papellido_usu")
    private String primerApellido;

    @Column(name = "sapellido_usu")
    private String segundoApellido;

    @Column(name = "direccion_usu")
    private String direccion;

    @Column(name = "telefono_usu")
    private String telefono;

    @Column(name = "password_usu")
    private String password;

    // --- SOLUCIÓN TIPO USUARIO ---
    // Atributo para INSERTAR/ACTUALIZAR el ID que viene de React
    @Column(name = "id_tipo_usu")
    private Integer idTipoUsu;

    // Relación para LEER la información completa del tipo
    @ManyToOne
    @JoinColumn(name = "id_tipo_usu", insertable = false, updatable = false)
    private TipoUsuario tipoUsuario;


    // --- SOLUCIÓN COMUNA ---
    // Atributo para INSERTAR/ACTUALIZAR el ID que viene de React
    @Column(name = "id_comuna")
    private Integer idComuna;

    // Relación para LEER la información completa de la comuna
    @ManyToOne
    @JoinColumn(name = "id_comuna", insertable = false, updatable = false)
    private Comuna comuna;
}