package com.daterra.api.daterra.controller;

import com.daterra.api.daterra.model.PuntoLimpio;
import com.daterra.api.daterra.repository.PuntoLimpioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/puntos")
@CrossOrigin(origins = "http://localhost:5173") // ¡Crucial! Permite que tu Frontend se conecte sin problemas de CORS
public class PuntoLimpioController {

    @Autowired
    private PuntoLimpioRepository puntoLimpioRepository;

    @GetMapping
    public List<PuntoLimpio> getAllPuntos() {
        // Esto va a AWS, toma los registros y los escupe como JSON
        return puntoLimpioRepository.findAll();
    }
}