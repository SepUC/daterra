package com.daterra.api.daterra.controller;

import com.daterra.api.daterra.model.Usuario;
import com.daterra.api.daterra.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/register")
    public ResponseEntity<?> registrarUsuario(@RequestBody Usuario usuario) {
        try {
            // Verificamos si el email ya está registrado
            if (usuarioRepository.existsById(usuario.getEmail())) {
                return new ResponseEntity<>("El email ya está registrado", HttpStatus.BAD_REQUEST);
            }

            Usuario nuevoUsuario = usuarioRepository.save(usuario);
            return new ResponseEntity<>(nuevoUsuario, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al registrar: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario loginData) {
        // Buscamos por email
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(loginData.getEmail());

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            if (usuario.getPassword().equals(loginData.getPassword())) {
                return ResponseEntity.ok(usuario);
            } else {
                return new ResponseEntity<>("Contraseña incorrecta", HttpStatus.UNAUTHORIZED);
            }
        } else {
            return new ResponseEntity<>("Usuario no encontrado", HttpStatus.NOT_FOUND);
        }
    }
}