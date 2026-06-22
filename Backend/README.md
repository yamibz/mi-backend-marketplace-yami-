# 🛒 Mi Backend Marketplace - EquipYa

¡Bienvenido al repositorio del backend para el marketplace de EquipYa! Este sistema maneja la lógica de servidores, base de datos y autenticación para la plataforma.

## 🚀 Tecnologías Utilizadas
* **Node.js** (Entorno de ejecución)
* **Express** (Framework para el servidor HTTP)
* **MongoDB & Mongoose** (Base de datos NoSQL y ODM)
* **Dotenv** (Manejo de variables de entorno)
* **CORS** (Intercambio de recursos de origen cruzado)

---

## 📦 Instalación y Configuración

Para replicar este proyecto localmente, seguí estos pasos:

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/MarcosRuizDiaz18/mi-backend-marketplace.git](https://github.com/MarcosRuizDiaz18/mi-backend-marketplace.git) 

## Registro de cambios

### 21/06/2026 - Implementación de autenticación

#### Objetivo
Implementar y verificar el funcionamiento del sistema de autenticación de usuarios del backend.

#### Tareas realizadas
- Implementación del endpoint de inicio de sesión (`POST /api/usuarios/login`).
- Verificación del endpoint de registro (`POST /api/usuarios/registro`).
- Integración de bcrypt para el almacenamiento seguro de contraseñas.
- Validación de credenciales mediante `bcrypt.compare()`.
- Exclusión de la contraseña en las respuestas de la API.
- Pruebas de funcionamiento utilizando Postman.

#### Pruebas realizadas
- Registro exitoso de nuevos usuarios.
- Inicio de sesión exitoso con credenciales válidas.
- Rechazo de credenciales inválidas.
- Verificación de almacenamiento seguro de contraseñas en MongoDB.
- Conexión exitosa a la base de datos mediante Radmin VPN.

#### Estado actual
- ✅ Registro de usuarios operativo.
- ✅ Inicio de sesión operativo.
- ✅ Integración de bcrypt operativa.
- ✅ Conexión a MongoDB operativa.

#### Pendiente
- Implementación de autenticación mediante JWT.
- Protección de rutas privadas.