package com.daterra.api.daterra.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "SINADER_ALL")
public class SinaderRM {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "año")
    private Integer año;

    @Column(name = "region")
    private String region;

    @Column(name = "nombre_establecimiento")
    private String nombreEstablecimiento;

    @Column(name = "rubro_vu")
    private String rubroVu;

    @Column(name = "cantidad_toneladas")
    private Double cantidadToneladas;

    @Column(name = "tratamiento_nivel_1")
    private String tratamientoNivel1;

    @Column(name = "tratamiento_nivel_3")
    private String tratamientoNivel3;

    @Column(name = "tipo_declaracion")
    private String tipoDeclaracion;

    @Column(name = "capitulo_ler")
    private String capituloLer;

    @Column(name = "subcapitulo_ler")
    private String subcapituloLer;

    @Column(name = "nombre_ler")
    private String nombreLer;

    @Column(name = "comuna")
    private String comuna;

    @Column(name = "provincia")
    private String provincia;

    @Column(name = "latitud")
    private Double latitud;

    @Column(name = "longitud")
    private Double longitud;
}