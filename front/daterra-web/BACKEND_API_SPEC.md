# 🖥️ Backend API Specification - AWS MySQL

Esta es la especificación de API que el backend debe seguir para funcionar correctamente con el frontend de Daterra.

---

## 📡 Base URL
```
http://localhost:3001/api  (desarrollo)
https://api.daterra.aws.com/api  (producción)
```

---

## 🔐 Autenticación

### Método: JWT Bearer Token

Todos los endpoints protegidos requieren header:
```
Authorization: Bearer <jwt-token>
```

### Estructura del Token JWT:
```json
{
  "id": 1,
  "email": "user@example.com",
  "role": "admin",
  "iat": 1234567890,
  "exp": 1234567900
}
```

---

## 🔑 Endpoints de Autenticación

### 1. POST `/auth/register`
**Descripción:** Registrar nuevo usuario

**Body:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "role": "viewer",
    "permissions": ["view_own_data"],
    "municipality": null,
    "status": "active",
    "createdAt": "2026-05-06T10:30:00Z"
  }
}
```

**Error (400):**
```json
{
  "message": "Email ya registrado",
  "code": "EMAIL_EXISTS"
}
```

---

### 2. POST `/auth/login`
**Descripción:** Iniciar sesión

**Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "role": "admin",
    "permissions": ["view_all_data", "manage_users"],
    "municipality": null,
    "status": "active"
  }
}
```

**Error (401):**
```json
{
  "message": "Credenciales inválidas",
  "code": "INVALID_CREDENTIALS"
}
```

---

### 3. POST `/auth/logout`
**Descripción:** Cerrar sesión

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "message": "Sesión cerrada correctamente"
}
```

---

### 4. GET `/auth/verify`
**Descripción:** Verificar validez del token

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "valid": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "admin"
  }
}
```

**Error (401):**
```json
{
  "message": "Token inválido o expirado",
  "code": "INVALID_TOKEN"
}
```

---

## 👤 Endpoints de Usuarios

### 5. GET `/users/profile`
**Descripción:** Obtener perfil del usuario autenticado

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "id": 1,
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "role": "admin",
  "permissions": ["view_all_data", "manage_users"],
  "municipality": null,
  "status": "active",
  "createdAt": "2026-01-01T00:00:00Z",
  "updatedAt": "2026-05-06T10:30:00Z"
}
```

---

### 6. PUT `/users/profile`
**Descripción:** Actualizar perfil del usuario

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "name": "Juan Carlos Pérez",
  "email": "juan.new@example.com"
}
```

**Response (200):**
```json
{
  "id": 1,
  "name": "Juan Carlos Pérez",
  "email": "juan.new@example.com",
  "role": "admin",
  "permissions": ["view_all_data", "manage_users"],
  "municipality": null
}
```

---

## 🗑️ Endpoints de Desechos

### 7. GET `/waste/monthly`
**Descripción:** Obtener datos de desechos reciclados por mes

**Headers:** `Authorization: Bearer <token>`

**Query Params:**
- `year` (opcional): Año específico (default: año actual)
- `municipality` (opcional): Filtrar por municipalidad (solo admin)

**Response (200):**
```json
{
  "data": [
    {
      "month": "Enero",
      "monthNumber": 1,
      "reciclado": 450,
      "organico": 300,
      "plastico": 200,
      "total": 950
    },
    {
      "month": "Febrero",
      "monthNumber": 2,
      "reciclado": 520,
      "organico": 280,
      "plastico": 220,
      "total": 1020
    }
  ],
  "year": 2026,
  "municipality": "La Paz"
}
```

---

### 8. GET `/waste/top-types`
**Descripción:** Obtener desechos más reciclados

**Headers:** `Authorization: Bearer <token>`

**Query Params:**
- `limit` (opcional): Número máximo de resultados (default: 10)
- `municipality` (opcional): Filtrar por municipalidad

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Plástico",
      "value": 35,
      "kg": 1200,
      "percentage": 35.29,
      "color": "#FF6B6B"
    },
    {
      "id": 2,
      "name": "Papel",
      "value": 25,
      "kg": 850,
      "percentage": 25.00,
      "color": "#4ECDC4"
    }
  ],
  "totalKg": 3400,
  "recordsCount": 156
}
```

---

### 9. GET `/waste/records`
**Descripción:** Obtener registros de desechos

**Headers:** `Authorization: Bearer <token>`

**Query Params:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Registros por página (default: 20)
- `type` (opcional): Filtrar por tipo de desecho
- `startDate` (opcional): Fecha inicio (YYYY-MM-DD)
- `endDate` (opcional): Fecha fin (YYYY-MM-DD)
- `municipality` (opcional): Filtrar por municipalidad

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "type": "Plástico",
      "weight": 45.5,
      "unit": "kg",
      "date": "2026-05-06",
      "municipality": "La Paz",
      "recordedBy": "Juan Pérez",
      "notes": "Botellas de plástico recicladas",
      "status": "processed",
      "createdAt": "2026-05-06T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "pages": 8
  }
}
```

