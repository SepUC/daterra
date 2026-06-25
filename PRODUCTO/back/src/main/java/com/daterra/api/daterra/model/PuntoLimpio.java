package com.daterra.api.daterra.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "PUNTO_LIMPIO")
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class PuntoLimpio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_plimpio")
    private Long id_plimpio;

    private String owner;

    @Column(name = "address_name", length = 500)
    @JsonProperty("address_name")
    private String address_name;

    private String lat;
    private String lng;
    private String type;
    private String status;
    private String manager;
    private Double distance;

    @Column(name = "id_muni")
    private Integer id_muni;

    @Column(name = "materials")
    private String materials;

    @Transient // No se guarda en la tabla PUNTO_LIMPIO, solo sirve para el proceso
    private String nombreMuniTmp;

    // --- LÓGICA DE DESEMPAQUE DEL JSON ---

    @JsonProperty("commune")
    private void unpackCommune(Map<String, Object> commune) {
        if (commune != null) {
            this.id_muni = (Integer) commune.get("id");
            this.nombreMuniTmp = (String) commune.get("name");
        }
    }

    @JsonProperty("materials")
    private void unpackMaterials(List<String> materialsList) {
        if (materialsList != null) {
            this.materials = String.join(", ", materialsList); // Convierte ["glass", "plastic"] en "glass, plastic"
        }
    }
}