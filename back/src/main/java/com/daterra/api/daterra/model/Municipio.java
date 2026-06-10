package com.daterra.api.daterra.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "MUNICIPIO", schema = "Daterra")
public class Municipio {

    @Id
    // QUITAMOS @GeneratedValue porque usaremos los IDs del JSON (295, 332, etc.)
    @Column(name = "id_muni")
    private Integer id_muni;

    @Column(name = "nombre_muni", nullable = false, length = 100)
    private String nombre_muni;

    @Column(name = "direccion_muni", length = 255)
    private String direccion_muni;

    @Column(name = "email_muni", length = 100)
    private String email_muni;

    @ManyToOne
    @JoinColumn(name = "id_comuna", nullable = false)
    private Comuna comuna;

    // Método de conveniencia para la carga rápida
    public void setId_comuna_manual(Integer id) {
        if (this.comuna == null) {
            this.comuna = new Comuna();
        }
        this.comuna.setId_comuna(id);
    }
}