/**
 * PLACEHOLDERS DE USUARIOS PARA TESTING
 * Estos usuarios se pueden usar para probar diferentes interfaces y reglas de seguridad
 * 
 * En producción, estos datos están en AWS MySQL
 * Para testing local, se pueden hardcodear aquí o en un backend mock
 */

export const TEST_USERS = [
  {
    id: 1,
    name: 'Admin Daterra',
    email: 'admin@daterra.com',
    password: 'Admin123!', // En producción: hash bcrypt
    role: 'admin',
    permissions: ['view_all_data', 'manage_users', 'manage_reports', 'edit_goals'],
    municipality: null,
    status: 'active',
    createdAt: '2026-01-01',
  },
  {
    id: 2,
    name: 'María Municipalidad',
    email: 'maria@municipalidadlp.com',
    password: 'Maria123!',
    role: 'municipality_admin',
    permissions: ['view_municipal_data', 'manage_municipal_users', 'record_waste', 'view_reports'],
    municipality: 'La Paz',
    status: 'active',
    createdAt: '2026-01-15',
  },
  {
    id: 3,
    name: 'Carlos Supervisor',
    email: 'carlos@municipalidadlp.com',
    password: 'Carlos123!',
    role: 'supervisor',
    permissions: ['record_waste', 'view_municipal_data', 'export_reports'],
    municipality: 'La Paz',
    status: 'active',
    createdAt: '2026-02-01',
  },
  {
    id: 4,
    name: 'Juan Operario',
    email: 'juan@municipalidadlp.com',
    password: 'Juan123!',
    role: 'operator',
    permissions: ['record_waste', 'view_own_records'],
    municipality: 'La Paz',
    status: 'active',
    createdAt: '2026-02-10',
  },
  {
    id: 5,
    name: 'Elena Municipalidad Oruro',
    email: 'elena@municipalidadoruro.com',
    password: 'Elena123!',
    role: 'municipality_admin',
    permissions: ['view_municipal_data', 'manage_municipal_users', 'record_waste', 'view_reports'],
    municipality: 'Oruro',
    status: 'active',
    createdAt: '2026-02-20',
  },
  {
    id: 6,
    name: 'Usuario Prueba',
    email: 'prueba@daterra.com',
    password: 'Prueba123!',
    role: 'viewer',
    permissions: ['view_own_data'],
    municipality: null,
    status: 'active',
    createdAt: '2026-03-01',
  },
];

/**
 * Matriz de Roles y Permisos
 * Define qué puede hacer cada rol
 */
export const ROLE_PERMISSIONS = {
  admin: {
    label: 'Administrador',
    description: 'Acceso total al sistema',
    permissions: [
      'view_all_data',
      'manage_users',
      'manage_reports',
      'edit_goals',
      'view_statistics',
      'export_data',
      'manage_municipalities',
    ],
    color: '#FF6B6B',
  },
  municipality_admin: {
    label: 'Administrador Municipal',
    description: 'Gestión completa de su municipalidad',
    permissions: [
      'view_municipal_data',
      'manage_municipal_users',
      'record_waste',
      'view_reports',
      'export_municipal_data',
      'view_statistics',
    ],
    color: '#4ECDC4',
  },
  supervisor: {
    label: 'Supervisor',
    description: 'Supervisión y registro de datos',
    permissions: [
      'record_waste',
      'view_municipal_data',
      'export_reports',
      'view_statistics',
    ],
    color: '#45B7D1',
  },
  operator: {
    label: 'Operario',
    description: 'Registro de desechos',
    permissions: [
      'record_waste',
      'view_own_records',
    ],
    color: '#FFA07A',
  },
  viewer: {
    label: 'Visualizador',
    description: 'Solo lectura de datos propios',
    permissions: [
      'view_own_data',
    ],
    color: '#98D8C8',
  },
};

/**
 * Reglas de Seguridad del Frontend
 * Estas reglas controlan qué pueden ver/hacer los usuarios
 */
export const SECURITY_RULES = {
  dataAccess: {
    admin: () => true, // Puede ver todo
    municipality_admin: (userId, municipalityId) => userId === municipalityId, // Solo su municipalidad
    supervisor: (userId, municipalityId) => userId === municipalityId, // Solo su municipalidad
    operator: (userId, recordUserId) => userId === recordUserId, // Solo sus registros
    viewer: (userId, recordUserId) => userId === recordUserId, // Solo sus datos
  },
  
  actions: {
    canRecordWaste: (role) => ['admin', 'municipality_admin', 'supervisor', 'operator'].includes(role),
    canManageUsers: (role) => ['admin', 'municipality_admin'].includes(role),
    canViewReports: (role) => ['admin', 'municipality_admin', 'supervisor'].includes(role),
    canExportData: (role) => ['admin', 'municipality_admin', 'supervisor'].includes(role),
    canEditGoals: (role) => ['admin'].includes(role),
  },
};

/**
 * Función para validar acceso a recursos
 */
export function hasPermission(userRole, permission) {
  const roleData = ROLE_PERMISSIONS[userRole];
  return roleData?.permissions.includes(permission) || false;
}

/**
 * Función para verificar si un usuario puede acceder a datos
 */
export function canAccessData(user, targetData) {
  const rule = SECURITY_RULES.dataAccess[user.role];
  if (!rule) return false;
  
  if (user.role === 'admin') return true;
  if (user.role === 'municipality_admin' || user.role === 'supervisor') {
    return user.municipality === targetData.municipality;
  }
  if (user.role === 'operator' || user.role === 'viewer') {
    return user.id === targetData.userId;
  }
  
  return false;
}

/**
 * Obtener usuario de prueba por email
 */
export function getTestUserByEmail(email) {
  return TEST_USERS.find(user => user.email === email);
}

/**
 * Validar credenciales de prueba
 */
export function validateTestCredentials(email, password) {
  const user = getTestUserByEmail(email);
  if (!user) return null;
  
  // En producción se usaría bcrypt.compare()
  if (user.password === password) {
    // Retornar usuario sin la contraseña
    const { password: _, ...safeUser } = user;
    return safeUser;
  }
  
  return null;
}
