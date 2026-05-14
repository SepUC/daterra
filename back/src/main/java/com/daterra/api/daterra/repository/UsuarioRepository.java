package com.daterra.api.daterra.repository;

import com.daterra.api.daterra.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, String> {
    // Buscar por email (que ahora es el @Id)
    Optional<Usuario> findByEmail(String email);
}