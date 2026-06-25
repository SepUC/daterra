package com.daterra.api.daterra.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class SinaderEstadisticasDTO {
    private int año;
    private long totalRegistros;
    private long totalEstablecimientos;
    private double totalToneladasRM;
    private List<Map<String, Object>> toneladasPorAño;
    private List<Map<String, Object>> topComunasPorToneladas;
    private List<Map<String, Object>> materialesPorToneladas;
    private List<Map<String, Object>> tratamientosPorFrecuencia;
}