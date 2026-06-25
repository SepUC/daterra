package com.daterra.api.daterra.controller;

import com.daterra.api.daterra.dto.ResumenDTO;
import com.daterra.api.daterra.repository.Sinader2024Repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/sinader")
public class Sinader2024Controller {

    @Autowired
    private Sinader2024Repository repository;

    @GetMapping("/regiones")
    public List<ResumenDTO> getResumenRegiones() {
        return repository.obtenerResumenRegiones();
    }

    @GetMapping("/tratamientos")
    public List<ResumenDTO> getResumenTratamientos() {
        return repository.obtenerResumenTratamientos();
    }
}