package com.daterra.api.daterra.controller;
import com.daterra.api.daterra.model.Usuario;
import com.daterra.api.daterra.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins="*")
public class UsuarioController {
    @Autowired
    private UsuarioRepository usuarioRepository; // Esta es tu variable (el objeto)

    //Ruta para ver los usuarios
    @GetMapping
    public List<Usuario> getAllUsuarios() {
        // USAMOS LA VARIABLE (minúscula)
        return usuarioRepository.findAll();
    }

    //Ruta para crear un usuario
    @PostMapping("/prueba")
    public Usuario crearPrueba(){
        Usuario u = new Usuario();
        u.setNombre("Juan");
        u.setEmail("Juanexample@email.com");
        // USAMOS LA VARIABLE (minúscula)
        return usuarioRepository.save(u);
    }
}