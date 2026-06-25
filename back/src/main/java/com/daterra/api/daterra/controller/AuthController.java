package com.daterra.api.daterra.controller;

import com.daterra.api.daterra.model.Usuario;
import com.daterra.api.daterra.repository.UsuarioRepository;
import com.daterra.api.daterra.security.JwtUtils; // Importa tu JwtUtils
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtUtils jwtUtils; // Inyectamos el componente de JWT

    @PostMapping("/register")
    public ResponseEntity<?> registrarUsuario(@RequestBody Usuario usuario) {
        // (Tu lógica de registro se mantiene igual)
        if (usuarioRepository.existsById(usuario.getEmail())) {
            return new ResponseEntity<>("El email ya está registrado", HttpStatus.BAD_REQUEST);
        }
        Usuario nuevoUsuario = usuarioRepository.save(usuario);
        return new ResponseEntity<>(nuevoUsuario, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario loginData) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(loginData.getEmail());

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            if (usuario.getPassword().equals(loginData.getPassword())) {

                // GENERAMOS EL TOKEN REAL
                String jwt = jwtUtils.generateToken(usuario.getEmail());

                // Construimos una respuesta profesional con el token
                Map<String, Object> response = new HashMap<>();
                response.put("token", jwt);
                response.put("usuario", usuario.getPrimerNombre() + " " + usuario.getPrimerApellido());
                response.put("email", usuario.getEmail());

                return ResponseEntity.ok(response);
            } else {
                return new ResponseEntity<>("Contraseña incorrecta", HttpStatus.UNAUTHORIZED);
            }
        } else {
            return new ResponseEntity<>("Usuario no encontrado", HttpStatus.NOT_FOUND);
        }
    }
}