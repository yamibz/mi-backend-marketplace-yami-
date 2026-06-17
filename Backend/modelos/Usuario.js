const mongoose = require("mongoose");

// ── Sub-esquema: Perfil profesional ───────────────────────────────
// Se activa solo cuando el usuario tiene el rol "profesional".
// { _id: false } mantiene consistencia con el sub-esquema de vendedor.
const perfilProfesionalSchema = new mongoose.Schema(
    {
        oficio: {
            type: String,
            enum: {
                values: ["plomero", "electricista", "gasista", "carpintero", "pintor", "otro"],
                message: 'El oficio "{VALUE}" no es válido.',
            },
        },
        descripcion: {
            type: String,
            trim: true,
            maxlength: [300, "La descripción no puede superar los 300 caracteres."],
        },
        preciohora: {
            type: Number,
            min: [0, "El precio por hora no puede ser negativo."],
        },
        zona: {
            type: String,
            trim: true,
        },
    },
    { _id: false }
);

// ── Esquema principal: Usuario ────────────────────────────────────
const usuarioSchema = new mongoose.Schema(
    {
        // Identidad
        nombre: {
            type: String,
            required: [true, "El nombre es obligatorio."],
            trim: true,
        },
        apellido: {
            type: String,
            required: [true, "El apellido es obligatorio."],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "El email es obligatorio."],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "El formato de email no es válido."],
        },
        contraseña: {
            type: String,
            required: [true, "La contraseña es obligatoria."],
            minlength: [6, "La contraseña debe tener al menos 6 caracteres."],
            select: false, // Nunca se devuelve en queries por seguridad
        },
        telefono: {
            type: String,
            trim: true,
        },

        // Foto de perfil
        fotoPerfil: {
            type: String,
            default: null,
        },

        // Roles
        roles: {
            type: [String],
            enum: {
                values: ["cliente", "Dueño", "Profesional"],
                message: 'El rol "{VALUE}" no es válido.', 
            },
            default: ["cliente"],
        },

        // Perfil profesional (solo relevante si roles incluye "Profesional")
        perfilProfesional: perfilProfesionalSchema,

        // Reputación
        puntuacion: {
            type: Number,
            default: 0,
            min: [0, "La puntuación no puede ser menor a 0"],
            max: [5, "La puntuación no puede ser mayor a 5"],
        },
        cantidadReseñas: {
            type: Number,
            default: 0,
        },

        // Control de cuenta
        activo: {
            type: Boolean,
            default: true,
        },
    },
    {
        // Agrega automáticamente fechaRegistro y fechaActualizacion
        timestamps: { createdAt: "fechaRegistro", updatedAt: "fechaActualizacion" },
    }
);

// --- Índices ---
usuarioSchema.index({ roles: 1 });

// --- Validación condicional ---
usuarioSchema.pre("save", function () {
    if (this.roles.includes("Profesional") && !this.perfilProfesional?.oficio) {
        throw new Error("Un usuario profesional debe indicar su oficio en el perfil.");
    }
});

module.exports = mongoose.model("Usuario", usuarioSchema);