const express = require("express");
const router = express.Router();

const {
  registrarUsuario,
  obtenerPerfil,
  iniciarSesion,
} = require("../controladores/usuarioControlador");

// Registro
router.post("/registro", registrarUsuario);

// Login
router.post("/login", iniciarSesion);

// Obtener perfil por ID
router.get("/:id", obtenerPerfil);

module.exports = router;