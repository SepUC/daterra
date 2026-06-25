package com.daterra.api.daterra.repository;

import com.daterra.api.daterra.model.Municipio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MunicipioRepository extends JpaRepository<Municipio, Integer> {
    // Aquí usamos Integer porque el id_muni en tu base de datos es INT
}