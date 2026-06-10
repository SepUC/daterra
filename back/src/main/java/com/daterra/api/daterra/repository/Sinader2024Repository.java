package com.daterra.api.daterra.repository;

import com.daterra.api.daterra.model.Sinader2024;
import com.daterra.api.daterra.dto.ResumenDTO; // Importa tu DTO
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface Sinader2024Repository extends JpaRepository<Sinader2024, Long> {

    // Nota: Usamos el nombre de la clase DTO y sus campos en el constructor de JPQL
    @Query("SELECT new com.daterra.api.daterra.dto.ResumenDTO(s.region, SUM(s.cantidad_toneladas)) " +
            "FROM Sinader2024 s " +
            "GROUP BY s.region " +
            "ORDER BY SUM(s.cantidad_toneladas) DESC")
    List<ResumenDTO> obtenerResumenRegiones();

    @Query("SELECT new com.daterra.api.daterra.dto.ResumenDTO(s.tratamiento_n1_name, SUM(s.cantidad_toneladas)) " +
            "FROM Sinader2024 s " +
            "GROUP BY s.tratamiento_n1_name " +
            "ORDER BY SUM(s.cantidad_toneladas) DESC")
    List<ResumenDTO> obtenerResumenTratamientos();
}