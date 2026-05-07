package com.daterra.api.daterra.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "Usuario") // Asegúrate de que este sea el nombre real de tu tabla en AWS
public class Usuario {

    @Id
    @Column(name = "run_usu") // Coincide con la llave dorada de tu imagen
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

    @Column(name = "email_usu")
    private String email;

    @Column(name = "direccion_usu")
    private String direccion;

    @Column(name = "telefono_usu")
    private String telefono;

    @Column(name = "password_usu")
    private String password;

    @ManyToOne
    @JoinColumn(name = "id_comuna") // Así se llama la columna en la tabla usuarios
    private Comuna comuna;
}