package com.daterra.api.daterra.repository;

import com.daterra.api.daterra.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
// ESTA LÍNEA ES LA CLAVE: debe tener el "extends JpaRepository<Usuario, Long>"
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
}