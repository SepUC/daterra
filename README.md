# Daterra

**Daterra** es una plataforma web orientada a la visualizacion y mejora de la gestion de residuos, pensada para conectar a municipalidades y ciudadanos en un mismo ecosistema digital. El proyecto centraliza informacion util sobre puntos limpios, trazabilidad de datos territoriales y herramientas de consulta que ayudan a comprender mejor el estado de la recoleccion y el reciclaje en cada comuna.

La propuesta nace para resolver un problema comun en la gestion urbana: la informacion sobre residuos suele estar dispersa, desactualizada o poco accesible. Daterra busca transformar esos datos en una experiencia clara, util y accionable, permitiendo que los usuarios encuentren ubicaciones relevantes, exploren informacion territorial y accedan a paneles de control segun su perfil.

## Descripcion del proyecto

Daterra se construye como una solucion integral con dos experiencias principales:

1. **Experiencia ciudadana**: un mapa interactivo y una interfaz simple para localizar puntos limpios, revisar informacion de interes y facilitar la participacion en acciones de reciclaje.
2. **Experiencia municipal**: un panel administrativo para visualizar datos, apoyar la toma de decisiones y mejorar la gestion operativa de residuos a partir de informacion estructurada.

El objetivo es que la plataforma sirva como un puente entre las personas y las instituciones, promoviendo una gestion mas transparente, eficiente y colaborativa.

## Funcionalidades principales

- Autenticacion de usuarios con proteccion por tipo de perfil.
- Registro e inicio de sesion.
- Vista de mapa para usuarios ciudadanos.
- Dashboard administrativo para perfiles municipales.
- Visualizacion de puntos limpios y datos relacionados.
- Base de datos persistente con almacenamiento en MySQL.
- Carga inicial de informacion territorial y puntos de interes.
- Interfaz web responsiva apoyada en componentes modernos.

## Stack tecnologico

### Frontend

- **React 19**
- **Vite**
- **React Router DOM**
- **React Bootstrap** y **Bootstrap 5**
- **Axios**
- **@tanstack/react-query**
- **Recharts**
- **Leaflet** y **React Leaflet**
- **react-leaflet-markercluster**
- **lucide-react**

### Backend

- **Java 21**
- **Spring Boot 3.3.1**
- **Spring Web**
- **Spring Data JPA**
- **Spring Security**
- **Bean Validation**
- **JWT** con `jjwt`
- **Lombok**
- **Jackson**

### Base de datos e infraestructura

- **MySQL**
- **Amazon RDS**

### Herramientas de desarrollo

- **Maven**
- **ESLint**
- **Node.js test**
- **Git**

## Estructura del equipo

El equipo de Daterra esta conformado por:

- **Matias Benjamin Sepulveda Marin**
- **Jose Luis Carrasco Vargas**
- **Guiseppe Marcel Saavedra Chavez**

La organizacion del trabajo se orienta a una estructura colaborativa, donde las tareas se distribuyen entre las areas de:

- **Frontend y experiencia de usuario**
- **Backend y logica de negocio**
- **Datos, integracion y documentacion**

De esta forma, el proyecto puede avanzar de manera coordinada entre la interfaz, los servicios y la administracion de informacion.

## Estructura del repositorio

```text
.
├── GESTION/
│   └── Documentacion, integracion del equipo y archivos de gestion
├── PRODUCTO/
│   ├── back/
│   │   └── Backend Spring Boot, seguridad, entidades, repositorios y carga de datos
│   └── front/
│       └── daterra-web/ Frontend React con vistas, estilos y servicios
└── README.md
```

### Backend

```text
PRODUCTO/back/
├── src/main/java/com/daterra/api/daterra/
│   ├── config/
│   ├── controller/
│   ├── dto/
│   ├── model/
│   ├── repository/
│   └── security/
├── src/main/resources/
│   └── puntos/puntos.json
└── pom.xml
```

### Frontend

```text
PRODUCTO/front/daterra-web/
├── src/
│   ├── components/
│   ├── context/
│   ├── services/
│   ├── styles/
│   ├── assets/
│   └── utils/
└── package.json
```

## Arquitectura general

La solucion sigue una arquitectura de tres capas:

- **Presentacion**: interfaz web desarrollada en React.
- **Servicios**: API REST desarrollada con Spring Boot.
- **Persistencia**: base de datos MySQL conectada a traves de JPA.

Adicionalmente, el backend incorpora seguridad por JWT para controlar el acceso a rutas y funcionalidades segun el rol del usuario.

## Configuracion y ejecucion local

### Backend

```bash
cd PRODUCTO/back
mvn spring-boot:run
```

### Frontend

```bash
cd PRODUCTO/front/daterra-web
npm install
npm run dev
```

## Datos y configuracion

El backend esta configurado para conectarse a una instancia MySQL y realizar inicializacion de datos mediante carga jerarquica. Tambien incluye recursos JSON para poblar puntos de interes y estructuras territoriales relacionadas.

## Proposito del proyecto

Daterra no solo organiza informacion de residuos; tambien la convierte en una herramienta de impacto social y ambiental. Su enfoque apunta a mejorar la coordinacion entre ciudadanos y municipalidades, promover decisiones basadas en datos y facilitar una gestion mas sostenible en el territorio.
