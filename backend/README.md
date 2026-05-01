# 🚀 API Node.js + SQLite (MVC + JWT)

API REST construida con **Node.js**, **Express** y **SQLite**, siguiendo arquitectura **MVC**, autenticación con **JWT** y contraseñas encriptadas con **bcrypt**.

---

## 📦 Tecnologías

* Node.js
* Express
* SQLite
* bcrypt
* JSON Web Token (JWT)
* dotenv

---

## 📁 Estructura del proyecto

```
src/
├── config/         # Configuración de base de datos
├── controllers/    # Lógica de negocio
├── models/         # Acceso a datos
├── routes/         # Definición de endpoints
├── middleware/     # Middlewares (auth)
├── utils/          # Helpers (JWT, etc)
└── app.js          # Entry point

database.sqlite
.env
```

---

## ⚙️ Instalación

```bash
git clone <repo>
cd api-node-sqlite
npm install
```

---

## 🔑 Variables de entorno

Crea un archivo `.env` en la raíz:

```
JWT_SECRET=super_secreto_pro
```

---

## ▶️ Ejecutar el proyecto

```bash
npm run dev
```

Servidor corriendo en:

```
http://localhost:3000
```

---

## 🔐 Autenticación

La API usa **JWT**.

Para acceder a rutas protegidas, debes enviar el token en el header:

```
Authorization: Bearer TU_TOKEN
```

---

## 📡 Endpoints

### 🧑 Usuarios

#### ➕ Crear usuario

```
POST /users
```

**Body:**

```json
{
  "name": "Juan",
  "user": "juan123",
  "password": "123456"
}
```

---

#### 📄 Obtener usuarios (protegido)

```
GET /users
```

**Headers:**

```
Authorization: Bearer TU_TOKEN
```

---

### 🔑 Autenticación

#### 🔐 Login

```
POST /auth/login
```

**Body:**

```json
{
  "user": "juan123",
  "password": "123456"
}
```

**Respuesta:**

```json
{
  "token": "JWT_TOKEN"
}
```

---

## 🗄️ Modelo de datos

Tabla: `users`

| Campo      | Tipo     | Descripción                  |
| ---------- | -------- | ---------------------------- |
| id         | INTEGER  | ID autoincremental           |
| name       | TEXT     | Nombre                       |
| user       | TEXT     | Usuario (único)              |
| password   | TEXT     | Contraseña encriptada        |
| created_at | DATETIME | Fecha de creación automática |

---

## 🛡️ Seguridad

* Contraseñas encriptadas con **bcrypt**
* Autenticación con **JWT**
* Rutas protegidas con middleware
* No se exponen passwords en respuestas

---

## ⚠️ Manejo de errores

* `400` → Datos inválidos / usuario duplicado
* `401` → Token requerido
* `403` → Token inválido o expirado
* `500` → Error interno del servidor

---

## 📄 Licencia

MIT
