package com.daterra.api.daterra.controller;

import com.daterra.api.daterra.dto.SinaderEstadisticasDTO;
import com.daterra.api.daterra.repository.SinaderEstadisticasRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/sinader/estadisticas")
public class SinaderRM {

    @Autowired
    private SinaderEstadisticasRepository repository;

    @GetMapping("/rm")
    public SinaderEstadisticasDTO getEstadisticasGenerales() {
        SinaderEstadisticasDTO dto = new SinaderEstadisticasDTO();
        dto.setToneladasPorAño(mapearToneladasPorAño(repository.toneladasPorAño()));
        dto.setTopComunasPorToneladas(mapearComunas(repository.topComunasTodosLosAños()));
        dto.setMaterialesPorToneladas(mapearMateriales(repository.materialesTodosLosAños()));
        dto.setTratamientosPorFrecuencia(mapearTratamientos(repository.tratamientosTodosLosAños()));
        return dto;
    }

    @GetMapping("/rm/{año}")
    public SinaderEstadisticasDTO getEstadisticasPorAño(@PathVariable Integer año) {
        SinaderEstadisticasDTO dto = new SinaderEstadisticasDTO();
        dto.setAño(año);
        dto.setToneladasPorAño(mapearToneladasPorAño(repository.toneladasPorAño()));
        dto.setTopComunasPorToneladas(mapearComunas(repository.topComunasPorToneladas(año)));
        dto.setMaterialesPorToneladas(mapearMateriales(repository.materialesPorToneladas(año)));
        dto.setTratamientosPorFrecuencia(mapearTratamientos(repository.tratamientosPorAño(año)));
        return dto;
    }

    private List<Map<String, Object>> mapearToneladasPorAño(List<Object[]> rows) {
        List<Map<String, Object>> list = new ArrayList<>();
        for (Object[] r : rows) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("año",              r[0]);
            m.put("registros",        r[1]);
            m.put("establecimientos", r[2]);
            m.put("toneladas",        r[3] != null ? ((Number) r[3]).doubleValue() : 0);
            list.add(m);
        }
        return list;
    }

    private List<Map<String, Object>> mapearComunas(List<Object[]> rows) {
        List<Map<String, Object>> list = new ArrayList<>();
        for (Object[] r : rows) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("comuna",    r[0]);
            m.put("toneladas", r[1] != null ? ((Number) r[1]).doubleValue() : 0);
            m.put("registros", r[2]);
            list.add(m);
        }
        return list;
    }

    private List<Map<String, Object>> mapearMateriales(List<Object[]> rows) {
        List<Map<String, Object>> list = new ArrayList<>();
        for (Object[] r : rows) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("material",  r[0]);
            m.put("toneladas", r[1] != null ? ((Number) r[1]).doubleValue() : 0);
            m.put("registros", r[2]);
            list.add(m);
        }
        return list;
    }

    private List<Map<String, Object>> mapearTratamientos(List<Object[]> rows) {
        List<Map<String, Object>> list = new ArrayList<>();
        for (Object[] r : rows) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("tratamiento", r[0]);
            m.put("frecuencia",  r[1]);
            m.put("toneladas",   r[2] != null ? ((Number) r[2]).doubleValue() : 0);
            list.add(m);
        }
        return list;
    }
    @GetMapping("/rm/comunas")
    public List<Map<String, Object>> getComunas() {
        List<Map<String, Object>> list = new ArrayList<>();
        for (Object[] r : repository.registroPorComuna()) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("comuna",             r[0]);
            m.put("registros",          r[1]);
            m.put("totalToneladas",     r[2] != null ? ((Number) r[2]).doubleValue() : 0);
            m.put("promedioToneladas",  r[3] != null ? ((Number) r[3]).doubleValue() : 0);
            m.put("maxToneladas",       r[4] != null ? ((Number) r[4]).doubleValue() : 0);
            m.put("minToneladas",       r[5] != null ? ((Number) r[5]).doubleValue() : 0);
            list.add(m);
        }
        return list;
    }

    @GetMapping("/rm/comunas/por-año")
    public List<Map<String, Object>> getComunasPorAño() {
        List<Map<String, Object>> list = new ArrayList<>();
        for (Object[] r : repository.registroPorComunaYAño()) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("año",            r[0]);
            m.put("comuna",         r[1]);
            m.put("registros",      r[2]);
            m.put("totalToneladas", r[3] != null ? ((Number) r[3]).doubleValue() : 0);
            list.add(m);
        }
        return list;
    }
    @GetMapping("/rm/materiales/por-año")
    public List<Map<String, Object>> getMaterialesPorAño() {
        List<Map<String, Object>> list = new ArrayList<>();
        for (Object[] r : repository.materialPorAño()) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("año",            r[0]);
            m.put("material",       r[1]);
            m.put("registros",      r[2]);
            m.put("totalToneladas", r[3] != null ? ((Number) r[3]).doubleValue() : 0);
            list.add(m);
        }
        return list;
    }

    @GetMapping("/rm/materiales/por-año/{año}")
    public ResponseEntity<?> getMaterialesPorAñoFiltrado(@PathVariable Integer año) {
        List<Object[]> resultados = repository.materialPorAñoFiltrado(año);

        // Si la lista está vacía, enviamos un mensaje claro
        if (resultados == null || resultados.isEmpty()) {
            return ResponseEntity.ok("No se encontraron registros para el año: " + año +
                    ". Revisa si la columna 'año' en la vista es realmente un entero.");
        }

        List<Map<String, Object>> list = new ArrayList<>();
        for (Object[] r : resultados) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("año", r[0]);
            m.put("material", r[1]);
            m.put("registros", r[2]);
            m.put("totalToneladas", r[3] != null ? ((Number) r[3]).doubleValue() : 0);
            list.add(m);
        }
        return ResponseEntity.ok(list);
    }

}