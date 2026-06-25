package com.daterra.api.daterra.model;
import jakarta.persistence.*; // o javax.persistence.* si usas Spring Boot antiguo
import lombok.Data;

@Entity
@Data
@Table(name = "TIPO_USUARIO")
public class TipoUsuario {
    @Id
    private Integer id_tipo_usu;
    private String nombre_rol;

    // Genera los Getters y Setters (clave para que Spring funcione)
}
