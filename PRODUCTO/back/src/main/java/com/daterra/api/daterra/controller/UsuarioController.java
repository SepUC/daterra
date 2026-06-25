package com.daterra.api.daterra.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.daterra.api.daterra.dto.UsuarioResponseDTO;
import com.daterra.api.daterra.dto.RegistroRequest;
import com.daterra.api.daterra.model.Usuario;
import com.daterra.api.daterra.model.TipoUsuario;
import com.daterra.api.daterra.model.Comuna;
import com.daterra.api.daterra.repository.UsuarioRepository;

@RestController
@RequestMapping("/api/usuarios")
//@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
//@CrossOrigin(originPatterns = "*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/registrar")
    public ResponseEntity<?> registrarUsuario(@RequestBody RegistroRequest request) {
        try {
            Usuario usuario = new Usuario();

            // Datos Obligatorios y Opcionales
            usuario.setRunUsuario(request.getRunUsuario());
            usuario.setDvrunUsuario(request.getDvrunUsuario());
            usuario.setPrimerNombre(request.getPrimerNombre());
            usuario.setSegundoNombre(request.getSegundoNombre());
            usuario.setPrimerApellido(request.getPrimerApellido());
            usuario.setSegundoApellido(request.getSegundoApellido());
            usuario.setEmail(request.getEmail());
            usuario.setDireccion(request.getDireccion());
            usuario.setTelefono(request.getTelefono());
            usuario.setPassword(request.getPassword());

            // Relación TipoUsuario (id_tipo_usu)
            if (request.getIdTipoUsu() != null) {
                TipoUsuario tipo = new TipoUsuario();
                tipo.setId_tipo_usu(request.getIdTipoUsu());
                usuario.setTipoUsuario(tipo);
            }

            // Relación Comuna (id_comuna)
            if (request.getIdComuna() != null) {
                Comuna comuna = new Comuna();
                comuna.setId_comuna(request.getIdComuna());
                usuario.setComuna(comuna);
            }

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

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error al registrar: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
