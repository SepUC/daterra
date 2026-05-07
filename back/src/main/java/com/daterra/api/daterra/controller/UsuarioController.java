package com.daterra.api.daterra.controller;
import com.daterra.api.daterra.dto.LoginRequest;
import com.daterra.api.daterra.model.Usuario;
import com.daterra.api.daterra.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth") // Cambiamos la ruta a algo más estándar para seguridad
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginData) {
        // 1. Buscamos al usuario por el email (que en la DB es email_usu)
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(loginData.getEmail());

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();

            // 2. Verificamos la contraseña (password_usu en la DB)
            // IMPORTANTE: Aquí comparamos texto plano por ahora, pero luego deberías usar BCrypt
            if (usuario.getPassword().equals(loginData.getPassword())) {

                // Si todo está bien, devolvemos el usuario (puedes elegir no mandar la password al front)
                usuario.setPassword(null);
                return ResponseEntity.ok(usuario);

            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Contraseña incorrecta");
            }
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
    }
}