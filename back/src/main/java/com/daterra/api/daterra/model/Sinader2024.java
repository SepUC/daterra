package com.daterra.api.daterra.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "SINADER_2024", catalog = "RETC")
@Data
public class Sinader2024 {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer año;
    private Integer mes;
    private String region;
    private String comuna;

    // Al usar guiones bajos en el atributo, Hibernate mapea directo
    // a la columna 'cantidad_toneladas' de AWS sin necesidad de @Column
    private Double cantidad_toneladas;

    private String tratamiento_n1_name;
}