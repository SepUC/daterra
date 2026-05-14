package com.daterra.api.daterra.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "`USUARIO`", schema = "Daterra") // Asegúrate de que este sea el nombre real de tu tabla en AWS
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

    @ManyToOne
    @JoinColumn(name = "id_tipo_usu")
    private TipoUsuario tipoUsuario;

    @ManyToOne
    @JoinColumn(name = "id_comuna") // Así se llama la columna en la tabla usuarios
    private Comuna comuna;


}