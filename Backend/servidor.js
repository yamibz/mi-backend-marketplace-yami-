require("dotenv").config();
const express = require("express");
const cors = require("cors");
const conectarBaseDeDatos = require("./configuracion/baseDeDatos");

const app = express();
const PUERTO = process.env.PUERTO || 3000;

// ─── Conexión a la base de datos ───────────────────────────────────────────
conectarBaseDeDatos();

// ─── Middlewares globales ──────────────────────────────────────────────────
app.use(cors());                                // Permite peticiones desde el frontend (React/Vite)
app.use(express.json());                        // Parsea body en formato JSON
app.use(express.urlencoded({ extended: true })); // Parsea body de formularios

// ─── Middleware de logging (desarrollo) ───────────────────────────────────
if (process.env.NODE_ENV !== "produccion") {
  app.use((solicitud, respuesta, siguiente) => {
    console.log(`[${new Date().toLocaleTimeString("es-AR")}] ${solicitud.method} ${solicitud.url}`);
    siguiente();
  });
}

// ─── Rutas ─────────────────────────────────────────────────────────────────

// Ruta de prueba / health-check
app.get("/api/estado", (solicitud, respuesta) => {
  respuesta.json({
    mensaje: "¡Servidor funcionando correctamente!",
    entorno: process.env.NODE_ENV || "desarrollo",
    hora: new Date().toLocaleString("es-AR"),
  });
});

const rutasArticulos = require("./rutas/articuloRutas");
app.use("/api/articulos", rutasArticulos);

// Rutas de Usuarios (Registro y Login)
const rutasUsuarios = require("./rutas/usuarioRutas");
app.use("/api/usuarios", rutasUsuarios);

// ─── Middleware de errores 404 ─────────────────────────────────────────────
app.use((solicitud, respuesta) => {
  respuesta.status(404).json({ error: "Ruta no encontrada." });
});

// ─── Middleware de errores globales ───────────────────────────────────────
app.use((error, solicitud, respuesta, siguiente) => {
  console.error("🔥 Error interno:", error.message);
  respuesta.status(error.estado || 500).json({
    error: error.message || "Error interno del servidor.",
  });
});

// ─── Inicio del servidor ───────────────────────────────────────────────────
app.listen(PUERTO, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PUERTO}`);
});

module.exports = app; // Exportado para los tests con Jest