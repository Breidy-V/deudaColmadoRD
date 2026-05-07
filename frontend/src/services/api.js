// ============ CONFIGURACIÓN BASE ============
const API_URL = 'http://localhost:3000';

// ============ HELPER: OBTENER TOKEN ============
const getToken = () => {
  const usuario = localStorage.getItem('usuarioFiadoRD');
  if (usuario) {
    try {
      const parsed = JSON.parse(usuario);
      return parsed.token;
    } catch {
      return null;
    }
  }
  return null;
};

// ============ HELPER: HEADERS CON TOKEN ============
const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// ============ HELPER: MANEJO DE ERRORES ============
const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error en la solicitud');
  }

  return data;
};

// ============ AUTENTICACIÓN ============
export const authAPI = {
  // Login
  login: async (usuario, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({ user: usuario, password }),
    });
    return handleResponse(response);
  },
};

// ============ USUARIOS ============
export const usersAPI = {
  // Crear usuario (registro)
  create: async (name, email, password) => {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({ name, user: email, password }),
    });
    return handleResponse(response);
  },

  // Listar todos los usuarios
  list: async () => {
    const response = await fetch(`${API_URL}/users`, {
      method: 'GET',
      headers: getHeaders(true),
    });
    return handleResponse(response);
  },

  // Obtener un usuario por ID
  getById: async (id) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'GET',
      headers: getHeaders(true),
    });
    return handleResponse(response);
  },

  // Editar usuario (nombre, email, rol)
  update: async (id, name, email, rol) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify({ name, email, rol }),
    });
    return handleResponse(response);
  },

  // Cambiar contraseña
  changePassword: async (id, newPassword, confirmPassword) => {
    const response = await fetch(`${API_URL}/users/${id}/password`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify({ newPassword, confirmPassword }),
    });
    return handleResponse(response);
  },

  // Eliminar usuario
  delete: async (id) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    return handleResponse(response);
  },

  // Cambiar estado (activo/inactivo)
  changeStatus: async (id, estado) => {
    const response = await fetch(`${API_URL}/users/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(true),
      body: JSON.stringify({ estado }),
    });
    return handleResponse(response);
  },
};







// ============ CLIENTES ============
export const clientesAPI = {
  create: async (nombre, apellido, telefono, direccion) => {
    const response = await fetch(`${API_URL}/clientes`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ nombre, apellido, telefono, direccion }),
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/clientes/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    return handleResponse(response);
  },
};

// ============ DEUDAS ============
export const deudasAPI = {
  // 🔹 Crear deuda
  create: async (id_cliente, monto) => {
    const response = await fetch(`${API_URL}/deudas`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({
        id_cliente,
        monto_total: monto
      }),
    });
    return handleResponse(response);
  },

  // 🔹 Listar deudas
  list: async () => {
    const response = await fetch(`${API_URL}/deudas`, {
      method: 'GET',
      headers: getHeaders(true),
    });
    return handleResponse(response);
  },
};

// ============ EXPORTAR TODO ============
export const api = {
  auth: authAPI,
  users: usersAPI,
  deudas: deudasAPI,
  clientes: clientesAPI,
};