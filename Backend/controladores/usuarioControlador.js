const Usuario = require("../modelos/Usuario");

// ─── Helper: manejo centralizado de errores de Mongoose ───────────────────
const manejarErrorMongo = (error, respuesta) => {
  if (error.name === "ValidationError") {
    const mensajesDeError = Object.values(error.errors).map((e) => e.message);
    return respuesta.status(400).json({ error: "Error de validación.", detalles: mensajesDeError });
  }
  if (error.name === "CastError") {
    return respuesta.status(400).json({ error: "El ID proporcionado no tiene un formato válido." });
  }
  return respuesta.status(500).json({ error: error.message });
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
    console.log("¡COMPAÑERA, EL ERROR REAL ES ESTE! ->", error); // 👈 Agregá esta línea
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
        return res.status(500).json({ error: error.message });
    }
};

// -- POST /api/usuarios/login --
const iniciarSesion = async (req, res) => {
    try {
        const { email, contraseña } = req.body;

        const usuario = await Usuario.findOne({ email }).select("+contraseña");

        if (!usuario) {
            return res.status(401).json({
                mensaje: "Usuario no encontrado"
            });
        }

        if (usuario.contraseña !== contraseña) {
            return res.status(401).json({
                mensaje: "Contraseña incorrecta"
            });
        }

        // Si pasa las validaciones, loguea con éxito
        const respuesta = usuario.toObject();
        delete respuesta.contraseña;

        res.status(200).json({
            mensaje: "Inicio de sesión exitoso.",
            usuario: respuesta
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Exportamos las funciones correspondientes
module.exports = {
    registrarUsuario,
    obtenerPerfil,
    iniciarSesion
};
// Función para iniciar sesión (Login)
const loginUsuario = async (req, res) => {
    try {
        const { email, contraseña } = req.body;

        // 1. Validar que vengan ambos campos
        if (!email || !contraseña) {
            return res.status(400).json({ error: "El email y la contraseña son obligatorios." });
        }

        // 2. Buscar al usuario por email e incluir la contraseña (ya que tiene select: false en el modelo)
        const usuario = await Usuario.findOne({ email }).select("+contraseña");
        
        if (!usuario) {
            return res.status(401).json({ error: "Credenciales inválidas. El usuario no existe." });
        }

        // 3. Verificar si el usuario está activo (baja lógica)
        if (!usuario.activo) {
            return res.status(403).json({ error: "Esta cuenta se encuentra desactivada." });
        }

        // 4. [IMPORTANTE] Comparar contraseñas
        // NOTA: Si usan bcrypt para encriptar, acá原 usan: await bcrypt.compare(contraseña, usuario.contraseña)
        // Por ahora, para probar que el flujo conecte, hacemos una comparación directa:
        if (usuario.contraseña !== contraseña) {
            return res.status(401).json({ error: "Credenciales inválidas. Contraseña incorrecta." });
        }

        // 5. Responder con éxito (acá más adelante van a generar el Token JWT)
        res.status(200).json({
            mensaje: "¡Inicio de sesión exitoso!",
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                roles: usuario.roles
            }
        });

    } catch (error) {
        console.error("🔥 Error en el login:", error);
        res.status(500).json({ error: "Error interno del servidor al iniciar sesión." });
    }
};

// No te olvides de exportarlo al final del archivo junto con el registro:
module.exports = { registrarUsuario, loginUsuario };