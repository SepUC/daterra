package com.daterra.api.daterra.repository;

import com.daterra.api.daterra.model.PuntoLimpio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PuntoLimpioRepository extends JpaRepository<PuntoLimpio, Long> {
    // Al extender de JpaRepository, ya tienes funciones como .count() y .saveAll()
}
