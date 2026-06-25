package com.daterra.api.daterra.model;

import jakarta.persistence.*;
import lombok.Data; // <--- Esto es vital para que existan los Setters automáticamente

@Entity
@Data // <--- Asegúrate de tener esta anotación aquí arriba
@Table(name = "COMUNA", schema = "Daterra")
public class Comuna {

    @Id
    @Column(name = "id_comuna")
    private Integer id_comuna;

    @Column(name = "nombre_comuna", nullable = false, length = 100)
    private String nombre_comuna;

    // ESTO ES LO QUE ESTÁ BUSCANDO EL COMPILADOR:
    @ManyToOne
    @JoinColumn(name = "id_ciudad", nullable = false)
    private Ciudad ciudad; // El campo debe llamarse exactamente 'ciudad'
}