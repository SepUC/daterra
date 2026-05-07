package com.daterra.api.daterra.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "Comuna")

public class Comuna {
    @Id
    @Column(name = "id_comuna")
    private Integer id_comuna;
    private String nombre_comuna;
    private int id_ciudad;

}
