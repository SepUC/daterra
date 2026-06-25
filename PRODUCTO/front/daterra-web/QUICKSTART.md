# 🚀 Guía de Inicio Rápido - Daterra Frontend

## ⚡ Ejecutar en 5 minutos

### 1. Instalar dependencias
```bash
cd front/daterra-web
npm install
```

### 2. Configurar variables de entorno
```bash
# Ya está configurado en .env para desarrollo local
# Si necesitas cambiar algo, edita el archivo .env
cat .env
```

### 3. Iniciar servidor de desarrollo
```bash
npm run dev
```

### 4. Abrir en el navegador
```
http://localhost:5173
```

---

## 🧪 Testing con Credenciales

Una vez que el servidor está corriendo:

1. Dirígete a http://localhost:5173
2. Haz clic en "Login" en la navbar
3. Busca el botón 🧪 **"Credenciales de Prueba"** en la esquina inferior derecha
4. Selecciona un usuario para obtener email y contraseña

### Usuarios Recomendados para Testing:

#### Admin - Acceso Total
- **Email:** `admin@daterra.com`
- **Contraseña:** `Admin123!`
- **Ve:** Todos los datos, todas las municipalidades, estadísticas globales

#### Municipality Admin - Acceso Municipal
- **Email:** `maria@municipalidadlp.com`
- **Contraseña:** `Maria123!`
- **Ve:** Solo datos de La Paz, puede gestionar usuarios de su municipalidad

#### Operator - Registro Limitado
- **Email:** `juan@municipalidadlp.com`
- **Contraseña:** `Juan123!`
- **Ve:** Solo puede registrar desechos, ve su municipalidad

---

## 🔍 Probar Diferentes Interfaces

### 1. Interfaz de Admin
```
Login con: admin@daterra.com
Dashboard muestra:
- Acceso a todas las municipalidades
- Todos los gráficos desbloqueados
- Opción de editar objetivos
- Gestión completa de usuarios
```

### 2. Interfaz de Municipality Admin
```
Login con: maria@municipalidadlp.com
Dashboard muestra:
- Solo datos de La Paz
- Gráficos limitados a su municipalidad
- Puede registrar desechos
- Puede gestionar operarios
```

### 3. Interfaz de Operario
```
Login con: juan@municipalidadlp.com
Dashboard muestra:
- Acceso limitado a datos
- Solo puede ver sus registros
- Opción para registrar nuevos desechos
- Sin acceso a gestión de usuarios
```

---

## 🔐 Probar Reglas de Seguridad

### Prueba 1: Acceso Basado en Municipalidad
1. Login como `maria@municipalidadlp.com` (La Paz)
2. Observa que solo ves datos de La Paz
3. Logout e ingresa como `elena@municipalidadoruro.com` (Oruro)
4. Confirma que ves datos diferentes

### Prueba 2: Permisos Limitados
1. Login como `juan@municipalidadlp.com` (Operario)
2. Observa que ves el aviso 🔒 "Acceso Limitado"
3. No puedes ver ciertos gráficos
4. El botón para editar está deshabilitado

### Prueba 3: Datos Ocultos
1. Login como `prueba@daterra.com` (Viewer)
2. Solo ves tu información personal
3. No puedes registrar desechos
4. Sin acceso a datos municipales

---

## 📊 Componentes Principales para Testing

### Dashboard
- **URL:** `/dashboard` (solo autenticado)
- **Elementos:**
  - Sidebar colapsable
  - KPIs informativos
  - Gráfico de barras: Desechos por mes
  - Gráfico de pastel: Distribución de tipos
  - Tabla de detalles

### Login
- **URL:** `/login`
- **Features:**
  - Validación de email
  - Validación de contraseña
  - Helper de credenciales
  - Mensajes de error claros

### Register
- **URL:** `/register`
- **Features:**
  - Validación completa
  - Confirmación de contraseña
  - Integración con backend simulado

---

## 🛠️ Debugging

### Ver Logs del Navegador
```
F12 → Console
- Los logs de autenticación aparecen aquí
- Errores de API se muestran
- Verifica que el token se guarda en localStorage
```

### Inspeccionar LocalStorage
```
F12 → Application → Local Storage
- Busca: authToken
- Busca: currentUser
- Verifica que estén guardados correctamente
```

### Verificar Red
```
F12 → Network
- Revisa las requests a la API
- Status 200 = éxito
- Status 401 = sin autenticación
```

---

## 🐛 Problemas Comunes

### Error: "Puerto 5173 en uso"
```bash
# Cambiar puerto en vite.config.js
# O matar el proceso:
lsof -i :5173
kill -9 <PID>
```

### Error: "Backend no disponible"
```
✅ Es normal en desarrollo
El sistema automáticamente usa test users
Verifica la URL en .env
```

### Error: "Token inválido"
```
✅ Limpiar localStorage:
F12 → Application → Clear All
Luego recargar y login nuevamente
```

### Error: "Módulo no encontrado"
```bash
# Reinstalar dependencias
rm -rf node_modules
npm install
npm run dev
```

---

## 📝 Scripts Útiles

```bash
# Desarrollo
npm run dev                    # Inicia servidor con HMR

# Producción
npm run build                  # Compilar para producción
npm run preview               # Preview del build

# Calidad de Código
npm run lint                  # Ejecutar ESLint

# Limpieza
npm run clean                 # Limpiar dist/
```

---

## 🔗 Rutas del Proyecto

```
/                    → Página de inicio
/login               → Login
/register            → Registro
/dashboard           → Dashboard (protegido)
/about               → Página de información
```

---

## 🌐 Integración con Backend (Futuro)

Cuando el backend esté listo:

1. **Editar `.env`:**
   ```env
   VITE_API_URL=http://localhost:3001/api
   VITE_ENVIRONMENT=development
   ```

2. **Reiniciar servidor:**
   ```bash
   npm run dev
   ```

3. **El sistema automáticamente:**
   - Se conectará al backend real
   - Validará credenciales contra MySQL
   - Guardará autenticación real
   - Sincronizará datos en vivo

---

## 📚 Documentación Completa

- **AWS Integration:** Ver `AWS_INTEGRATION.md`
- **Especificación Backend:** Ver `BACKEND_API_SPEC.md`
- **README del Proyecto:** Ver `README.md`

---

## 💡 Tips para Desarrolladores

### Agregar Nuevo Usuario de Prueba
1. Editar `src/constants/testUsers.js`
2. Agregar en array `TEST_USERS`
3. Reiniciar `npm run dev`
4. El nuevo usuario aparecerá en el helper 🧪

### Cambiar Permisos de Usuario
1. Editar `src/constants/testUsers.js`
2. Modificar en `ROLE_PERMISSIONS`
3. Los cambios se aplican inmediatamente

### Agregar Nueva Ruta Protegida
1. Usar `ProtectedRoute` en `App.jsx`
2. Envolver el componente con `<ProtectedRoute>`
3. Automáticamente redirige a login si no está autenticado

---

## 🚀 Próximos Pasos

1. ✅ Frontend funcionando
2. ⏳ Crear Backend (AWS + MySQL)
3. ⏳ Conectar frontend con backend real
4. ⏳ Deploy a producción

---

**¡Listo! Ya puedes probar el dashboard de Daterra** 🎉

Para problemas o preguntas, revisa la sección de issues o contacta al equipo.