---

### 10. POST `/waste/record`
**Descripción:** Registrar nuevo desecho

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "type": "Plástico",
  "weight": 45.5,
  "unit": "kg",
  "date": "2026-05-06",
  "municipality": "La Paz",
  "notes": "Botellas de plástico recicladas"
}
```

**Response (201):**
```json
{
  "id": 1,
  "type": "Plástico",
  "weight": 45.5,
  "unit": "kg",
  "date": "2026-05-06",
  "municipality": "La Paz",
  "recordedBy": {
    "id": 1,
    "name": "Juan Pérez"
  },
  "notes": "Botellas de plástico recicladas",
  "status": "pending_approval",
  "createdAt": "2026-05-06T10:30:00Z"
}
```

**Error (400):**
```json
{
  "message": "El tipo de desecho no es válido",
  "code": "INVALID_WASTE_TYPE"
}
```

---

## 📊 Endpoints de Estadísticas

### 11. GET `/statistics`
**Descripción:** Obtener estadísticas generales

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "totalRecycledKg": 3400,
  "averageMonthlyKg": 566.67,
  "currentMonthKg": 680,
  "yearlyGoalKg": 8000,
  "goalsCompletionPercentage": 8.5,
  "recordsCount": 156,
  "activeUsers": 45,
  "municipalities": 5
}
```

---

### 12. GET `/goals/progress`
**Descripción:** Obtener objetivos y progreso

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "goals": [
    {
      "id": 1,
      "name": "Reciclar 8000 kg en 2026",
      "targetKg": 8000,
      "currentKg": 3400,
      "percentage": 42.5,
      "startDate": "2026-01-01",
      "endDate": "2026-12-31",
      "status": "in_progress"
    }
  ],
  "progress": {
    "months": [
      {
        "month": "Mayo",
        "kg": 680,
        "target": 667
      }
    ]
  }
}
```

---

## 🛡️ Códigos de Error Estándar

| Código | HTTP | Descripción |
|--------|------|-------------|
| INVALID_CREDENTIALS | 401 | Email o contraseña incorrectos |
| INVALID_TOKEN | 401 | Token inválido o expirado |
| UNAUTHORIZED | 403 | Usuario no autorizado para esta acción |
| NOT_FOUND | 404 | Recurso no encontrado |
| VALIDATION_ERROR | 400 | Datos de entrada inválidos |
| EMAIL_EXISTS | 400 | Email ya registrado |
| INVALID_WASTE_TYPE | 400 | Tipo de desecho no válido |
| SERVER_ERROR | 500 | Error interno del servidor |

---

## 📋 Estructura de Base de Datos

### Tabla `users`
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  permissions JSON,
  municipality VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Tabla `waste_records`
```sql
CREATE TABLE waste_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  type VARCHAR(100) NOT NULL,
  weight DECIMAL(10, 2) NOT NULL,
  unit VARCHAR(10) DEFAULT 'kg',
  date DATE NOT NULL,
  municipality VARCHAR(255),
  notes TEXT,
  status VARCHAR(50) DEFAULT 'pending_approval',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Tabla `goals`
```sql
CREATE TABLE goals (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  target_kg DECIMAL(10, 2) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'in_progress',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔄 Rate Limiting

Se recomienda implementar:
- 100 requests/minuto por IP
- 1000 requests/hora por usuario autenticado

---

## 📝 Notas Importantes

1. **Validación**: El backend DEBE validar todos los permisos
2. **CORS**: Configurar para el frontend
3. **HTTPS**: Obligatorio en producción
4. **Hash de Contraseñas**: Usar bcrypt o similar
5. **Logs**: Registrar todas las operaciones sensibles
6. **Backups**: Realizar diariamente

---

**Última actualización:** Mayo 2026
