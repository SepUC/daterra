package com.daterra.api.daterra.repository;

import com.daterra.api.daterra.model.Comuna;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ComunaRepository extends JpaRepository<Comuna, Integer> {
    // Hereda automáticamente todos los métodos como findById, save, existsById, etc.
}