const Usuario = require("../modelos/Usuario");

// ─── Helper: manejo centralizado de errores de Mongoose ───────────────────
const manejarErrorMongo = (error, respuesta) => {
  if (error.name === "ValidationError") {
    const mensajesDeError = Object.values(error.errors).map((e) => e.message);
    return respuesta.status(400).json({
      error: "Error de validación.",
      detalles: mensajesDeError,
    });
  }

  if (error.name === "CastError") {
    return respuesta.status(400).json({
      error: "El ID proporcionado no tiene un formato válido.",
    });
  }

  return respuesta.status(500).json({
    error: error.message,
  });
};

// -- POST /api/usuarios/registro --
const registrarUsuario = async (req, res) => {
  try {
    const nuevoUsuario = new Usuario(req.body);
    const usuarioGuardado = await nuevoUsuario.save();

    const respuesta = usuarioGuardado.toObject();
    delete respuesta.contraseña;

    res.status(201).json({
      mensaje: "Usuario registrado exitosamente.",
      usuario: respuesta,
    });
  } catch (error) {
    console.log("🔥 Error al registrar usuario:", error);
    manejarErrorMongo(error, res);
  }
};

// -- GET /api/usuarios/:id --
const obtenerPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select("-contraseña");

    if (!usuario) {
      return res.status(404).json({
        mensaje: `No se encontró ningún usuario con el ID: ${req.params.id}`,
      });
    }

    if (!usuario.activo) {
      return res.status(404).json({
        mensaje: "Este usuario no está disponible",
      });
    }

    res.status(200).json({ usuario });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// -- POST /api/usuarios/login --
const iniciarSesion = async (req, res) => {
  try {
    const { email, contraseña } = req.body;

    if (!email || !contraseña) {
      return res.status(400).json({
        error: "El email y la contraseña son obligatorios.",
      });
    }

    const usuario = await Usuario.findOne({ email }).select("+contraseña");

    if (!usuario) {
      return res.status(401).json({
        mensaje: "Usuario no encontrado",
      });
    }

    if (!usuario.activo) {
      return res.status(403).json({
        mensaje: "Esta cuenta se encuentra desactivada.",
      });
    }

    const esValida = await usuario.compararContraseña(contraseña);
    if (!esValida) {
      return res.status(401).json({
        mensaje: "Contraseña incorrecta",
      });
    }

    const respuesta = usuario.toObject();
    delete respuesta.contraseña;

    res.status(200).json({
      mensaje: "Inicio de sesión exitoso.",
      usuario: respuesta,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// Exportaciones
module.exports = {
  registrarUsuario,
  obtenerPerfil,
  iniciarSesion,
};