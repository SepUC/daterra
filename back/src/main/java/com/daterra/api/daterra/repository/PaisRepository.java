package com.daterra.api.daterra.repository;

import com.daterra.api.daterra.model.Pais;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaisRepository extends JpaRepository<Pais, Integer> {
}