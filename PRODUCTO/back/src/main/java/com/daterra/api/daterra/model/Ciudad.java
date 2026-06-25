package com.daterra.api.daterra.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "CIUDAD", schema = "Daterra")
public class Ciudad {
    @Id
    @Column(name = "id_ciudad")
    private Integer id_ciudad;

    @Column(name = "nombre_ciudad", nullable = false, length = 100)
    private String nombre_ciudad;

    @ManyToOne
    @JoinColumn(name = "id_region", nullable = false)
    private Region region;
}