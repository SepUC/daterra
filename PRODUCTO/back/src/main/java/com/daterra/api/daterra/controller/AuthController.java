package com.daterra.api.daterra.controller;

import com.daterra.api.daterra.dto.JwtResponse; // Tu DTO de respuesta limpio
import com.daterra.api.daterra.dto.LoginRequest;     // DTO de entrada para login
import com.daterra.api.daterra.dto.UsuarioResponseDTO;
import com.daterra.api.daterra.model.Usuario;
import com.daterra.api.daterra.repository.UsuarioRepository;
import com.daterra.api.daterra.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/register")
    public ResponseEntity<?> registrarUsuario(@RequestBody Usuario usuario) {
        if (usuarioRepository.existsById(usuario.getEmail())) {
            return new ResponseEntity<>("El email ya está registrado", HttpStatus.BAD_REQUEST);
        }
        // Nota: En producción, recuerda encriptar la contraseña antes de guardar
        Usuario nuevoUsuario = usuarioRepository.save(usuario);
        UsuarioResponseDTO response = new UsuarioResponseDTO(
                nuevoUsuario.getEmail(),
                nuevoUsuario.getRunUsuario(),
                nuevoUsuario.getDvrunUsuario(),
                nuevoUsuario.getPrimerNombre(),
                nuevoUsuario.getSegundoNombre(),
                nuevoUsuario.getPrimerApellido(),
                nuevoUsuario.getSegundoApellido(),
                nuevoUsuario.getDireccion(),
                nuevoUsuario.getTelefono(),
                nuevoUsuario.getIdComuna()
        );
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginData) {
        // Buscamos al usuario en la BD
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(loginData.getEmail());

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();

            // Validación de contraseña
            if (usuario.getPassword().equals(loginData.getPassword())) {

                // 1. Generamos el token JWT
                String jwt = jwtUtils.generateToken(usuario.getEmail());

                // 2. Construimos el DTO de respuesta (SOLO lo necesario)
                // Aquí el idTipoUsu queda fuera automáticamente
                JwtResponse response = new JwtResponse(
                        jwt,
                        usuario.getEmail(),
                        usuario.getPrimerNombre()
                );

                return ResponseEntity.ok(response);
            } else {
                return new ResponseEntity<>("Contraseña incorrecta", HttpStatus.UNAUTHORIZED);
            }
        } else {
            return new ResponseEntity<>("Usuario no encontrado", HttpStatus.NOT_FOUND);
        }
    }
}
