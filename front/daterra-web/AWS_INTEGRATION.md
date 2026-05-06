# 🌍 Daterra Frontend - AWS Backend Integration

## 📋 Descripción General

Este es el frontend de Daterra, una aplicación de gestión de desechos reciclados para municipalidades. El proyecto está diseñado para funcionar con un backend en AWS usando MySQL como base de datos.

### Características Principales:
- ✅ Autenticación y autorización con roles
- ✅ Dashboard con gráficos de desechos reciclados
- ✅ Sistema de permisos basado en roles
- ✅ Protección de rutas
- ✅ Credenciales de prueba para desarrollo
- ✅ Integración con API Backend (AWS)

---

## 🏗️ Arquitectura

```
Frontend (Vite + React)
        ↓
   [API Service]
        ↓
Backend (AWS - Node.js/Python)
        ↓
   [MySQL Database]
```

### Componentes Principales:

#### 1. **API Service** (`src/services/apiService.js`)
- Maneja todas las conexiones HTTP con el backend
- Incluye autenticación con JWT tokens
- Soporta timeout automático
- Gestión de errores centralizada

#### 2. **AuthContext** (`src/context/AuthContext.jsx`)
- Contexto global de autenticación
- Manejo de login/registro
- Verificación de permisos
- Fallback a test users si el backend no está disponible

#### 3. **Roles y Permisos** (`src/constants/testUsers.js`)
```
- Admin: Acceso total al sistema
- Municipality Admin: Gestión de su municipalidad
- Supervisor: Supervisión y registro de datos
- Operator: Solo registro de desechos
- Viewer: Solo lectura
```

---

## 🔐 Seguridad - Reglas de Frontend

### Matriz de Roles y Permisos

```javascript
admin:
  - view_all_data
  - manage_users
  - manage_reports
  - edit_goals
  - manage_municipalities

municipality_admin:
  - view_municipal_data
  - manage_municipal_users
  - record_waste
  - view_reports
  - export_municipal_data

supervisor:
  - record_waste
  - view_municipal_data
  - export_reports

operator:
  - record_waste
  - view_own_records

viewer:
  - view_own_data
```

### Reglas de Acceso a Datos:

- **Admin**: Acceso a todos los datos
- **Municipality Admin/Supervisor**: Solo datos de su municipalidad
- **Operator/Viewer**: Solo sus propios datos

---

## 👥 Placeholders de Usuarios para Testing

El proyecto incluye 6 usuarios de prueba con diferentes roles:

| Email | Contraseña | Rol | Municipio |
|-------|-----------|-----|-----------|
| `admin@daterra.com` | `Admin123!` | Admin | - |
| `maria@municipalidadlp.com` | `Maria123!` | Municipality Admin | La Paz |
| `carlos@municipalidadlp.com` | `Carlos123!` | Supervisor | La Paz |
| `juan@municipalidadlp.com` | `Juan123!` | Operator | La Paz |
| `elena@municipalidadoruro.com` | `Elena123!` | Municipality Admin | Oruro |
| `prueba@daterra.com` | `Prueba123!` | Viewer | - |

**Nota**: Estos usuarios se muestran en el helper 🧪 en la esquina inferior derecha de la pantalla (solo en desarrollo).

---

## 🚀 Instalación y Configuración

### Requisitos Previos:
- Node.js 16+ 
- npm o yarn

### Pasos de Instalación:

```bash
# 1. Clonar el repositorio
cd front/daterra-web

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env

# 4. Editar .env con la URL del backend
VITE_API_URL=http://localhost:3001/api
# O para producción:
# VITE_API_URL=https://your-aws-backend.com/api

# 5. Iniciar servidor de desarrollo
npm run dev

# 6. Build para producción
npm run build
```

---

## 🔌 Integración con Backend AWS

### Endpoints Esperados:

**Autenticación:**
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `POST /api/auth/logout` - Logout
- `GET /api/auth/verify` - Verificar token

**Usuarios:**
- `GET /api/users/profile` - Obtener perfil
- `PUT /api/users/profile` - Actualizar perfil

**Desechos:**
- `GET /api/waste/monthly` - Datos mensuales
- `GET /api/waste/top-types` - Tipos más reciclados
- `GET /api/waste/records` - Registros de desechos
- `POST /api/waste/record` - Registrar desecho

**Estadísticas:**
- `GET /api/statistics` - Estadísticas generales
- `GET /api/goals/progress` - Objetivos y progreso

### Formato de Respuestas:

