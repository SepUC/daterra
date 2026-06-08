package com.daterra.api.daterra.repository;

import com.daterra.api.daterra.model.SinaderRM;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface SinaderEstadisticasRepository extends JpaRepository<SinaderRM, Long> {

    @Query(value = """
        SELECT año, COUNT(*) as registros,
               COUNT(DISTINCT nombre_establecimiento) as establecimientos,
               SUM(cantidad_toneladas) as toneladas
        FROM RETC.SINADER_ALL
        WHERE region LIKE '%Metropolitana%'
        GROUP BY año ORDER BY año ASC
        """, nativeQuery = true)
    List<Object[]> toneladasPorAño();

    @Query(value = """
        SELECT comuna, SUM(cantidad_toneladas) as toneladas, COUNT(*) as registros
        FROM RETC.SINADER_ALL
        WHERE region LIKE '%Metropolitana%' AND año = :año
        GROUP BY comuna ORDER BY toneladas DESC LIMIT 10
        """, nativeQuery = true)
    List<Object[]> topComunasPorToneladas(@Param("año") Integer año);

    @Query(value = """
        SELECT comuna, SUM(cantidad_toneladas) as toneladas, COUNT(*) as registros
        FROM RETC.SINADER_ALL
        WHERE region LIKE '%Metropolitana%'
        GROUP BY comuna ORDER BY toneladas DESC LIMIT 10
        """, nativeQuery = true)
    List<Object[]> topComunasTodosLosAños();

    @Query(value = """
        SELECT nombre_ler, SUM(cantidad_toneladas) as toneladas, COUNT(*) as registros
        FROM RETC.SINADER_ALL
        WHERE region LIKE '%Metropolitana%'
        AND nombre_ler IS NOT NULL AND nombre_ler != '' AND año = :año
        GROUP BY nombre_ler ORDER BY toneladas DESC LIMIT 10
        """, nativeQuery = true)
    List<Object[]> materialesPorToneladas(@Param("año") Integer año);

    @Query(value = """
        SELECT nombre_ler, SUM(cantidad_toneladas) as toneladas, COUNT(*) as registros
        FROM RETC.SINADER_ALL
        WHERE region LIKE '%Metropolitana%'
        AND nombre_ler IS NOT NULL AND nombre_ler != ''
        GROUP BY nombre_ler ORDER BY toneladas DESC LIMIT 10
        """, nativeQuery = true)
    List<Object[]> materialesTodosLosAños();

    @Query(value = """
        SELECT tratamiento_nivel_3, COUNT(*) as frecuencia, SUM(cantidad_toneladas) as toneladas
        FROM RETC.SINADER_ALL
        WHERE region LIKE '%Metropolitana%'
        AND tratamiento_nivel_3 IS NOT NULL AND tratamiento_nivel_3 != '' AND año = :año
        GROUP BY tratamiento_nivel_3 ORDER BY frecuencia DESC LIMIT 10
        """, nativeQuery = true)
    List<Object[]> tratamientosPorAño(@Param("año") Integer año);

    @Query(value = """
        SELECT tratamiento_nivel_3, COUNT(*) as frecuencia, SUM(cantidad_toneladas) as toneladas
        FROM RETC.SINADER_ALL
        WHERE region LIKE '%Metropolitana%'
        AND tratamiento_nivel_3 IS NOT NULL AND tratamiento_nivel_3 != ''
        GROUP BY tratamiento_nivel_3 ORDER BY frecuencia DESC LIMIT 10
        """, nativeQuery = true)
    List<Object[]> tratamientosTodosLosAños();
    @Query(value = """
    SELECT comuna, COUNT(*) as registros,
           SUM(cantidad_toneladas) as total_toneladas,
           ROUND(AVG(cantidad_toneladas), 2) as promedio_toneladas,
           MAX(cantidad_toneladas) as max_toneladas,
           MIN(cantidad_toneladas) as min_toneladas
    FROM RETC.SINADER_ALL
    WHERE region LIKE '%Metropolitana%'
    AND comuna IS NOT NULL AND comuna != ''
    GROUP BY comuna
    ORDER BY total_toneladas DESC
    """, nativeQuery = true)
    List<Object[]> registroPorComuna();

    @Query(value = """
    SELECT año, comuna, COUNT(*) as registros,
           SUM(cantidad_toneladas) as total_toneladas
    FROM RETC.SINADER_ALL
    WHERE region LIKE '%Metropolitana%'
    AND comuna IS NOT NULL AND comuna != ''
    GROUP BY año, comuna
    ORDER BY año ASC, total_toneladas DESC
    """, nativeQuery = true)
    List<Object[]> registroPorComunaYAño();
    @Query(value = """
    SELECT año, nombre_ler, COUNT(*) as registros,
           SUM(cantidad_toneladas) as total_toneladas
    FROM RETC.SINADER_ALL
    WHERE region LIKE '%Metropolitana%'
    AND nombre_ler IS NOT NULL AND nombre_ler != ''
    GROUP BY año, nombre_ler
    ORDER BY año ASC, total_toneladas DESC
    """, nativeQuery = true)
    List<Object[]> materialPorAño();

    @Query(value = """
    SELECT año, nombre_ler, COUNT(*) as registros,
           SUM(cantidad_toneladas) as total_toneladas
    FROM RETC.SINADER_ALL
    WHERE region LIKE '%Metropolitana%'
    AND nombre_ler IS NOT NULL AND nombre_ler != ''
    AND año = :año
    GROUP BY año, nombre_ler
    ORDER BY total_toneladas DESC
    LIMIT 10
    """, nativeQuery = true)
    List<Object[]> materialPorAñoFiltrado(@Param("año") Integer año);
}