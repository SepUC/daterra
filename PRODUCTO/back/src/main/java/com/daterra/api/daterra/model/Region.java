package com.daterra.api.daterra.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "REGION", schema = "Daterra")
public class Region {
    @Id
    @Column(name = "id_region")
    private Integer id_region;

    @Column(name = "nombre_region", nullable = false, length = 100)
    private String nombre_region;

    @ManyToOne
    @JoinColumn(name = "id_pais", nullable = false)
    private Pais pais;
}