**Login/Register:**
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": 1,
    "name": "Usuario",
    "email": "user@example.com",
    "role": "admin",
    "permissions": ["view_all_data"],
    "municipality": null,
    "status": "active"
  }
}
```

**Desechos Mensuales:**
```json
{
  "data": [
    {
      "month": "Enero",
      "reciclado": 450,
      "organico": 300,
      "plastico": 200
    }
  ]
}
```

---

## 🧪 Testing y Desarrollo

### Modo Desarrollo:
El helper 🧪 de credenciales aparece en la esquina inferior derecha y muestra:
- Lista de todos los usuarios de prueba
- Contraseñas para cada usuario
- Rol y permisos asignados
- Información de seguridad

### Flujo de Testing Recomendado:

1. **Login como Admin**
   - Email: `admin@daterra.com`
   - Ver acceso a todos los datos

2. **Login como Municipality Admin**
   - Email: `maria@municipalidadlp.com`
   - Ver solo datos de La Paz

3. **Login como Operator**
   - Email: `juan@municipalidadlp.com`
   - Ver restricciones de datos

---

## 📊 Componentes Principales

### Dashboard (`src/components/dashboard.jsx`)
- Sidebar colapsable con navegación
- KPIs informativos
- Gráfico de barras: Desechos por mes
- Gráfico de pastel: Distribución de tipos
- Tabla de detalles
- Información de usuario y rol

### Login (`src/components/login.jsx`)
- Validación de credenciales
- Manejo de errores
- Integración con AuthContext
- Fallback a test users

### Register (`src/components/register.jsx`)
- Validación completa de datos
- Creación de usuario
- Integración con AuthContext

### ProtectedRoute (`src/components/ProtectedRoute.jsx`)
- Protección de rutas
- Redireccionamiento automático a login

---

## 🔄 Flujo de Autenticación

```
1. Usuario ingresa credenciales
   ↓
2. APIService intenta conectarse al backend
   ↓
3a. Si backend disponible:
    - Valida credenciales en MySQL
    - Retorna JWT token
    - Guarda en localStorage
   ↓
3b. Si backend NO disponible:
    - Valida contra test users
    - Crea token simulado
    - Guarda en localStorage
   ↓
4. AuthContext actualiza estado global
   ↓
5. Usuario es redirigido al dashboard
```

---

## 📝 Variables de Entorno

```env
# API Configuration
VITE_API_URL=http://localhost:3001/api
VITE_REQUEST_TIMEOUT=10000
VITE_ENVIRONMENT=development
```

---

## 🛠️ Scripts Disponibles

```bash
npm run dev        # Inicia servidor de desarrollo
npm run build      # Build para producción
npm run preview    # Preview del build
npm run lint       # Ejecutar linter
```

---

## 📦 Dependencias Principales

- **React 19**: Framework UI
- **Vite 8**: Build tool
- **React Router 7**: Navegación
- **Recharts**: Gráficos
- **Lucide React**: Iconos
- **Bootstrap 5**: Estilos

---

## ⚠️ Notas de Seguridad

1. **Frontend es público**: Todas las reglas aquí son verificadas también en backend
2. **Tokens JWT**: Se almacenan en localStorage (considerar sessionStorage)
3. **Credenciales de prueba**: Solo usar en desarrollo, NO en producción
4. **HTTPS**: Usar siempre en producción
5. **CORS**: Configurar correctamente en backend

---

## 🐛 Troubleshooting

### Backend no responde
- El sistema usa test users automáticamente
- Verifica que la URL en `.env` sea correcta
- Comprueba que el backend está corriendo

### "Acceso Denegado"
- Verifica el rol del usuario
- Algunos roles tienen permisos limitados
- Contacta al administrador para permisos

### Token expirado
- Inicia sesión nuevamente
- El token se guarda en localStorage

---

## 🚢 Deployment

### Producción en AWS:

1. **Build:**
   ```bash
   npm run build
   ```

2. **Deploy a S3 + CloudFront:**
   ```bash
   # Copiar dist/ a S3
   aws s3 sync dist/ s3://your-bucket-name/
   ```

3. **Variables de entorno en producción:**
   ```env
   VITE_API_URL=https://api.daterra.aws.com/api
   VITE_ENVIRONMENT=production
   ```

---

## 📞 Soporte

Para problemas con el backend, contacta al equipo de DevOps.
Para problemas del frontend, reporta en la sección de issues.

---

**Última actualización:** Mayo 2026
**Versión:** 1.0.0 - Integración AWS
