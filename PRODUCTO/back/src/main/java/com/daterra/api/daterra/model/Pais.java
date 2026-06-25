package com.daterra.api.daterra.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "PAIS", schema = "Daterra")
public class Pais {
    @Id
    @Column(name = "id_pais")
    private Integer id_pais;

    @Column(name = "nombre_pais", nullable = false, length = 100)
    private String nombre_pais;
}