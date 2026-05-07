package com.daterra.api.daterra.repository;

import com.daterra.api.daterra.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    // Spring Boot entiende automáticamente que debe buscar por la columna mapeada a "email"
    Optional<Usuario> findByEmail(String email);
}