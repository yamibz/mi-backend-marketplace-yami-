const express = require("express");
const router = express.Router();
const { registrarUsuario, loginUsuario } = require("../controladores/usuarioControlador");

// Ruta para registrarse
router.post("/registro", registrarUsuario);

// Ruta para iniciar sesión (Login)
router.post("/login", loginUsuario);

module.exports = router;