package com.daterra.api.daterra;
//model
import com.daterra.api.daterra.model.PuntoLimpio;
import com.daterra.api.daterra.model.Municipio;
import com.daterra.api.daterra.model.Comuna; // Necesitamos importar Comuna
import com.daterra.api.daterra.model.Ciudad;
import com.daterra.api.daterra.model.Region;
import com.daterra.api.daterra.model.Pais;
//repository
import com.daterra.api.daterra.repository.CiudadRepository;
import com.daterra.api.daterra.repository.ComunaRepository;
import com.daterra.api.daterra.repository.PuntoLimpioRepository;
import com.daterra.api.daterra.repository.MunicipioRepository;
import com.daterra.api.daterra.repository.RegionRepository;
import com.daterra.api.daterra.repository.PaisRepository;
//otros
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.util.List;

@SpringBootApplication
public class DaterraApplication {

	public static void main(String[] args) {
		SpringApplication.run(DaterraApplication.class, args);
	}

	@Bean
	@Transactional
	CommandLineRunner runner(
			PuntoLimpioRepository repository,
			MunicipioRepository muniRepo,
			ComunaRepository comunaRepo,
			CiudadRepository ciudadRepo,
			RegionRepository regionRepo,
			PaisRepository paisRepo) {
		return args -> {
			if (repository.count() == 0) {
				System.out.println("🚀 Iniciando carga de datos y siembra jerárquica...");

				try {
					// 1. Asegurar que exista el PAÍS (ID 1)
					Pais pais = paisRepo.findById(1).orElseGet(() -> {
						Pais p = new Pais();
						p.setId_pais(1);
						p.setNombre_pais("Chile");
						return paisRepo.save(p);
					});

					// 2. Asegurar que exista la REGIÓN (Metropolitana - ID 13)
					Region region = regionRepo.findById(13).orElseGet(() -> {
						Region r = new Region();
						r.setId_region(13);
						r.setNombre_region("Metropolitana");
						r.setPais(pais);
						return regionRepo.save(r);
					});

					// 3. Asegurar que exista la CIUDAD (ID 1)
					Ciudad ciudad = ciudadRepo.findById(1).orElseGet(() -> {
						Ciudad c = new Ciudad();
						c.setId_ciudad(1);
						c.setNombre_ciudad("Santiago");
						c.setRegion(region);
						return ciudadRepo.save(c);
					});

					// 4. Asegurar que exista la COMUNA (ID 1)
					Comuna comunaBase = comunaRepo.findById(1).orElseGet(() -> {
						Comuna co = new Comuna();
						co.setId_comuna(1);
						co.setNombre_comuna("Santiago");
						co.setCiudad(ciudad);
						return comunaRepo.save(co);
					});

					// 5. PROCESAR JSON
					ObjectMapper mapper = new ObjectMapper();
					TypeReference<List<PuntoLimpio>> typeReference = new TypeReference<>() {};
					InputStream inputStream = getClass().getResourceAsStream("/puntos/puntos.json");

					if (inputStream == null) {
						System.out.println("❌ ERROR: No se encontró el archivo puntos.json");
						return;
					}

					List<PuntoLimpio> puntos = mapper.readValue(inputStream, typeReference);

					for (PuntoLimpio p : puntos) {
						// 6. Crear el Municipio si no existe usando la Comuna Base
						if (p.getId_muni() != null && !muniRepo.existsById(p.getId_muni())) {
							System.out.println("🆕 Creando municipio faltante: " + p.getNombreMuniTmp() + " (ID: " + p.getId_muni() + ")");

							Municipio nuevoMuni = new Municipio();
							nuevoMuni.setId_muni(p.getId_muni());
							nuevoMuni.setNombre_muni(p.getNombreMuniTmp());
							nuevoMuni.setComuna(comunaBase); // Vinculado de forma segura a Comuna ID 1

							muniRepo.save(nuevoMuni);
						}
					}

					// 7. Guardar todos los Puntos Limpios
					repository.saveAll(puntos);
					System.out.println("✅ ¡Sincronización completa con AWS siguiendo el MER!");

				} catch (Exception e) {
					System.out.println("❌ Error al procesar la carga: " + e.getMessage());
					e.printStackTrace();
				}
			} else {
				System.out.println("ℹ️ La tabla ya contiene datos. Saltando carga.");
			}
		};
	}
}